import React, { useEffect, useRef, useState } from "react";
import loaderGif from "../assets/Loader.gif";
import userLogo from "../assets/userLogo.svg";
import { Axios } from "../utils/axios";
import { toast } from "react-toastify";

function Comment({ setOpenCommentsMenu, blogId,isVerified }) {
  const commentsDiv = useRef();
  const [loading, setLoading] = useState(true);
  const [commentsData, setCommentsData] = useState([]);
  const [isCommentsMenuOpen, setIsCommentsMenuOpen] = useState(null);
  const [commentText , setCommentText] = useState("");
  const [updateComment , setUpdateComment] = useState(null);
  
  async function handleUpdateComment(e) {
  
    e.preventDefault();
    try {
      setLoading(true)
      await Axios.put("/comment/updateComment",{
        content: commentText,
        commentId: updateComment
      })
      setCommentText("")
      setUpdateComment(null)
      toast.success("comment updated successfully")
      fetchComments();
    } catch (error) {
      toast.error("something went wrong")
    }finally{
      setLoading(false)
    }
  }
  async function handleDeleteComment(commentId) {
    try {
      setLoading(true);
      await Axios.delete(`/comment/removeComment?commentId=${commentId}`);
      toast.success("deleted successfully");
      await fetchComments();
      // setTimeout(() => {
      //   commentsDiv.current.scrollTop = commentsDiv.current.scrollHeight
      // }, 300);;
    } catch (error) {
      toast.error("something went wrong");
    }finally{
      setLoading(false)
    }
  }
  async function fetchComments() {
    try {
      // setLoading(true);
      const { data } = await Axios.get(
        `/comment/retriveComment?blogId=${blogId}`
      );
      // console.log(data.data.comments[0].by._id , isVerified._id)
      setCommentsData(data.data.comments);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  }
  async function handleAddComment(e){
    e.preventDefault();
    try {
      setLoading(true)
      await Axios.post("/comment/addComment",{
        blogId,
        content: commentText
      })
      toast.success("commented successfully");
      setCommentText("")
      await fetchComments();
      setTimeout(() => {
        commentsDiv.current.scrollTop = commentsDiv.current.scrollHeight
      }, 300);;
    } catch (error) {
      if(error.status === 400){
        toast.error("commentField is empty")
      }
      else{
        toast.error("something went wrong");
      }
      
      
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="fixed z-10 top-0 left-0 bg-neutral-dark/60 h-screen w-full flex items-center justify-center">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <img src={loaderGif} alt="Loading..." className="w-20 h-20" />
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-background-light h-[70vh] w-[90%] md:w-[60%] shadow-lg overflow-hidden relative">
          <div className="flex justify-end">
            <button
              onClick={() => setOpenCommentsMenu(false)}
              className="bg-danger text-white p-2 rounded-full hover:bg-danger-dark transition-all"
              aria-label="Close"
            >
              ✖
            </button>
          </div>

          <div onClick={(e)=> {
            setIsCommentsMenuOpen(null)}} ref={commentsDiv} className="comments-div  overflow-y-auto h-[calc(100%-72px)] space-y-6 pb-4">
            {commentsData.length > 0 ? <>
              {commentsData.map((comment, index) => (
              <div
                key={index}
                className="comment border-b border-neutral-light pb-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={comment?.by.avatarImage || userLogo}
                    alt="user"
                    className="w-12 h-12 object-cover rounded-full bg-neutral-light"
                  />
                  <div className="flex-1">
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-primary-dark font-medium">
                          {isVerified?.data?._id === comment.by._id? "you": comment?.by?.userName}
                        </p>
                        <p className="text-sm text-neutral-dark">
                          {comment?.createdAt.slice(0, 10)}
                        </p>
                      </div>

                      {isVerified?.data?._id === comment?.by._id && <button
                        onClick={(e) =>
                          {e.stopPropagation();
                          setIsCommentsMenuOpen(
                            isCommentsMenuOpen !== null ? null : index
                          )
                        
                        }
                        }
                        className="text-sm text-accent hover:text-accent-dark transition-all flex items-center justify-center p-2 rounded-md hover:bg-neutral-light"
                        aria-label="More options"
                      >
                        <i className="fa-solid fa-bars text-2xl"></i>
                      </button>}

                      {isCommentsMenuOpen === index && (
                        <div className="absolute top-10 right-4 z-10 bg-gray-200 text-black rounded-2xl p-2 shadow-lg w-40">
                          <div
                            className="cursor-pointer px-4 py-2 rounded-2xl hover:text-white hover:bg-primary-light transition-all"
                            onClick={() => {
                              setUpdateComment(comment._id);
                              setCommentText(comment.content);
                            }}
                          >
                            Update
                          </div>
                          <div
                            className="cursor-pointer px-4 py-2 rounded-2xl hover:text-white hover:bg-danger-dark transition-all"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-neutral-dark break-all">{comment?.content}</p>
                  </div>
                </div>
              </div>
            ))}</> : <div className="flex items-center justify-center h-full w-full text-xl font-extrabold">No Comments Yet !</div>
            }
          </div>

          <form onSubmit={(e)=> { updateComment? handleUpdateComment(e) : handleAddComment(e)}} className="absolute flex-col md:flex-row bottom-4 left-4 right-4 flex gap-2">
            <input
            name="commentField"
              type="text"
              value={commentText}
              className="flex-1 px-4 py-2 border border-neutral-dark rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent-light "
              placeholder="Write a comment..."
              onChange={(e)=> setCommentText(e.target.value)}
            />
            {!updateComment && <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all">
              Comment
            </button>}
            {updateComment && <><button onClick={()=> {
              setCommentText("");
              setUpdateComment(null)
            }} className="px-4 py-2 bg-red-300 text-white rounded-md hover:bg-red-400  transition-all">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all">
              Update
            </button></>}
          </form>
        </div>
      )}
    </div>
  );
}


function UpdateComment() {
  return (
    <div>User</div>
  )
}

export default Comment;
