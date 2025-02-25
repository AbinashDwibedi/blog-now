import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { addUserDetails } from "../redux/register.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Axios } from "../utils/axios.js";
import Loader from "../components/Loader";
import loaderGif from "../assets/Loader.gif"

function Register({isVerified}) {
  setTimeout(() => {
  }, 2000);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(true)
  const registerData = useSelector((state)=> state.register);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl,setAvatarUrl] = useState(null);
  const [UserNameStatus, setUserNameStatus] = useState(0);
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };
  async function handleCheckUserName() {
    try {
      setUserNameStatus(202);
      const {data} =await Axios.post("/user/userNameExists",{
        userName: registerData.userName,
      })
      setUserNameStatus(200);
    } catch (error) {
        setUserNameStatus(409)
    }}
  async function handleSubmit(event) {
    event.preventDefault();
    if(validateFormData(registerData)){
      let formData = new FormData();
      formData.append("userName",registerData.userName);
      formData.append("fullName",registerData.fullName);
      formData.append("email",registerData.email);
      formData.append("password",registerData.password);
      formData.append("avatarImage",avatar);
      try {
        setLoaded(false);
        const {data} = await Axios.post("/user/register", formData);
        toast.done("Registered successfully")
        navigate("/login")
      } catch (error) {
        if(error.status === 500){
          toast.error("user creation failed");
        }
        if(error.status === 409){
          toast.error("user already exists");
        }
      }
      finally{
        setLoaded(true);
      }
    }
  }
  function validateFormData(registerData) {
    const userNameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const fullNameRegex = /^[a-zA-Z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{7,}$/;
  
    if (!userNameRegex.test(registerData.userName)) {
      toast.error("Username must be 3-15 characters long and contain only letters, numbers, or underscores.");
      return false;
    }
  
    if (!fullNameRegex.test(registerData.fullName)) {
      toast.error("Full Name must be 3-50 characters long and contain only letters and spaces.");
      return false;
    }
  
    if (!emailRegex.test(registerData.email)) {
      toast.error("Invalid email address.");
      return false;
    }
  
    if (!passwordRegex.test(registerData.password)) {
      toast.error("Password must be at least 7 characters long, including 1 letter and 1 number.");
      return false;
    }
  
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
  
    return true;
  }
  return (
    <>
  <div className="select-none min-h-screen bg-primary-dark flex items-center justify-center ">
      <div className="bg-background-light p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="avatarInput"
            className="cursor-pointer flex flex-col items-center"
          >
            <img
              src={
                avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              }
              alt="User Avatar"
              className="h-16 w-16 rounded-full mb-4 border-2 border-primary-dark"
            />
            <span className="text-sm text-primary-light">
              Click to upload avatar
            </span>
          </label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <h1 className="text-primary-dark text-xl font-bold">Register</h1>
          <p className="text-neutral-dark text-sm text-center">
            Please enter your details to create an account
          </p>
        </div>
        <form className="space-y-4" onSubmit={(e)=> handleSubmit(e)}>
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Username"
              onChange={(e)=> dispatch(addUserDetails({field: "userName", value: e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
            <div onClick={handleCheckUserName} className="bg-gray-200 px-3 py-2 cursor-pointer text-sm font-bold rounded-lg">
              {UserNameStatus===0 && <i className="fa fa-user "></i>}
              {UserNameStatus===202 && <i className="fas fa-spinner fa-pulse animate-spin"></i>}
              {UserNameStatus===409 && <i className="fa-solid fa-xmark text-red-500"></i>}
              {UserNameStatus===200 && <i className="fa-solid fa-check text-green-600"></i>}
              
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e)=>dispatch(addUserDetails({field: "fullName",value: e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              onChange={(e)=>dispatch(addUserDetails({field:"email",value: e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              onChange={(e)=>dispatch(addUserDetails({field:"password",value: e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e)=>dispatch(addUserDetails({field:"confirmPassword",value: e.target.value}))}
              className="w-full px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light text-neutral-dark text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-dark hover:bg-primary-light text-white font-medium py-2 rounded-md transition-colors text-sm"
          >
            {loaded? "Register" : <img src={loaderGif} alt=""  className="m-auto w-6"/> }
          </button>
        </form>
        <p className="text-neutral-dark text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary-dark hover:underline">
            login
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Register;
