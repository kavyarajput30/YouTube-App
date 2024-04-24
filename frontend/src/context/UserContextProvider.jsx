import React from "react";
import UserContext from "./UserContext";
import { useEffect } from "react";

const UserContextProvider = ({children})=>{
    const [user,setUser] = React.useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
      }, []);
    
      const setUserWithStorage = (currentUser) => {
        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      };
return (
    <UserContext.Provider value={{user,setUserWithStorage}}>
    {children}
    </UserContext.Provider>
)
}

export default UserContextProvider;


 