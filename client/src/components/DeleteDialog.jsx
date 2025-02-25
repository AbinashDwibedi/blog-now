import React, { useState } from "react";
import loaderGif from "../assets/Loader.gif";
import { toast } from "react-toastify";
import { Axios } from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

function DeleteDialog({ setDeleteInputState }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(true);
  const [password, setPassword] = useState("");
    function handlePassword(e){
        setPassword(e.target.value)
    }
  async function handleSubmit(e) {
    e.preventDefault();
    // const passwordRegex = /.+/;
    // const validateForm = passwordRegex.test(password);
    // if (!validateForm) {
    //   toast.error("Please enter a valid password.");
    //   return;
    // }
    try {
      setLoaded(false);
      await Axios.delete("/user/deleteUser", {
        data: {password}
      });
      toast.success("User deleted successfully");
      setLoaded(true);
      navigate("/login");
    } catch (error) {
      setLoaded(true);
      if (error.response?.status === 401) {
        toast.error("Password is incorrect");
      } else {
        toast.error("Error deleting the user, please try again.");
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-neutral-dark/50 fixed top-0 left-0 z-10 flex items-center justify-center">
      <div className="bg-background-light rounded-lg shadow-lg p-8 w-[90%] max-w-md relative">
        <button
          onClick={() => {setDeleteInputState(false)}}
          className="absolute top-2 right-2 text-neutral-dark bg-neutral-light rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger-light hover:text-danger-dark transition"
        >
          ✖
        </button>
        {loaded ? (
          <div>
            <h2 className="text-primary-dark text-xl font-semibold mb-4">
              Delete Account
            </h2>
            <p className="text-neutral-dark mb-6">
              Enter your password to confirm account deletion. This action
              cannot be undone.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border-2 border-neutral-light rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
                value={password}
                onChange={(e) => handlePassword(e)}
              />
              <button
                type="submit"
                className="w-full bg-danger-dark text-white font-semibold py-2 rounded-md hover:bg-danger-light transition"
              >
                Delete Account
              </button>
            </form>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <img src={loaderGif} alt="Loading..." className="w-16 h-16" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DeleteDialog;
