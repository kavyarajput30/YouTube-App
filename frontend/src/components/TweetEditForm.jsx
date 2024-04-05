import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const TweetEditForm = () => {
  const [tweet, setNewTweet] = useState({});
  const { id } = useParams();
  
  const getTweet = async () => {
    const res = await axios.get(`http://localhost:8000/api/v1/tweets/${id}`, {
      withCredentials: true,
    });
    if (res.data.success) {
      console.log(res.data.data.content);
      setNewTweet(res.data.data.content);
    }
}
    useEffect(() => {
      getTweet();
    }, []);


 const EditTweet = async ()=>{
   const res= await axios.patch(`http://localhost:8000/api/v1/tweets/${id}` , {content: tweet} , {withCredentials: true});
//    console.log(res.data);
   if(res.data.success){
    window.location.reload();
   }

 }

    return (
      <div style={{ padding: "10px" , border: "1px solid black" , margin: "10px", width: "50%"}}>
        <form>
          <textarea className="form-control" rows='3' value={tweet} onChange={(e)=>{setNewTweet(e.target.value)}}>
          </textarea>
          <button onClick={EditTweet}>Edit</button>
        </form>
      </div>
    );
  };

export default TweetEditForm;
