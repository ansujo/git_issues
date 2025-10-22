import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const navigate =useNavigate();

    const handleLogin = async () => {
        try{
            const res = await api.post("/register/",{ username,password });
            console.log(res)
            localStorage.setItem("access",res.data.access);
            localStorage.setItem("refresh",res.data.refresh);
            api.defaults.headers.common["Authorization"] = 'Bearer ${res.data.access}';
            navigate("/");
        }catch(error){
            alert("Invalid credentials")
        }
    };       

    return(
        <div>
            <h1>Login</h1>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="Password" type="password" onChange={(e) =>setPassword(e.target.value) }/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}