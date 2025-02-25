import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLoginFields } from "../redux/login.js";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Axios } from "../utils/axios.js";
import Loader from "../components/Loader";

function Login({isVerified}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginData = useSelector((state)=> state.login);
  const [loaded, setloaded] = useState(true);
  async function handleSubmit(event){
    event.preventDefault();
    if(validateFormData(loginData.userName,loginData.password)){
      try {
        setloaded(false);
        const {data} = await Axios.post("/user/login",{
          userName: loginData.userName,
          password: loginData.password
        },{withCredentials: true})
        toast.success(`Welcome ${data.data.userName}`);
          navigate("/");
      } catch (error) { 
        if(error.status===404){
          toast.error("user not found");
        }

        else if(error.status===401){
          toast.error("password incorrect")
        }
        else{
          toast.error("something went wrong")
        }
      }
      finally{
        setloaded(true)
      }
      
      // if(data){
        // navigate("/")
        
      // }
    }
  }
  function validateFormData(userName, password) {
    const userNameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{7,}$/;
  
    const isUserNameValid = userNameRegex.test(userName);
    const isPasswordValid = passwordRegex.test(password);
  
    if (!isUserNameValid) {
      toast.error("Username must be 3-15 characters long and contain only letters, numbers, or underscores.");
    }
  
    if (!isPasswordValid) {
      toast.error("Password must be at least 7 characters long, including 1 letter and 1 number.");
    }
  
    return isUserNameValid && isPasswordValid;
  }

  return (
    <>
    {loaded ? <div className="select-none min-h-screen bg-primary-dark flex items-center justify-center">
      <div className="bg-background-light p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="User Avatar"
            className="h-16 w-16 rounded-full mb-4 border-2 border-primary-dark"
          />
          <h1 className="text-primary-dark text-xl font-bold">Login</h1>
          <p className="text-neutral-dark text-sm text-center">
            Please enter your username and password
          </p>
        </div>
        <form className="space-y-4" onSubmit={(e)=>handleSubmit(e)}>
          <div>
            <input
              type="text"
              placeholder="Username"
              onChange={(e)=> dispatch(addLoginFields({field: "userName",value:e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              onChange={(e)=> dispatch(addLoginFields({field:"password",value:e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-dark hover:bg-primary-light text-white font-medium py-2 rounded-md transition-colors text-sm"
          >
            Login
          </button>
        </form>
        <p className="text-neutral-dark text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-secondary-dark hover:underline">
            Register
          </Link>
        </p>
        {/* <p className="text-neutral-dark text-sm text-center mt-2">
          Forgot your password?{" "}
          <a href="/forgot-password" className="text-accent-light hover:underline">
            Reset it
          </a>
        </p> */}
      </div>
    </div> : <Loader/>}</>
  );
}

export default Login;
