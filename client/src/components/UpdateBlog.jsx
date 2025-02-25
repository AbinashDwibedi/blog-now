import React, { useEffect, useState } from "react";
import { Axios } from "../utils/axios.js";
import { toast } from "react-toastify";
import loaderGif from "../assets/Loader.gif";

function UpdateBlog({ setOpenUpdateBlogDialog, blog }) {
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [blogImage, setBlogImage] = useState("");
  function handleBlogImage(e){
    let file = e.target.files[0];
    let fileUrl = URL.createObjectURL(file);
    setBlogImage(file);
    setBlogImageUrl(fileUrl);
  }
  const [blogData, setBlogData] = useState({
    title: "",
    contentText: "",
  });
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (blog) {
      setBlogData({
        title: blog.title,
        contentText: blog.contentText,
      });
      if(blog.blogImage);
      setBlogImageUrl(blog.blogImage);
    }
  }, [blog]);


  function handleFormData(event) {
    const { name, value } = event.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateFormData(blogData)) {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("contentText", blogData.contentText);
      formData.append("_id", blog._id);
      formData.append("blogImage", blogImage);

      try {
        setUploading(true);
        await Axios.put("/blog/updateBlog", formData);
        toast.success("Blog updated successfully");
        setOpenUpdateBlogDialog(false);
      } catch (error) {
        toast.error("Something went wrong while updating the blog");
      } finally {
        setUploading(false);
      }
    }
  }

  function validateFormData(blogData) {
    if (!blogData.title || !blogData.contentText) {
      toast.error("Title and content are required");
      return false;
    } 
    return true;
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white text-black w-full max-w-3xl rounded-md shadow-lg p-6">
        {uploading ? (
          <div className="flex justify-center items-center h-full">
            <img src={loaderGif} alt="Loading..." className="h-16" />
          </div>
        ) : (
          <>
            <button
              onClick={() => setOpenUpdateBlogDialog(false)}
              className="absolute top-4 right-4 bg-red-500 text-black p-2 rounded-full hover:bg-red-700"
              aria-label="Close"
            >
              ✖
            </button>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              <div>
                <label
                  htmlFor="blogImage"
                  className="h-40 w-full bg-primary-light flex justify-center items-center rounded-md border-2 border-dashed border-neutral-light cursor-pointer"
                >
                  {blogImageUrl ? (
                    <img
                      src={blogImageUrl}
                      alt="Preview"
                      className="object-cover h-full w-full rounded-md"
                    />
                  ) : (
                    <div className="text-center text-neutral-dark">
                      <i className="block mb-2 text-xl">+</i>
                      <p>Upload Blog Image</p>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="blogImage"
                  onChange={handleBlogImage}
                  className="hidden"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Blog Title"
                  className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
                  onChange={handleFormData}
                  value={blogData.title}
                />
              </div>
              <div>
                <textarea
                  placeholder="Write your blog content here..."
                  rows="6"
                  name="contentText"
                  className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
                  onChange={handleFormData}
                  value={blogData.contentText}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-dark text-white p-3 rounded-md hover:bg-primary"
              >
                Update Blog
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default UpdateBlog;
