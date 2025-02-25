// import React, { useEffect, useState } from "react";
// import {
//   fetchAllBlogs,
//   handleLikes,
// } from "../redux/allBlogs.js";
// import { useDispatch, useSelector } from "react-redux";
// import userLogo from "../assets/userLogo.svg";
// import loader from "../assets/Loader.gif";
// import { Link } from "react-router-dom";
// import Comment from "./Comment";
// import { useLocation } from "react-router-dom";
// import FollowBtn from "./FollowBtn";
// import { useRef } from "react";

// function HomeSecond({ isVerified }) {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const locationRef = useRef(null);
//   const { data, hasMore } = useSelector((state) => state.allBlogs);
//   const [openCommentsBlogId, setOpenCommentsBlogId] = useState(null);
//   const [pageNo, setPageNo] = useState(1);
// //  console.log(pageNo)
//   useEffect(() => {
//     // console.log("first rendering ")
//       setPageNo(1);
//       dispatch(fetchAllBlogs({pageNo}));
//   }, [dispatch, location.pathname]);
//   useEffect(() => {
//     // console.log("second rendering ")
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPageNo((prev) => prev + 1);
//           // console.log("running observder" ,pageNo, hasMore)
//         }
//       },
//       { threshold: 0.5 }
//     );
//     if (locationRef.current) observer.observe(locationRef.current);
//     return () => {
//       if (locationRef.current) observer.unobserve(locationRef.current);
//     };
//   }, [hasMore]);

//   useEffect(() => {
//     // console.log("third rendering")
//     if (pageNo === 1) return;
//       dispatch(fetchAllBlogs({pageNo}));
//   }, [dispatch, location.pathname, pageNo]);
  
//   return (
//     <div
//       id="second-sub-section"
//       className="flex flex-col bg-background-default p-4 rounded-lg w-full md:w-2/4 mt-6 md:mt-0"
//     >
      
//         <div className="main-blogs-area  flex flex-col gap-8 overflow-y-auto custom-scrollbar">
//           {data.map((blog, index) => (
//             <div
//               key={index}
//               className="blog-div shadow-lg rounded-2xl bg-transparent   p-2  "
//             >
//               <div className="top-part flex justify-between items-center">
//                 <Link
//                   to={`/profile/${blog?.by?._id}`}
//                   className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-gray-300 hover:text-white transition-all bg-gray-200 rounded-3xl px-2 py-2"
//                 >
//                   <img
//                     src={blog?.by?.avatarImage || userLogo}
//                     alt="user"
//                     className="object-cover blog-user-img w-8 h-8 rounded-full bg-white border-2"
//                   />
//                   <p className="blog-user-username font-medium">
//                     {isVerified?.data?._id === blog.by._id
//                       ? "you"
//                       : blog.by.userName}
//                   </p>
//                 </Link>
//                 <div className="mb-4 text-sm">
                  
//                   {isVerified.data._id !== blog?.by?._id && (
//                     <FollowBtn
//                       followUser={
//                         location.pathname === "/likedPosts" ||
//                         location.pathname === "/likedPosts/"
//                           ? blog.by
//                           : blog.by._id
//                       }
//                     />
//                   )}
//                   {blog.createdAt.slice(0, 10)}{" "}
//                 </div>
//               </div>

//               <div className="mid-part mb-4">
//                 <h1 className="font-extrabold text-md">{blog?.title}</h1>
//                 {blog?.blogImage && (
//                   <img
//                     src={blog?.blogImage}
//                     alt="blog"
//                     className="blog-image w-full h-56 object-contain bg-neutral-light p-2 rounded-2xl"
//                   />
//                 )}
//                 <p className="blog-content mt-2 text-neutral-default whitespace-pre-wrap p-4 bg-gray-200 rounded-lg">
//                   {blog?.contentText}
//                 </p>
//               </div>

//               <div className="bottom-part flex justify-between items-center ">
//                 <div className="left-blog-section flex flex-col items-start gap-2">
//                   <p className="liked-blog-by text-neutral-dark text-sm">
//                     liked by {blog?.likesCount}
//                   </p>
//                   <div className="flex items-center ">
//                     <button
//                       onClick={() =>
//                         dispatch(handleLikes({ blogId: blog?._id, index }))
//                       }
//                       className="flex items-center gap-2 p-2 rounded text-primary-dark hover:text-primary"
//                     >
//                       <i className="fas fa-thumbs-up text-accent-dark  p-2  bg-gray-200 hover:bg-gray-300 rounded-full"></i>{" "}
//                       {blog.likesCount}
//                     </button>
//                     <button
//                       onClick={() =>
//                         setOpenCommentsBlogId(
//                           openCommentsBlogId === blog?._id ? null : blog?._id
//                         )
//                       }
//                       className="relative flex items-center gap-2 p-2 rounded text-primary-dark hover:text-primary"
//                     >
//                       <i className="fas fa-comment text-secondary-dark p-2 hover:bg-gray-300 rounded-full bg-gray-200"></i>
//                       {blog?.commentsCount}
//                     </button>
//                     {openCommentsBlogId === blog?._id && (
//                       <Comment
//                         key={blog?._id}
//                         isVerified={isVerified}
//                         setOpenCommentsMenu={setOpenCommentsBlogId}
//                         blogId={blog._id}
//                       />
//                     )}
//                   </div>
//                 </div>
//                 <div className="right-blog-section"></div>
//               </div>
//             </div>
//           ))}
//           {hasMore && (
//          <div ref={locationRef} className="text-center mt-4">
//          <img src={loader} alt="loading" className="h-8 mx-auto" />
//          </div>
// )}
//         </div>
//        </div>
//   );
// }

// export default HomeSecond;
import React, { useEffect, useState, useRef } from "react";
import { fetchAllBlogs, handleLikes } from "../redux/allBlogs.js";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/userLogo.svg";
import loader from "../assets/Loader.gif";
import { Link, useLocation } from "react-router-dom";
import Comment from "./Comment";
import FollowBtn from "./FollowBtn";

function HomeSecond({ isVerified }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const locationRef = useRef(null);
  const { data, hasMore } = useSelector((state) => state.allBlogs);
  const [openCommentsBlogId, setOpenCommentsBlogId] = useState(null);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    setPageNo(1);
    dispatch(fetchAllBlogs({ pageNo }));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    if (locationRef.current) observer.observe(locationRef.current);
    return () => {
      if (locationRef.current) observer.unobserve(locationRef.current);
    };
  }, [hasMore]);

  useEffect(() => {
    if (pageNo === 1) return;
    dispatch(fetchAllBlogs({ pageNo }));
  }, [dispatch, pageNo]);

  return (
    <div
      id="second-sub-section"
      className="flex flex-col bg-gradient-to-br from-white via-blue-50 to-pink-50 p-4 rounded-xl shadow-lg w-full md:w-2/4 mt-6 md:mt-0"
    >
      <div className="main-blogs-area flex flex-col gap-8 overflow-y-auto custom-scrollbar">
        {data.map((blog, index) => (
          <div
            key={index}
            className="blog-div shadow-md rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-100 p-4"
          >
            <div className="top-part flex justify-between items-center">
              <Link
                to={`/profile/${blog?.by?._id}`}
                className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-blue-100 transition-all bg-blue-50 rounded-full px-3 py-2"
              >
                <img
                  src={blog?.by?.avatarImage || userLogo}
                  alt="user"
                  className="object-cover blog-user-img w-10 h-10 rounded-full bg-white border-4 border-blue-300 shadow-md"
                />
                <p className="blog-user-username font-medium text-blue-900">
                  {isVerified?.data?._id === blog.by._id ? "You" : blog.by.userName}
                </p>
              </Link>
              <div className="mb-4 text-sm text-gray-600">
                {isVerified.data._id !== blog?.by?._id && (
                  <FollowBtn
                    followUser={
                      location.pathname === "/likedPosts" ||
                      location.pathname === "/likedPosts/"
                        ? blog.by
                        : blog.by._id
                    }
                  />
                )}
                <p className="mt-1">{blog.createdAt.slice(0, 10)}</p>
              </div>
            </div>

            <div className="mid-part mb-4">
              <h1 className="font-bold text-lg text-blue-800">{blog?.title}</h1>
              {blog?.blogImage && (
                <img
                  src={blog?.blogImage}
                  alt="blog"
                  className="blog-image w-full h-56 object-cover bg-blue-50 p-2 rounded-xl shadow-md mt-2"
                />
              )}
              <p className="blog-content mt-4 text-gray-700 whitespace-pre-wrap p-4 bg-gray-100 rounded-lg shadow-sm">
                {blog?.contentText}
              </p>
            </div>

            <div className="bottom-part flex justify-between items-center">
              <div className="left-blog-section flex flex-col items-start gap-2">
                <p className="liked-blog-by text-sm text-gray-600">
                  Liked by {blog?.likesCount}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(handleLikes({ blogId: blog?._id, index }))
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition-all"
                  >
                    <i className="fas fa-thumbs-up text-blue-500"></i>
                    {blog.likesCount}
                  </button>
                  <button
                    onClick={() =>
                      setOpenCommentsBlogId(
                        openCommentsBlogId === blog?._id ? null : blog?._id
                      )
                    }
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-pink-700 hover:bg-pink-100 transition-all"
                  >
                    <i className="fas fa-comment text-pink-500"></i>
                    {blog?.commentsCount}
                  </button>
                  {openCommentsBlogId === blog?._id && (
                    <Comment
                      key={blog?._id}
                      isVerified={isVerified}
                      setOpenCommentsMenu={setOpenCommentsBlogId}
                      blogId={blog._id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {hasMore && (
          <div ref={locationRef} className="text-center mt-4">
            <img src={loader} alt="loading" className="h-8 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeSecond;

