
// import React, { useEffect } from 'react'
// import { useSelector,useDispatch } from 'react-redux'
// import { fetchSomeUserData } from '../redux/someUserData.js';
// // import { setUserData } from '../redux/someUserData.js'
// import userLogo from "../assets/userLogo.svg"
// import { Axios } from '../utils/axios.js';
// import { setOpenClose } from '../redux/addBlog.js';
// import AddBlog from './AddBlog.jsx';
// import { Link } from 'react-router-dom';

// function HomeFirst({setOpenLeftMenu,openLeftMenu}) {
//     const {userName ,avatarImage ,_id} = useSelector((state)=> state.someUserData);
//     const dispatch = useDispatch();
//     const {isOpen} = useSelector((state)=> state.addBlog);
//     useEffect(()=>{
//     //    async function fetchSomeData(){
//     //     const {data} =await Axios.get("/user/someUserData");
//     //      dispatch(setUserData(data));
//     //    }
//     //    fetchSomeData();
//     dispatch(fetchSomeUserData());
//     },[dispatch])
//   return (
//     <div
//           id="first-sub-section"
//           className={`flex flex-col bg-neutral-light p-4 md:relative fixed rounded-lg w-screen z-10 transition-all md:w-1/4 md:left-0 ${openLeftMenu? "left-0":"-left-full" }`}
//         >
//           {isOpen && <AddBlog/>}
//           <button
//           onClick={() => {setOpenLeftMenu(false)}}
//           className="absolute md:hidden top-2 right-2 text-neutral-dark bg-neutral-light rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger-light hover:text-danger-dark transition"
//         >
//           ✖
//         </button>
//           <Link to={`/profile/${_id}`} className="first-sub-section-nav flex items-center gap-2 mb-4" >
//             <img
//               src={avatarImage? avatarImage : userLogo}
//               alt=""
//               className="object-cover user-icon w-10 h-10 rounded-full bg-white  border-2 cursor-pointer"
//             />
//             <p className="user-name font-bold text-neutral-dark cursor-pointer">{userName}</p>
//           </Link>
//           <ul className="list-none">
//             <li onClick={()=> dispatch(setOpenClose())} className="mt-2 p-2 bg-gray-200 hover:bg-gray-300 transition-all rounded-3xl mb-2 text-primary-dark cursor-pointer flex items-center gap-2">
//               <i className="fas fa-plus-circle"></i> Add New Blog
//             </li>
//             {/* <Link to="/likedPosts" className="hover:bg-gray-300 transition-all mt-2 p-2 bg-gray-200 rounded-xl mb-2 text-primary-dark cursor-pointer flex items-center gap-2">
//             <i className="fas fa-thumbs-up text-primary-dark"></i> Liked Posts
//             </Link> */}
//             {/* <li className="mb-2 text-primary-dark cursor-pointer flex items-center gap-2">
//               <i className="fas fa-file-alt"></i> Example
//             </li> */}
//             {/* <li className="mb-2 text-primary-dark cursor-pointer flex items-center gap-2">
//               <i className="fas fa-bookmark"></i> Example
//             </li> */}
//           </ul>

//           <div className="footer mt-auto text-center text-sm text-neutral-default">
//             <p>Crafted by Abinash</p>
//             <p>&copy; Copyrighted by Abinash</p>
//           </div>
//         </div>
//   )
// }

// export default HomeFirst

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSomeUserData } from "../redux/someUserData.js";
import userLogo from "../assets/userLogo.svg";
import { setOpenClose } from "../redux/addBlog.js";
import AddBlog from "./AddBlog.jsx";
import { Link } from "react-router-dom";

function HomeFirst({ setOpenLeftMenu, openLeftMenu }) {
  const { userName, avatarImage, _id } = useSelector((state) => state.someUserData);
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.addBlog);

  useEffect(() => {
    dispatch(fetchSomeUserData());
  }, [dispatch]);

  return (
    <div
      id="first-sub-section"
      className={`flex flex-col bg-gradient-to-br from-background-light via-background-default to-secondary-light p-4 md:relative fixed rounded-lg shadow-lg w-screen z-10 transition-all md:w-1/4 md:left-0 ${
        openLeftMenu ? "left-0" : "-left-full"
      }`}
    >
      {isOpen && <AddBlog />}
      <button
        onClick={() => {
          setOpenLeftMenu(false);
        }}
        className="absolute md:hidden top-2 right-2 text-neutral-light bg-danger-dark rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger transition"
      >
        ✖
      </button>
      <Link to={`/profile/${_id}`} className="first-sub-section-nav flex items-center gap-2 mb-4">
        <img
          src={avatarImage ? avatarImage : userLogo}
          alt=""
          className="object-cover user-icon w-12 h-12 rounded-full bg-neutral-light border-4 border-primary-light shadow-md cursor-pointer"
        />
        <p className="user-name font-bold text-primary-dark cursor-pointer text-lg">
          {userName}
        </p>
      </Link>
      <ul className="list-none">
        <li
          onClick={() => dispatch(setOpenClose())}
          className="mt-2 p-3 bg-gradient-to-r from-primary-light to-secondary-light hover:from-secondary-light hover:to-primary-light transition-all rounded-full text-primary-dark cursor-pointer flex items-center gap-2 shadow-md"
        >
          <i className="fas fa-plus-circle text-primary"></i>
          <span className="font-semibold text-neutral-dark">Add New Blog</span>
        </li>
        <Link to="/messages"
          className="mt-2 p-3 bg-gradient-to-r from-primary-light to-secondary-light hover:from-secondary-light hover:to-primary-light transition-all rounded-full text-primary-dark cursor-pointer flex items-center gap-2 shadow-md"
        >
          <i className="fa-message fa-solid text-primary"></i>
          <span className="font-semibold text-neutral-dark">open message box</span>
        </Link>
      </ul>

      <div className="footer mt-auto text-center text-sm text-neutral-dark">
        <p className="font-medium">Crafted by Abinash</p>
        <p>&copy; {new Date().getFullYear()} Abinash</p>
      </div>
    </div>
  );
}

export default HomeFirst;
