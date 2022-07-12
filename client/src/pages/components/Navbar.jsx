import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [author, setAuthor] = useState();
  const history = useNavigate();

  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.name) {
          setAuthor(data);
        } else {
          setAuthor(false);
        }
      });
  }, []);

  function handleLogout() {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAuthor(false);
        } else {
          console.log("Failed");
        }
      });
  }
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg d-none d-md-block bg-white shadow-sm mb-4">
        <div className="d-flex flex-row justify-content-between w-100 px-2">
          <div className="p-1">
            <a
              className="navbar-brand my-auto fs-1 fw-bold font-primary"
              href="/#"
            >
              BlogPost
            </a>
          </div>
          <div className="p-1 my-auto">
            <span className="btn border-0 rounded-0 border-bottom border-dark fs-5 mx-2 font-secondary">
              <Link to="/blogs/create">Create Blog!</Link>
            </span>
            <span className="btn border-0 rounded-0 border-bottom border-dark fs-5 mx-2 font-secondary">
              <Link to="/blogs/created">My Blogs</Link>
            </span>
          </div>
          <div className="p-1 my-auto mx-3">
            {author ? (
              <div className="p-2">
                <span className="fw-bold fs-6 font-secondary align-middle p-1">
                  {author.name}
                </span>
                <button
                  className="ms-2 btn btn-transparent fs-5 font-secondary"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            ) : (
              <div>
                <span className="btn border-0 rounded-0 border-bottom border-dark fs-6 mx-2 font-secondary">
                  <Link to="/login">Login </Link>/
                  <Link to="/signup"> Signup</Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>
      <nav className="navbar d-block d-md-none bg-white shadow-sm mb-4">
        <div className="d-flex flex-column justify-content-between text-center w-100 px-2">
          <div
            className={
              "p-1 d-flex justify-content-" + (author ? "between" : "center")
            }
          >
            <a
              className="navbar-brand my-auto fs-1 fw-bold font-primary"
              href="/#"
            >
              BlogPost
            </a>
            {author ? (
              <div className="p-1">
                <span className="fw-bold my-auto fs-6 font-secondary align-middle p-1">
                  {author.name}
                </span>
                <button
                  className="ms-2 btn fs-5 btn-transparent font-secondary"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className={
              "p-1 my-auto d-flex flex-row justify-content-" +
              (author ? "center" : "between")
            }
          >
            <span className="btn border-0 rounded-0 border-bottom border-dark fs-6 mx-2 font-secondary">
              <Link to="/blogs/create">Create Blog!</Link>
            </span>
            <span className="btn border-0 rounded-0 border-bottom border-dark fs-6 mx-2 font-secondary">
              <Link to="/blogs/created">My Blogs</Link>
            </span>
            {!author ? (
              <span className="btn border-0 rounded-0 border-bottom border-dark fs-6 mx-2 font-secondary">
                <Link to="/login">Login </Link>/
                <Link to="/signup"> Signup</Link>
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}
