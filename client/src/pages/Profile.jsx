import React, { useEffect } from "react";
import User from "../components/User";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import Blogs from "../components/Blogs";
import { fetchUserData } from "../redux/profile.js";
import { useDispatch, useSelector } from "react-redux";

function Profile({ isVerified }) {
  const dispatch = useDispatch();
  const {userId} = useParams();
  const {userData } = useSelector((state)=> state.profile);
  useEffect(()=>{
    dispatch(fetchUserData);
  },[userId,userData,dispatch])
  return (
    <>
      <Navbar />
      <div className=" select-none bg-gray-200 min-h-screen pt-14 text-black">
        <div className=" max-w-[800px] m-auto bg-white min-h-screen p-3 md:p-6">
          {/* <Link to="/" className="home mb-2 block w-fit p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all">home</Link> */}
          <User isVerified={isVerified} />
          <Blogs isVerified={isVerified} />
        </div>
      </div>
    </>
  );
}

export default Profile;
