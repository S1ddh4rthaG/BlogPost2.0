import React, { useEffect, useState } from "react";
import Post from "./Post";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeloading, setLikeLoading] = useState(true);

  useEffect(() => {
    fetch("/api/like/", { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLiked(data);
        setLikeLoading(false);
      });

    fetch("/blogs/public")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="row gx-2 gy-2">
      {loading && likeloading ? (
        <h5 className="p-2 text-center">Loading...</h5>
      ) : (
        React.Children.toArray(
          posts.map((post) => {
            const isLiked = liked.includes(post.id);
            return <Post data={post} isLiked={true && isLiked} />;
          })
        )
      )}
    </div>
  );
}
