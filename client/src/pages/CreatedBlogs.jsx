import React from "react";
import Navbar from "./components/Navbar";
import CreatedPostList from "./components/CreatedPostList";

export default function CreatedBlogs() {
  return (
    <React.Fragment>
      <Navbar />

      <div className="container-lg">
        <div className="pb-2 border-bottom border-dark fw-bold m-md-3 m-1">
          <span className="fs-4 font-primary">My Posts</span>
        </div>
        <CreatedPostList />
      </div>
    </React.Fragment>
  );
}
