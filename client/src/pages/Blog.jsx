import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import ReadOnlyEditor from "./components/ReadOnly";
import ViewPost from "./components/ViewPost";
import moment from "moment";

export default function Blog() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("Loading");

  function handleComment() {
    if (comment.length !== 0) {
      fetch("/api/comment/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, comment: comment }),
      })
        .then((res) => res.json())
        .then((data) => {
          setComments(data);
        });
    }
  }

  function handleUncomment(cid) {
    fetch("/api/uncomment/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, cid: cid }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      });
  }

  useEffect(() => {
    fetch("/blogs/id=" + id, {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          console.log("Data", data);
          setData(data);
          setComments(data.comments);
          setLoading(false);
        } else {
          setStatus("Not Found");
        }
      });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <div className="container-fluid pb-4">
        <div className="row justify-content-lg-start justify-content-md-center">
          {loading ? (
            <h1>{status}</h1>
          ) : (
            <React.Fragment>
              <ViewPost data={data} />
              <div className="col-lg-6 col-md-11 shadow-sm bg-white rounded-2">
                <ReadOnlyEditor data={data.content} />
              </div>
              <div className="col-lg-3 col-md-12">
                <div className="comments w-100 border p-2 bg-white rounded-2 my-2 shadow-sm">
                  <h3 className="fw-bold pb-0 p-2 font-primary">Comments</h3>
                  <div className="form p-1 pt-0">
                    <textarea
                      className="form-control"
                      placeholder="Write your comment here."
                      onChange={(event) => setComment(event.target.value)}
                    ></textarea>
                    <div className="w-100 text-end p-2">
                      <button
                        className="btn btn-secondary fw-bold"
                        onClick={handleComment}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                  <div className="list-group">
                    {comments.length === 0 ? (
                      <h6 className="text-center font-secondary">
                        No comments
                      </h6>
                    ) : (
                      <React.Fragment>
                        <div className="d-flex flex-column-reverse border-top">
                          {React.Children.toArray(
                            comments.map((cmt) => {
                              return (
                                <div className="list-group-item border-1 border flex-column align-items-start">
                                  <div className="d-flex w-100 justify-content-between align-middle">
                                    <small className="fw-bold font-secondary">
                                      {cmt.username}
                                    </small>
                                    <small className="font-teritary">
                                      {moment(cmt.timestamp).format(
                                        "DD-MM-YYYY hh:mmA"
                                      )}
                                      <button
                                        className="btn btn-transparent pt-0 pb-0 ms-1 p-1"
                                        onClick={() => handleUncomment(cmt.id)}
                                        hidden={!cmt.isDeletable}
                                      >
                                        <small>
                                          <i className="bi bi-trash-fill text-danger"></i>
                                        </small>
                                      </button>
                                    </small>
                                  </div>
                                  <p className="mb-1 font-secondary">
                                    {cmt.comment}
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
