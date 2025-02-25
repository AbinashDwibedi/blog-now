// import React, { useState } from "react";
// import { Axios } from "../utils/axios.js";
// import { setOpenClose, setBlogData, setUploading } from "../redux/addBlog.js";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import loaderGif from "../assets/Loader.gif";

// function AddBlog() {
//   const dispatch = useDispatch();
//   const [blogImage, setBlogImage] = useState("");
//   const [blogImageUrl, setBlogImageUrl] = useState("");
//   const blogData = useSelector((state) => state.addBlog);

//   function handleBlogImage(event) {
//     const file = event.target?.files[0];
//     if (file) {
//       setBlogImage(file);
//       setBlogImageUrl(URL.createObjectURL(file));
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (validateFormData(blogData)) {
//       const formData = new FormData();
//       formData.append("title", blogData.title || "");
//       formData.append("contentText", blogData.contentText || "");
//       formData.append("visibility", blogData.visibility || "public");
//       formData.append("blogImage", blogImage);

//       try {
//         dispatch(setUploading());
//         await Axios.post("/blog/uploadBlog", formData);
//         dispatch(setOpenClose());
//         dispatch(setUploading());
//         toast.success("Blog created successfully");
//       } catch (error) {
//         toast.error("Something went wrong while creating the blog");
//       }
//     }
//   }

//   function validateFormData(blogData) {
//     if (!blogData.title || !blogData.contentText) {
//       toast.error("Title and content are required");
//       return false;
//     }
//     return true;
//   }

//   return (
//     <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6">
//         {blogData.uploading ? (
//           <div className="flex justify-center items-center h-full">
//             <img src={loaderGif} alt="Loading..." className="h-16" />
//           </div>
//         ) : (
//           <>
//             <button
//               onClick={() => dispatch(setOpenClose())}
//               className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-700"
//               aria-label="Close"
//             >
//               <i className="fa-solid fa-xmark"></i>
//             </button>
//             <form
//               onSubmit={handleSubmit}
//               className="space-y-6"
//               encType="multipart/form-data"
//             >
//               <div>
//                 <label
//                   htmlFor="blogImage"
//                   className="h-40 w-full bg-primary-light flex justify-center items-center rounded-xl border-neutral-light cursor-pointer"
//                 >
//                   {blogImageUrl ? (
//                     <img
//                       src={blogImageUrl}
//                       alt="Preview"
//                       className="object-cover h-full w-full rounded-xl"
//                     />
//                   ) : (
//                     <div className="text-center text-background-light">
//                       <i className="block mb-2 text-xl">+</i>
//                       <p>Upload Blog Image</p>
//                     </div>
//                   )}
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   id="blogImage"
//                   name="blogImage"
//                   onChange={handleBlogImage}
//                   className="hidden"
//                 />
//               </div>
//               <div>
//                 <input
//                   type="text"
//                   name="blogTitle"
//                   placeholder="Blog Title"
//                   className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
//                   onChange={(e) =>
//                     dispatch(
//                       setBlogData({ field: "title", value: e.target.value })
//                     )
//                   }
//                 />
//               </div>
//               <div>
//                 <textarea
//                   placeholder="Write your blog content here..."
//                   rows="6"
//                   name="blogContent"
//                   className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
//                   onChange={(e) =>
//                     dispatch(
//                       setBlogData({
//                         field: "contentText",
//                         value: e.target.value,
//                       })
//                     )
//                   }
//                 ></textarea>
//               </div>
//               <div>
//                 <select
//                 name="visibility"
//                   className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
//                   onChange={(e) =>
//                     dispatch(
//                       setBlogData({ field: "visibility", value: e.target.value })
//                     )
//                   }
//                 >
//                   <option value="public">Public</option>
//                   <option value="private">Private</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-primary-dark text-white p-3 rounded-3xl hover:bg-primary"
//               >
//                 Create Blog
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AddBlog;

import React, { useState } from "react";
import { Axios } from "../utils/axios.js";
import { setOpenClose, setBlogData, setUploading } from "../redux/addBlog.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import loaderGif from "../assets/Loader.gif";

function AddBlog() {
  const dispatch = useDispatch();
  const [blogImage, setBlogImage] = useState("");
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const blogData = useSelector((state) => state.addBlog);

  const handleBlogImage = (event) => {
    const file = event.target?.files[0];
    if (file) {
      setBlogImage(file);
      setBlogImageUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (field, value) => {
    dispatch(setBlogData({ field, value }));
  };

  const validateFormData = (data) => {
    if (!data.title || !data.contentText) {
      toast.error("Title and content are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFormData(blogData)) {
      const formData = new FormData();
      formData.append("title", blogData.title || "");
      formData.append("contentText", blogData.contentText || "");
      formData.append("visibility", blogData.visibility || "public");
      formData.append("blogImage", blogImage);

      try {
        dispatch(setUploading());
        await Axios.post("/blog/uploadBlog", formData);
        dispatch(setOpenClose());
        dispatch(setUploading());
        toast.success("Blog created successfully");
      } catch (error) {
        toast.error("Something went wrong while creating the blog");
      }
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-full max-w-xl rounded-lg shadow-xl p-6">
        {blogData.uploading ? (
          <div className="flex justify-center items-center h-full">
            <img src={loaderGif} alt="Loading..." className="h-16" />
          </div>
        ) : (
          <>
            <button
              onClick={() => dispatch(setOpenClose())}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div className="flex flex-col items-center space-y-2">
                <label
                  htmlFor="blogImage"
                  className="w-full h-40 bg-primary-light flex justify-center items-center rounded-lg border border-neutral-light cursor-pointer"
                >
                  {blogImageUrl ? (
                    <img
                      src={blogImageUrl}
                      alt="Preview"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="text-background-light text-center">
                      <i className="text-2xl mb-1">+</i>
                      <p>Upload Blog Image</p>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="blogImage"
                  name="blogImage"
                  onChange={handleBlogImage}
                  className="hidden"
                />
              </div>
              <input
                type="text"
                placeholder="Blog Title"
                className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              <textarea
                placeholder="Write your blog content here..."
                rows="5"
                className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
                onChange={(e) => handleInputChange("contentText", e.target.value)}
              ></textarea>
              <select
                className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary"
                onChange={(e) => handleInputChange("visibility", e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <button
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-dark"
              >
                Create Blog
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddBlog;

