import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatedPost from "./CreatedPost";

export default function CreatedPostList() {
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeloading, setLikeLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    fetch("/api/like/", { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLiked(data);
        setLikeLoading(false);
      });

    fetch("/blogs/create", { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
          setLoading(false);
        } else {
          history("/");
        }
      });
  }, []);

  return (
    <div className="row gx-2 gy-2">
      {loading && likeloading ? (
        <h5 className="p-2 text-center">Loading...</h5>
      ) : (
        React.Children.toArray(
          posts &&
            posts.map((post) => {
              const isLiked = liked.includes(post.id);
              return <CreatedPost data={post} isLiked={true && isLiked} />;
            })
        )
      )}
    </div>
  );
}
