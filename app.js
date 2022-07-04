//Server
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const cors = require("cors");

const PORT = 5000 || process.env.PORT;
const AtlasRemote = process.env.ATLAS_URL;
const sessionSecret = process.env.SESSION_SECRET;

const app = express();
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "HEAD", "OPTIONS"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(AtlasRemote);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },
  password: String,
  articles: {
    liked: [mongoose.Types.ObjectId],
    created: [mongoose.Types.ObjectId],
  },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    bgImage: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    datestamp: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    votes: {
      likes: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    comments: [
      {
        username: String,
        comment: String,
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("userDB", userSchema);
const Blog = mongoose.model("blogDB", blogSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//ROUTE: /login
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) res.status(500).json({ error: err });
    else {
      res.json({});
    }
  });
});

app.post("/login", (req, res) => {
  const userAttempt = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(userAttempt, (err) => {
    if (err) {
      res.status(401).json({});
    } else {
      passport.authenticate("local")(req, res, () => {
        res.status(200).json({});
      });
    }
  });
});

//ROUTE: /signup
app.post("/signup", (req, res) => {
  User.register(
    { username: req.body.username, name: req.body.name },
    req.body.password,
    (err, user) => {
      if (err) {
        res.status(401).json({});
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).json({});
        });
      }
    }
  );
});

app.get("/blogs/id=:blogID", (req, res) => {
  if (req.params.blogID) {
    Blog.findOne({ _id: req.params.blogID }, (err, blog) => {
      if (err) res.status(500).json({ error: err });
      else {
        if (
          (req.isAuthenticated() &&
            req.user.articles.created.includes(blog._id)) ||
          (blog && !blog.isPrivate)
        ) {
          const blogView = {
            id: blog._id,
            title: blog.title,
            description: blog.description,
            content: JSON.parse(blog.content || "{}"),
            bgImage: blog.bgImage,
            datestamp: blog.datestamp,
            authorName: blog.authorName,
            likes: blog.votes.likes,
            comments: blog.comments.map((cmt) => {
              return {
                id: cmt._id,
                username: cmt.username,
                comment: cmt.comment,
                timestamp: cmt.date,
                isDeletable: req.user && cmt.username === req.user.username,
              };
            }),
          };
          res.json(blogView);
        } else {
          res.status(401).json({});
        }
      }
    });
  } else {
    res.status(400).json({});
  }
});

//ROUTE:/blogs/public
app.get("/blogs/public", (req, res) => {
  Blog.find({ isPrivate: false })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) res.status(500).json({ error: err });
      else {
        const blogs = result.map((blog) => {
          return {
            id: blog._id,
            title: blog.title,
            description: blog.description,
            bgImage: blog.bgImage,
            datestamp: blog.datestamp,
            authorName: blog.authorName,
            likes: blog.votes.likes,
            comments: blog.comments,
          };
        });
        res.json(blogs);
      }
    });
});

app.get("/blogs/top", (req, res) => {
  Blog.findOne({ isPrivate: false })
    .sort({ "votes.likes": -1 })
    .sort({ createdAt: -1 })
    .exec((err, blog) => {
      if (err) res.status(500).json({ error: err });
      else {
        let topBlog;
        if (!blog) res.status(500).send();
        if (blog) {
          topBlog = {
            id: blog._id,
            title: blog.title,
            description: blog.description,
            bgImage: blog.bgImage,
            datestamp: blog.createdAt,
            authorName: blog.authorName,
            likes: blog.votes.likes,
            comments: blog.comments,
          };
          res.json(topBlog);
        }
      }
    });
});

//ROUTE:/blogs/create
app.get("/blogs/create", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id } = req.user;
    User.findOne({ _id: _id }, (err, result) => {
      if (err) res.status(500).json({ error: err });
      else {
        let createdArray = result.articles.created;
        Blog.find({ _id: { $in: createdArray } }, (err, result) => {
          const blogs = result.map((blog) => {
            return {
              id: blog._id,
              title: blog.title,
              description: blog.description,
              bgImage: blog.bgImage,
              datestamp: blog.datestamp,
              authorName: blog.authorName,
              isPrivate: blog.isPrivate,
              likes: blog.votes.likes,
              comments: blog.comments,
            };
          });
          res.json(blogs);
        });
      }
    });
  } else {
    res.status(401).json({});
  }
});

app.post("/blogs/create", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, username, name } = req.user;
    const { title, description, bgImage, content, datestamp, isPrivate } =
      req.body;
    const blogPost = Blog({
      title: title,
      description: description,
      bgImage: bgImage,
      content: JSON.stringify(content),
      datestamp: datestamp,
      authorName: name,
      username: username,
      isPrivate: isPrivate,
    });

    blogPost.save((err, savedPost) => {
      if (err) res.status(500).json({ error: err });
      else {
        User.findByIdAndUpdate(
          { _id: _id },
          { $push: { "articles.created": savedPost.id } },
          (err) => {
            if (err) res.send();
            else {
              res.status(200).send();
            }
          }
        );
      }
    });
  } else {
    res.status(401).json({});
  }
});

//ROUTE: /blogs/edit
app.get("/blogs/edit/id=:id", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id } = req.user;
    const id = req.params.id;
    User.findOne({ _id: _id }, (err, result) => {
      if (err) res.status(500).json({ error: err });
      else {
        let createdArray = result.articles.created;

        if (createdArray.includes(id)) {
          Blog.findOne({ _id: id }, (err, blog) => {
            const blogEdit = {
              id: blog._id,
              title: blog.title,
              description: blog.description,
              bgImage: blog.bgImage,
              content: JSON.parse(blog.content),
              datestamp: blog.datestamp,
              authorName: blog.authorName,
              isPrivate: blog.isPrivate,
            };

            res.json(blogEdit);
          });
        } else {
          res.status(401).json({});
        }
      }
    });
  } else {
    res.status(401).json({});
  }
});

app.post("/blogs/edit/id=:id", (req, res) => {
  const blogID = req.params.id;
  const { title, description, bgImage, content, datestamp, isPrivate } =
    req.body;

  if (req.isAuthenticated()) {
    User.findById({ _id: req.user.id }, (err, userResponse) => {
      if (err) res.status(500).json({ error: err });
      else {
        if (userResponse.articles.created.includes(blogID)) {
          Blog.findOneAndUpdate(
            { _id: blogID },
            {
              title: title,
              description: description,
              bgImage: bgImage,
              content: JSON.stringify(content),
              isPrivate: isPrivate,
            },
            (err) => {
              if (err) res.status(500).json({ error: err });
              else {
                res.status(200).json({});
              }
            }
          );
        } else {
          res.status(401).json({});
        }
      }
    });
  } else {
    res.status(401).json({ error: err });
  }
});

//APIs for Public Information:: ROUTE: /api/

// Description: {isPresent: BOOLEAN} :: True => User registered, FALSE => User not registered.
app.get("/api/user/:username", (req, res) => {
  const username = req.params.username;

  if (username === undefined || username === "") res.send();
  else {
    User.findOne({ username: username }, (err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        const present = result != undefined;
        res.json({ isPresent: present });
      }
    });
  }
});

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      username: req.user.username,
      name: req.user.name,
    });
  } else {
    res.status(401).json({});
  }
});

app.post("/api/like", (req, res) => {
  if (req.isAuthenticated()) {
    const blogID = req.body.id;
    User.findById({ _id: req.user._id }, (err, user) => {
      if (err) res.send();
      else {
        const liked = user.articles.liked;

        if (liked.includes(blogID)) {
          res.sendStatus(400);
        } else {
          User.findByIdAndUpdate(
            { _id: req.user._id },
            { $push: { "articles.liked": blogID } },
            (err) => {
              if (err) res.send("User push");
              else {
                Blog.findByIdAndUpdate(
                  { _id: blogID },
                  { $inc: { "votes.likes": 1 } },
                  (err, result) => {
                    if (err) res.json(err);
                    else {
                      res.json({ likes: result.votes.likes + 1 });
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  } else {
    res.status(401).send();
  }
});

app.post("/api/unlike", (req, res) => {
  if (req.isAuthenticated()) {
    const blogID = req.body.id;
    User.findById({ _id: req.user._id }, (err, user) => {
      if (err) res.send();
      else {
        const liked = user.articles.liked;

        if (!liked.includes(blogID)) {
          res.send(400).send();
        } else {
          User.findByIdAndUpdate(
            { _id: req.user._id },
            { $pull: { "articles.liked": blogID } },
            (err) => {
              if (err) res.send("User push");
              else {
                Blog.findByIdAndUpdate(
                  { _id: blogID },
                  { $inc: { "votes.likes": -1 } },
                  (err, result) => {
                    if (err) res.json(err);
                    else {
                      res.json({ likes: result.votes.likes - 1 });
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  } else {
    res.status(401).send();
  }
});

app.get("/api/like/", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById({ _id: req.user._id }, (err, user) => {
      if (err) res.send();
      else {
        const liked = user.articles.liked;
        res.status(200).json(liked);
      }
    });
  } else {
    res.status(401).send();
  }
});

app.get("/api/like/:id", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById({ _id: req.user._id }, (err, user) => {
      if (err) res.send();
      else {
        const liked = user.articles.liked;
        res.status(200).json({ isLiked: liked.includes(req.params.id) });
      }
    });
  } else {
    res.status(401).send();
  }
});

app.post("/api/comment/", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOneAndUpdate(
      { _id: req.body.id, isPrivate: false },
      {
        $push: {
          comments: {
            username: req.user.username,
            comment: req.body.comment,
          },
        },
      },
      { new: true },
      (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          const comments = resp.comments.map((cmt) => {
            return {
              id: cmt._id,
              username: cmt.username,
              comment: cmt.comment,
              timestamp: cmt.date,
              isDeletable: cmt.username === req.user.username,
            };
          });
          res.json(comments);
        }
      }
    );
  }
});

app.post("/api/uncomment/", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOneAndUpdate(
      { _id: req.body.id, isPrivate: false },
      {
        $pull: {
          comments: {
            _id: req.body.cid,
            username: req.user.username,
          },
        },
      },
      { new: true },
      (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          const comments = resp.comments.map((cmt) => {
            return {
              id: cmt._id,
              username: cmt.username,
              comment: cmt.comment,
              timestamp: cmt.date,
              isDeletable: cmt.username === req.user.username,
            };
          });
          res.json(comments);
        }
      }
    );
  }
});

app.post("/api/delete/", (req, res) => {
  if (req.isAuthenticated()) {
    const blogID = req.body.id;
    User.findById({ _id: req.user.id }, (err, userResponse) => {
      if (err) console.log(err);
      else {
        if (userResponse.articles.created.includes(blogID)) {
          Blog.findOneAndDelete({ _id: blogID }, (err) => {
            if (err) console.log(err);
            else {
              res.status(200).send();
            }
          });
        } else {
          res.status(200).send({ error: "Blog not found." });
        }
      }
    });
  } else {
    res.status(401).send();
  }
});

app.listen(PORT, (err) => {
  console.log("Server Started on port:" + PORT);
});
