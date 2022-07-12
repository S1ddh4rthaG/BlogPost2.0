import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function TopPost(props) {
  const src =
    "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80";
  const history = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/blogs/top")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  function handleLink() {
    history("/blogs/id=" + data.id);
  }
  return (
    <div className="row m-0 p-0 mb-lg-0 mb-5 justify-content-center">
      <div className="col-lg-8 col-md-8 p-md-3 p-1">
        <div className="card border text-start" onClick={handleLink}>
          <img
            src={data.bgImage || src}
            className="card-img-top shadow-sm rounded-1"
            alt="..."
          />
          <div className="card-body overlay text-white w-100 pt-5 pb-2">
            <div className="d-flex flex-row justify-content-between">
              <h5 className="card-title mb-0 fw-bold">{data.title} </h5>
              <div>
                <span className="p-1">
                  <i className="bi bi-heart-fill text-danger align-middle"></i>
                  <span className="pt-2 pb-2 ps-1">{data.likes || ""}</span>
                </span>
                <span className="p-1">
                  <i className="bi bi-chat-left-text-fill text-primary align-middle"></i>
                  <span className="pt-2 pb-2 ps-1">
                    {data.comments
                      ? data.comments.length
                        ? data.comments.length
                        : ""
                      : ""}
                  </span>
                </span>
              </div>
            </div>

            <p className="card-text m-0">{data.description}</p>
            <div className="w-100 text-end">
              <small className="fw-bold card-subtitle">
                {moment(data.datestamp).format("DD-MM-YYYY hh:mmA")}
              </small>
            </div>
            <p className="author text-white fw-bold text-center">
              ~ {data.authorName} ~
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
