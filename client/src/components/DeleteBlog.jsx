import React, { useState } from "react";
import loaderGif from "../assets/Loader.gif";
import { Axios } from "../utils/axios";
import { toast } from "react-toastify";

function DeleteBlog({ setOpenDeleteBlogDialog, blogId,setOpenMenuIndex }) {
  const [loaded, setLoaded] = useState(true);

  async function handleBlogDelete() {
    try {
      setLoaded(false);
      await Axios.delete(`/blog/deleteBlog?blogId=${blogId}`);
      toast.success("Blog deleted successfully");
      setOpenDeleteBlogDialog(false);
    } catch (error) {
      toast.error("Something went wrong while deleting the blog");
    } finally {
      setLoaded(true);
      setOpenMenuIndex(null);
      location.reload();
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-neutral-dark/50 flex items-center justify-center z-50">
      {loaded ? (
        <div className="bg-background-light relative gap-6 text-lg text-neutral-dark p-6 font-semibold rounded-xl flex flex-col items-center shadow-lg">
          <div className="text-neutral-dark text-xl mb-4">Are you sure?</div>
          <div className="flex gap-8">
            <button
              onClick={() => setOpenDeleteBlogDialog(false)}
              className="bg-neutral-light text-neutral-dark hover:bg-neutral-dark hover:text-background-light px-6 py-2 rounded-md transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleBlogDelete}
              className="bg-danger-light text-danger-dark hover:bg-danger-dark hover:text-background-light px-6 py-2 rounded-md transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <img src={loaderGif} alt="Loading..." className="w-16 h-16" />
      )}
    </div>
  );
}

export default DeleteBlog;
