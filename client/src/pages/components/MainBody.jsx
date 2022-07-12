import React from "react";
import Footer from "./Footer";
import PostList from "./PostList";
import TopPost from "./TopPost";

export default function MainBody() {
  return (
    <React.Fragment>
      <div className="container-lg">
        <div className="pb-2 border-bottom border-dark fw-bold m-md-3 m-1">
          <span className="fs-3 font-primary">Post of the Day</span>
        </div>
        <TopPost />
        <div className="pb-2 border-bottom border-dark fw-bold m-md-3 m-1">
          <span className="fs-3 font-primary">Public Posts</span>
        </div>
        <PostList />
      </div>
    </React.Fragment>
  );
}
