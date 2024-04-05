import styles from "../../styles/login.module.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
// import { Navigate } from "react-router-dom";
const LoginPage = () => {
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(false); // For feedback
  const [userData, setUserData] = useState(null); 
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setRegistrationStatus(false);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData,
        {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }
      );
      if(response.data.success){
        console.log(response.cookies);
      setUserData(response.data.data.user); // Store user data in state    
      setRegistrationStatus(true); // Update status
      setUsername("");
      setPassword("");
      
      }

    } catch (error) {
      setRegistrationStatus(false);
      console.error(error);
    }
  };

    return(
        <div className={styles.form_container}>
             {registrationStatus && <Navigate to="/home"/>}
             <h1 className="text-center mb-5">Login Form</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)}/>

                </div>
                <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Login</button>

                </div>
                <div >
                <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    )
}

export default LoginPage 