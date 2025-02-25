import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DeleteBlog from "./DeleteBlog";
import { Axios } from "../utils/axios.js";
import UpdateBlog from "./UpdateBlog";
import Comment from "./Comment.jsx";
import{ toast} from "react-toastify"
import loader from "../assets/Loader.gif"
function Blogs({ isVerified }) {
  const location = useLocation();
  const locationRef = useRef();
  const { userId } = useParams();
  const [blogData, setBlogData] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [openDeleteBlogDialog, setOpenDeleteBlogDialog] = useState(false);
  const [openUpdateBlogDialog, setOpenUpdateBlogDialog] = useState(false);
  const [openCommentsMenu , setOpenCommentsMenu] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore , setHasMore] = useState(true);

  async function handleLikes(blogId, blogIndex) {
    try {
      const { data } = await Axios.get(`/blog/like?&blogId=${blogId}`);
      let newBlogData = [...blogData];
      newBlogData[blogIndex].likesCount = data.data.likeCount;
      setBlogData(newBlogData);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    async function loadBlogData() {
      try {
        // console.log(1)
        const { data } = await Axios.get(
          `/blog/showUserBlogs?limit=3&page=${pageNo}&userId=${userId}`
        );
        // console.log(2)
        if(pageNo===1){
          // console.log(3)
          setBlogData(data.data);
        }
        else{
          // console.log(4)
          setBlogData([...blogData , ...data.data]);
        }
        // console.log(5)
        setHasMore(data.data.length>0);
        // console.log(hasMore,data.data,data.data.length , pageNo)
        
      } catch (error) {
        console.log("Something went wrong");
      }
    }
    loadBlogData();
  }, [userId , pageNo, location.pathname]);
  
  useEffect(()=>{
    const observer = new IntersectionObserver(
      (entries)=>{
        if(entries[0].isIntersecting && hasMore){
          setPageNo((prev)=> prev +1)
        }
      },
      {threshold: 0.8}
    )
    if(locationRef.current) observer.observe(locationRef.current);
    return ()=>{
      if(locationRef.current) observer.unobserve(locationRef.current);
    }
  },[location.pathname ,hasMore])
  
  return (

    <div className=" mb-2 min-h-screen w-full md:w-[80%] m-auto mt-20 bg-background-light rounded-md">
        <div className="blogs-container ">
          {blogData?.map((blog, index) => (
            <div
              key={index}
              className="mt-4  gap-8 mb-8 blog  border-neutral-light rounded-2xl "
            >
              <div className="flex items-center justify-between relative p-2 bg-primary-light text-white rounded-full px-3">
                <div>
                  <div className="text-sm text-white">
                    Created on: {blog.createdAt.slice(0, 10)}
                  </div>
                </div>
                {isVerified?.data?._id === userId && (
                  <div
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === index ? null : index)
                    } // Toggle the menu for this blog
                    className="px-3 rounded-full py-2 bg-primary hover:bg-primary-dark transition-all  hover:text-white cursor-pointer"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </div>
                )}
                {openMenuIndex === index && (
                  <div className="p-2 gap-2 flex flex-col bg-gray-200 rounded-2xl absolute right-10 top-10   shadow-lg">
                    <div onClick={()=> setOpenUpdateBlogDialog(!openUpdateBlogDialog)} className="p-2 bg-neutral hover:bg-primary-light transition-all cursor-pointer rounded-2xl">
                      Update Blog
                    </div>
                    {openUpdateBlogDialog && <UpdateBlog blog={blog} setOpenUpdateBlogDialog={setOpenUpdateBlogDialog}/>}
                    {/* <div className="p-2 bg-neutral hover:bg-primary-light transition-all cursor-pointer rounded-md">
                      Change Visibility
                    </div> */}
                    <div
                      onClick={() =>
                        
                        setOpenDeleteBlogDialog(!openDeleteBlogDialog)
                      }
                      className="p-2 bg-danger hover:bg-danger-dark transition-all cursor-pointer rounded-2xl"
                    >
                      Delete Blog
                    </div>
                    {openDeleteBlogDialog && <DeleteBlog blogId={blog._id} setOpenMenuIndex={setOpenMenuIndex} setOpenDeleteBlogDialog={setOpenDeleteBlogDialog}/>}
                  </div>
                )}
              </div>

              <div className="pb-0">
                <h2 className="text-md  p-4 bg-gray-200 my-2 rounded-2xl break-all font-extrabold text-neutral-dark">
                  {blog.title}
                </h2>
                {blog.blogImage && (
                  <img
                    src={blog.blogImage}
                    alt=""
                    className="w-full rounded-md mb-4 h-56 object-contain"
                  />
                )}
                <p className="text-neutral-dark whitespace-pre-wrap bg-neutral-light rounded-xl p-4">{blog.contentText}</p>
              </div>

              <div className="flex items-center justify-between mt-2  p-4 bg-neutral-light rounded-xl">
                <div className="flex flex-col">
                  <div className="text-sm  text-accent-dark font-medium mb-1">
                    Liked by {blog.likesCount} people
                  </div>
                  <div className="flex  gap-4 mt-2">
                    <div
                      className="cursor-pointer text-secondary-dark bg-gray-200 hover:bg-gray-300  px-3 rounded-full py-1 text-xl"
                      onClick={() => handleLikes(blog._id, index)}
                    >
                      <i className="fas fa-thumbs-up"></i> {blog.likesCount}
                    </div>
                    <div onClick={()=> setOpenCommentsMenu(openCommentsMenu? null : blog._id )}  className="cursor-pointer text-accent-dark  bg-gray-200 hover:bg-gray-300  px-3 rounded-full py-1 text-xl">
                      <i className="fas fa-comment"></i> {blog.commentsCount}
                    </div>
                    {openCommentsMenu===blog._id && <Comment key={blog._id} isVerified={isVerified} setOpenCommentsMenu={setOpenCommentsMenu} blogId ={blog._id}/>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
    <div ref={locationRef} className="text-center mt-4">
    <img src={loader} alt="loading" className="h-8 mx-auto" />
    </div>
    
)}{!hasMore && (<div className="w-full text-center text-primary-dark font-bold">{pageNo===1 ? "no blogs found" : "no more blogs found" }</div>) }
    </div>
  );
}

export default Blogs;




//     <div className=" mb-2 min-h-screen w-full md:w-[80%] m-auto mt-20 bg-background-light rounded-md">
//       {blogData?.length !== 0 ? (
//         <div className="blogs-container bg-background">
//           {blogData?.map((blog, index) => (
//             <div
//               key={index}
//               className="mt-4 blog border border-neutral-light rounded-md shadow-md"
//             >
//               <div className="flex items-center justify-between relative p-2 bg-primary-light text-white rounded-t-md">
//                 <div>
//                   <div className="text-sm text-white">
//                     Created on: {blog.createdAt.slice(0, 10)}
//                   </div>
//                 </div>
//                 {isVerified?.data?._id === userId && (
//                   <div
//                     onClick={() =>
//                       setOpenMenuIndex(openMenuIndex === index ? null : index)
//                     } // Toggle the menu for this blog
//                     className="p-2 bg-primary hover:bg-primary-dark transition-all rounded-md hover:text-white cursor-pointer"
//                   >
//                     <i className="fa-solid fa-bars"></i>
//                   </div>
//                 )}
//                 {openMenuIndex === index && (
//                   <div className="p-2 gap-2 flex flex-col bg-neutral-light rounded-md absolute right-10 top-10 border border-neutral-dark shadow-lg">
//                     <div onClick={()=> setOpenUpdateBlogDialog(!openUpdateBlogDialog)} className="p-2 bg-neutral hover:bg-primary-light transition-all cursor-pointer rounded-md">
//                       Update Blog
//                     </div>
//                     {openUpdateBlogDialog && <UpdateBlog blog={blog} setOpenUpdateBlogDialog={setOpenUpdateBlogDialog}/>}
//                     {/* <div className="p-2 bg-neutral hover:bg-primary-light transition-all cursor-pointer rounded-md">
//                       Change Visibility
//                     </div> */}
//                     <div
//                       onClick={() =>
                        
//                         setOpenDeleteBlogDialog(!openDeleteBlogDialog)
//                       }
//                       className="p-2 bg-danger hover:bg-danger-dark transition-all cursor-pointer rounded-md"
//                     >
//                       Delete Blog
//                     </div>
//                     {openDeleteBlogDialog && <DeleteBlog blogId={blog._id} setOpenMenuIndex={setOpenMenuIndex} setOpenDeleteBlogDialog={setOpenDeleteBlogDialog}/>}
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 pb-0">
//                 <h2 className="text-2xl my-2 font-extrabold text-neutral-dark">
//                   {blog.title}
//                 </h2>
//                 {blog.blogImage && (
//                   <img
//                     src={blog.blogImage}
//                     alt=""
//                     className="w-full object-cover rounded-md mb-4"
//                   />
//                 )}
//                 <p className="text-neutral-dark whitespace-pre-wrap">{blog.contentText}</p>
//               </div>

//               <div className="flex items-center justify-between p-4 bg-neutral-light rounded-b-md">
//                 <div className="flex flex-col">
//                   <div className="text-sm text-accent-dark font-medium mb-1">
//                     Liked by {blog.likesCount} people
//                   </div>
//                   <div className="flex  gap-4 mt-2">
//                     <div
//                       className="cursor-pointer text-secondary-dark  px-3 rounded-lg py-1 text-xl"
//                       onClick={() => handleLikes(blog._id, index)}
//                     >
//                       <i className="fas fa-thumbs-up"></i> {blog.likesCount}
//                     </div>
//                     <div onClick={()=> setOpenCommentsMenu(openCommentsMenu? null : blog._id )}  className="cursor-pointer text-accent-dark  px-3 rounded-lg py-1 text-xl">
//                       <i className="fas fa-comment"></i> {blog.commentsCount}
//                     </div>
//                     {openCommentsMenu===blog._id && <Comment key={blog._id} isVerified={isVerified} setOpenCommentsMenu={setOpenCommentsMenu} blogId ={blog._id}/>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//       ) : (
//         <div>no blogs found</div>
//       )}
//     </div>
//   );
// }

// export default Blogs;



