import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";
import Navbar from "./components/Navbar";

export default function CreateBlog() {
  const [imgToggle, setImgToggle] = useState();
  const imgURL =
    "https://images.unsplash.com/photo-1656173460244-faad38c026e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

  const [datestamp, setDatestamp] = useState(
    new Date().toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const [imgSource, setImgSource] = useState("");
  const [cardTitle, setCardTitle] = useState("Untitled");
  const [cardDescription, setCardDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [success, setSuccess] = useState(undefined);
  const [author, setAuthor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/", { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setAuthor({
          username: details.username,
          name: details.name,
        });
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
        datestamp: datestamp,
      };

      fetch("/blogs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(blogPost),
      })
        .then((data) => {
          console.log(data);
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
        <h5 className="p-2 text-center">Loading...</h5>
      ) : (
        <React.Fragment>
          <Navbar />
          {!author.name ? (
            <React.Fragment>
              <h5 className="p-2 text-center">Not Authorised.</h5>
              <h5 className="p-2 text-center">Please Login/Signup.</h5>
            </React.Fragment>
          ) : (
            <div className="container-fluid">
              <div className="row m-0 p-0 gy-2 justify-content-center">
                <div className="col-lg-3 col-md-8">
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
                        defaultValue={cardTitle}
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
                  <div className="col mt-2">
                    <div className="col p-md-3 p-2 border bg-white shadow-sm">
                      <h4 className="fw-bold fs-3 font-primary">
                        <i className="bi bi-gear pe-2 align-text-bottom fs-3"></i>
                        Settings
                      </h4>
                      <div className="settings p-2">
                        <div className="form-check form-check">
                          <input
                            className="form-check-input p-2"
                            type="checkbox"
                            value=""
                            id="private"
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
                <div className="col-lg-6 col-md-12 p-md-3 bg-white border">
                  {success !== undefined ? (
                    success ? (
                      <div className="alert alert-success" role="alert">
                        Successfully Posted!
                      </div>
                    ) : (
                      <div className="alert alert-danger" role="alert">
                        Failed
                      </div>
                    )
                  ) : null}
                  <h4 className="fw-bold fs-2 text-center font-primary">
                    Write your Blog!
                  </h4>
                  <Editor parentSave={createBlog} readOnly={success} />
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
