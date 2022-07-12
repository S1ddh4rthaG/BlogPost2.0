import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "./components/Editor";
import Navbar from "./components/Navbar";

export default function EditBlog() {
  const [imgToggle, setImgToggle] = useState();
  const imgURL =
    "https://images.unsplash.com/photo-1557849645-169015563aa2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80";

  const [datestamp, setDatestamp] = useState(
    new Date().toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const [imgSource, setImgSource] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [success, setSuccess] = useState(undefined);
  const [author, setAuthor] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    fetch("/api/user/", { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setAuthor({
          username: details.username,
          name: details.name,
        });
      });
    fetch("/blogs/edit/id=" + id, {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data);
        console.log("Content", data.content);
        setCardTitle(data.title);
        setCardDescription(data.description);
        setImgSource(data.bgImage);
        setIsPrivate(data.isPrivate);
        setLoading(false);
      });
  }, []);

  function createBlog(editorData) {
    setDatestamp(
      new Date().toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    if (cardTitle !== "" && editorData.status) {
      const blogPost = {
        title: cardTitle,
        description: cardDescription,
        bgImage: imgSource,
        content: editorData.data,
        isPrivate: isPrivate,
      };

      fetch("/blogs/edit/id=" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(blogPost),
      })
        .then((data) => {
          if (data.status === 200) {
            setSuccess(true);
          } else {
            setSuccess(false);
          }
        })
        .catch((err) => {
          setSuccess(false);
        });
    }
  }
  return (
    <React.Fragment>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <React.Fragment>
          <Navbar />
          {!author ? (
            <h1>Not Authorised</h1>
          ) : (
            <div className="container-fluid pb-3">
              <div className="row m-0 p-0 gy-2 justify-content-center">
                <div className="col-lg-3 col-md-6">
                  <div className="card border pb-2 rounded-2 text-start">
                    <img
                      src={imgSource || imgURL}
                      className="card-img-top shadow-sm rounded-2 embed-responsive-4by3"
                      onClick={() => {
                        setImgToggle(!imgToggle);
                      }}
                      alt="..."
                    />
                    <div
                      className={
                        "col mt-2 p-2 " + (imgToggle ? "d-block" : "d-none")
                      }
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Image URL"
                        readOnly={success}
                        onChange={(event) => {
                          setImgSource(event.target.value);
                        }}
                      />
                    </div>
                    <div className="card-body pb-0">
                      <h6
                        className="card-subtitle mb-3 text-muted fw-bold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {datestamp}
                      </h6>
                      <input
                        className={"card-title mb-2 w-100 fs-5 fw-bold".concat(
                          cardTitle === ""
                            ? " rounded-2 border border-2 border-danger"
                            : " border-0"
                        )}
                        value={cardTitle}
                        placeholder="Title"
                        readOnly={success}
                        rows={1}
                        onChange={(event) => {
                          setCardTitle(event.target.value);
                        }}
                      />
                      <textarea
                        className="card-text w-100 border-0"
                        defaultValue={cardDescription}
                        placeholder="Description"
                        readOnly={success}
                        onChange={(event) => {
                          if (event.target.value !== "") {
                            setCardDescription(event.target.value);
                          }
                        }}
                      />
                      <p className="author text-muted text-center">
                        ~ {author.name} ~
                      </p>
                    </div>
                  </div>
                  <div className="col mt-2 bg-white">
                    <div className="col p-md-3 p-2 border shadow-sm">
                      <h4 className="fw-bold fs-3">
                        <i className="bi bi-gear pe-2 align-text-top fs-3"></i>
                        Settings
                      </h4>
                      <div className="settings p-2">
                        <div className="form-check form-check">
                          <input
                            className="form-check-input p-2"
                            type="checkbox"
                            value=""
                            id="private"
                            checked={isPrivate}
                            disabled={success}
                            onClick={() => {
                              setIsPrivate(!isPrivate);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="reverseCheck1"
                          >
                            Private
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 p-md-3 border bg-white">
                  {success !== undefined ? (
                    success ? (
                      <div className="alert alert-success" role="alert">
                        Successfully Edited!
                      </div>
                    ) : (
                      <div className="alert alert-danger" role="alert">
                        Failed
                      </div>
                    )
                  ) : null}
                  <h4 className="fw-bold fs-2 text-center">Write your Blog!</h4>
                  {data.content ? (
                    <Editor
                      parentSave={createBlog}
                      content={data.content}
                      readOnly={success}
                    />
                  ) : undefined}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
