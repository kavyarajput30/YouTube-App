import axios from "axios";
import { useState } from "react";
import styles from "../../styles/register.style.module.css";
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [password, setPassword] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(false); // For feedback
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]); // Store the selected file object
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setRegistrationStatus(false);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("fullname", fullname);
    formData.append("password", password);
    // Append files if selected
    if (avatar) {
      formData.append("avatar", avatar);
    }
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRegistrationStatus(true); // Update status
      console.log(response.data); // Log the server's response
      setUsername("");
      setEmail("");
      setFullname("");
      setAvatar(null);
      setCoverImage(null);
      setPassword("");

    } catch (error) {
      setRegistrationStatus(false);
      console.error(error);
    }
  };
  return (
    <div className={styles["main-register-div"]}>

{registrationStatus ? (
      <div className={styles["success-message"]}>
      <h3>Registeration Successfull Now you can Log in </h3>
    </div>
):(
<form onSubmit={handleSubmit}>
   <div  className={styles["input-div"]}>
     <label htmlFor="username">Username</label>
     <input
       type="text"
       name="username"
       id="username"
       required
       value={username}
       onChange={(e) => setUsername(e.target.value)}
     />
   </div>
   <div className={styles["input-div"]}>
     <label htmlFor="email">Email</label>
     <input
       type="email"
       name="email"
       id="email"
       required
       value={email}
       onChange={(e) => setEmail(e.target.value)}
     />
   </div>
   <div className={styles["input-div"]}>
     <label htmlFor="fullname">Fullname</label>
     <input
       type="text"
       name="fullname"
       id="fullname"
       required
       value={fullname}
       onChange={(e) => setFullname(e.target.value)}
     />
   </div>
   <div className={styles["input-div"]}>
     <label htmlFor="avatar">Avatar</label>
     <input
       type="file"
       name="avatar"
       id="avatar"
       required
       onChange={handleAvatarChange}
     />
   </div>
   <div className={styles["input-div"]}>
     <label htmlFor="coverImage">Cover Image</label>
     <input
       type="file"
       name="coverImage"
       id="coverImage"
       onChange={handleCoverImageChange}
     />
   </div>
   <div className={styles["input-div"]}>
     <label htmlFor="password">Password</label>
     <input
       type="password"
       name="password"
       id="password"
       required
       value={password}
       onChange={(e) => setPassword(e.target.value)}
     />
   </div>
   <div className={styles["input-div"]}>
     <button type="submit">Register</button>
     <br></br>
     <br></br>
     <h4 >already have an account? <button>log in</button></h4>
   </div>
 </form>


 
)}
     


     


    </div>
  );
};

export default RegisterPage;
