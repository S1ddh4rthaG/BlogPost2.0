import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [failed, setFailed] = useState(false);
  const history = useNavigate();

  function handleSubmit() {
    fetch("/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password,
      }),
    }).then((res) => {
      if (res.status === 200) {
        history("/");
      } else {
        setFailed(true);
      }
    });
  }

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg bg-transparent position-absolute">
        <a
          className="navbar-brand d-none d-md-block px-5 my-3 fs-1 fw-bold text-white font-primary"
          href="/#"
        >
          BlogPost
        </a>
        <a
          className="navbar-brand d-block d-md-none px-5 my-3 fs-1 fw-bold text-dark font-primary"
          href="/#"
        >
          BlogPost
        </a>
      </nav>
      <div className="container-fluid vh-100 bg-white">
        <div className="row h-100">
          <div
            className="col-lg-4 d-none d-lg-block"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1580440174847-8eef6e5beb72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80) no-repeat',
            }}
          ></div>
          <div className="col-lg-8 my-auto">
            {failed ? (
              <div className="alert alert-danger" role="alert">
                Signup Failed
              </div>
            ) : null}

            <div className="col-lg-6 col-md-8 col-12 mx-auto ">
              <h1 className="fw-bold text-center font-primary">
                Join BlogPost
              </h1>
              <div className="m-4">
                <div className="form-group mb-3">
                  <label htmlFor="name" className="fw-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    id="name"
                    placeholder="Fullname"
                    required={true}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  ></input>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="username" className="fw-bold">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    id="username"
                    placeholder="Username"
                    required={true}
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="fw-bold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    id="password"
                    required={true}
                    placeholder="Password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  ></input>
                </div>
                <div className="row m-0 mt-3">
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary fw-bold font-secondary"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
