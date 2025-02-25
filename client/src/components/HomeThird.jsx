// import React, { useEffect } from 'react'
// import { fetchAllUsers } from '../redux/allUsers.js'
// import { useDispatch, useSelector } from 'react-redux'
// import userLogo from "../assets/userLogo.svg"
// import { Link } from 'react-router-dom'

// function HomeThird({setOpenRightMenu,openRightMenu}) {
//     const dispatch = useDispatch();
//     const {data,loaded} = useSelector((state)=>state.allUsers) 
//     useEffect(()=>{
//         dispatch(fetchAllUsers());
//     },[dispatch])
//   return (
//     <div
//           id="third-sub-section"
//           className={`flex transition-all flex-col bg-neutral-light p-4 rounded-lg md:w-1/4 w-screen md:relative fixed md:right-0 ${openRightMenu? "right-0": "-right-full"}`}
//         >
//           <button
//           onClick={() => {setOpenRightMenu(false)}}
//           className="absolute md:hidden top-2 right-2 text-neutral-dark bg-neutral-light rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger-light hover:text-danger-dark transition"
//         >
//           ✖
//         </button>
//           <div className="first-sub-section-nav">
//             <h2 className="peoples-heading text-lg font-bold text-primary-dark mb-4">
//               Following
//             </h2>
//             <div className="peoples grid  overflow-y-auto">
//               {data.map((user, index)=>{
//                 return (
//                     <Link to={`/profile/${user._id}`} key={index} className="people hover:bg-white cursor-pointer flex items-center gap-2 p-2 m-1 rounded-3xl border-2">
//                 <img
//                   src={user.avatarImage? user.avatarImage : userLogo}
//                   alt=""
//                   className="object-cover people-img w-8 h-8 rounded-full bg-white border-2"
//                 />
//                 <p className="people-username text-neutral-dark">{user.userName}</p>
//               </Link>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//   )
// }

// export default HomeThird

import React, { useEffect } from "react";
import { fetchAllUsers } from "../redux/allUsers.js";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/userLogo.svg";
import { Link } from "react-router-dom";

function HomeThird({ setOpenRightMenu, openRightMenu }) {
  const dispatch = useDispatch();
  const { data, loaded } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div
      id="third-sub-section"
      className={`flex transition-all flex-col bg-gradient-to-br from-blue-50 to-pink-50 p-4 rounded-xl shadow-lg md:w-1/4 w-screen md:relative fixed md:right-0 ${
        openRightMenu ? "right-0" : "-right-full"
      }`}
    >
      <button
        onClick={() => {
          setOpenRightMenu(false);
        }}
        className="absolute md:hidden top-2 right-2 text-gray-700 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"
      >
        ✖
      </button>
      <div className="first-sub-section-nav">
        <h2 className="peoples-heading text-lg font-extrabold text-blue-800 mb-4">
          Following
        </h2>
        <div className="peoples grid gap-4 overflow-y-auto custom-scrollbar">
          {data.map((user, index) => (
            <Link
              to={`/profile/${user._id}`}
              key={index}
              className="people hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-3 p-3 rounded-xl border border-blue-200 shadow-sm"
            >
              <img
                src={user.avatarImage ? user.avatarImage : userLogo}
                alt="User Avatar"
                className="object-cover people-img w-10 h-10 rounded-full bg-white border-2 border-blue-300 shadow-md"
              />
              <p className="people-username text-blue-900 font-semibold">
                {user.userName}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeThird;
