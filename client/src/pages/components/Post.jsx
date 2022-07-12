import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Post(props) {
  const imgURL =
    "https://images.unsplash.com/photo-1493673272479-a20888bcee10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
  const history = useNavigate();
  const {
    id,
    authorName,
    title,
    description,
    bgImage,
    datestamp,
    likes,
    comments,
  } = props.data;
  const [like, setLike] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/like/" + id, { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data)
          setLike({
            isLiked: data.isLiked,
            likes: likes,
          });
        setLoading(false);
      })
      .catch((err) => {
        setLike({
          isLiked: false,
          likes: likes,
        });
        setLoading(false);
      });
  }, []);

  function handleLike() {
    fetch("/api/like/", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setLike({
          isLiked: true,
          likes: data.likes,
        });
      });
  }

  function handleUnLike() {
    fetch("/api/unlike/", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setLike({
          isLiked: false,
          likes: data.likes,
        });
      });
  }

  function handleLink() {
    history("/blogs/id=" + id);
  }

  return (
    <React.Fragment>
      {loading ? (
        <h5 className="p-2 text-center">Loading...</h5>
      ) : (
        <div className="post-container col-lg-4 col-md-6 p-md-3 p-1">
          <div className="card border pb-2 rounded-2 text-start shadow-sm">
            <img
              src={bgImage || imgURL}
              onClick={handleLink}
              className="card-img-top shadow-sm rounded-2"
              alt="..."
            />
            <div className="card-body mt-1 mb-0 pb-0">
              <h6
                className="card-subtitle mb-3 text-muted fw-bold"
                style={{ fontSize: "0.9rem" }}
              >
                {datestamp}
              </h6>
              <h5 className="card-title mb-2 fw-bold" onClick={handleLink}>
                {title}
              </h5>
              <p className="card-text mb-1">{description}</p>
              <p className="author text-muted text-center">~ {authorName} ~</p>
            </div>
            <div className="row mx-2 text-end position-relative end-0 ">
              <div>
                <button
                  className="btn fs-5 border-0 text-danger"
                  onClick={!like.isLiked ? handleLike : handleUnLike}
                >
                  <i
                    className={
                      "bi align-middle bi-heart" + (like.isLiked ? "-fill" : "")
                    }
                  ></i>
                  <span className="ps-1">{like.likes || ""}</span>
                </button>
                <button className="btn fs-5 border-0 text-primary">
                  <i className="bi bi-chat-left-text align-middle"></i>
                  <span className="ps-1">{comments.length || ""}</span>
                </button>
                <button className="btn fs-5 border-0 text-success">
                  <i className="bi bi-share align"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
