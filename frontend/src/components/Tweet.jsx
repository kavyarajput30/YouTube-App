import { useEffect } from "react";
import { useState } from "react";
import {Link} from 'react-router-dom'
import axios from "axios";
const Tweet = () => {
  const [tweets, setAllTweets] = useState([]);
  const [newTweet, setNewTweet] = useState({ content: "" });
  const getAllTweets = async () => {
    const id = "660e5af6798859e9c396471b";
    const res = await axios.get(
      `http://localhost:8000/api/v1/tweets/user/${id}`,
      { withCredentials: true }
    );
    if (res.data.success) {
      console.log(res.data.data);
      setAllTweets(res.data.data);
    }
  };
  useEffect(() => {
    getAllTweets();
  }, []);

  const addTweet = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `http://localhost:8000/api/v1/tweets/`,
      newTweet,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    if (res.data.success) {
      setNewTweet({ content: "" });
      getAllTweets();
    }
  };

  const deleteTweet = async (id) => {
    const res = await axios.delete(
      `http://localhost:8000/api/v1/tweets/${id}`,
      { withCredentials: true }
    );
    if (res.data.success) {
      getAllTweets();
    }
  }

  return (
    <div style={{ backgroundColor: "pink", width: "50%", margin: "auto" }}>
      <h1 className="text-center">All Tweets</h1>
      <div>
        {tweets.map((tweet) => {
          return (
            <div key={tweet?._id} className="border rounded p-3 w-50 mb-3">
              <p>{tweet?.content}</p>
              <div>
                <button className="btn btn-danger btn-sm" onClick={(id)=>deleteTweet(tweet._id)}>Delete</button>
              <Link to={`/tweet/edit/${tweet?._id}`}>
                  Edit
              
              </Link>
               
              </div>

              <p>{tweet?.owner}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5" style={{ backgroundColor: "purple" }}>
        <h1 className="text-center">Add Tweet</h1>
        <div className="text-center p-5">
          <form onSubmit={addTweet}>
            <textarea
              placeholder="write your tweet here........"
              className="form-control"
              rows={3}
              value={newTweet.content}
              onChange={(e) =>
                setNewTweet({ ...newTweet, content: e.target.value })
              }
            />
            <button className="btn btn-primary mt-3">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Tweet;
