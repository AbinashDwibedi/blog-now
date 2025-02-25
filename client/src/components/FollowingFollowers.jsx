import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Axios } from "../utils/axios.js";
import userLogo from "../assets/userLogo.svg"
import loader from "../assets/Loader.gif"
function FollowingFollowers({setFollowBoxOpen,followBoxOpen,userId}) {
    // const [follow,setFollow] = useState([]);
    const [users,setUsers] = useState([]);
    const [loaded , setLoaded] = useState(false);
    // console.log(users)
    useState(()=>{
        async function fetchFollow() {
            try {
                const {data} = await Axios.get(`/user/${followBoxOpen===1? "followers" : "following"}?userId=${userId}`);
                setUsers(data.data);
                setLoaded(true)
            } catch (error) {
                console.log(error)
            }
        }
        fetchFollow();
    },[followBoxOpen])
  return (
    <div className="fixed z-10  h-screen w-full bg-gray-400/50 top-0 left-0 flex items-center justify-center">
      <div className="relative p-4 bg-background-light w-full sm:w-1/3  rounded-xl flex items-center justify-center ">
        <button
        onClick={()=>setFollowBoxOpen(null)}
          className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-700"
          aria-label="Close"    
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        {loaded ? <div className="max-h-80 w-full min-h-fit overflow-x-hidden overflow-y-auto mt-10">
          {users.length===0 ? <p>no user</p> : <div className="">
            {users.map((user,index)=>{
                return (<Link
                    to={`/profile/${user._id}`}
                    key={index}
                    className="people  hover:bg-white cursor-pointer flex items-center gap-2 p-2 m-1 rounded-3xl border-2"
                  >
                    <img
                      src={user.avatarImage ? user.avatarImage : userLogo}
                      alt=""
                      className="object-cover people-img w-8 h-8 rounded-full bg-white border-2"
                    />
                    <p className="people-username text-neutral-dark">
                      {user.userName}
                    </p>
                  </Link>)
            })}
          </div> }
        </div>: <img src={loader} alt="" className="h-24"/> }
      </div>
    </div>
  );
}

export default FollowingFollowers;
