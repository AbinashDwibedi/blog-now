import React from "react";
import { useSelector } from "react-redux";
import loaderGif from "../assets/Loader.gif";
import userLogo from "../assets/userLogo.svg";
import {setSearchBtnState} from "../redux/search.js"
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Search() {
  const dispatch = useDispatch();
  const { loaded, data,statusCode } = useSelector((state) => state.search);

  return (
    <div className="absolute top-10 left-0 bg-background-light shadow-lg rounded-md p-4 w-80 border-4 z-50">
      <button
          onClick={() => dispatch(setSearchBtnState())}
          className="absolute top-2 right-2 text-neutral-dark bg-neutral-light rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger-light hover:text-danger-dark transition"
        >
          ✖
        </button>
      {loaded ? (
        <div>
          
          <div className="space-y-4">
            {data.map((people, index) => (
              <Link to={`/profile/${people._id}`}
                key={index}
                className="flex cursor-pointer items-center space-x-4 p-2 rounded-md hover:bg-neutral-light hover:text-neutral-dark transition-colors"
              >
                <img
                  src={people.avatarImage ? people.avatarImage : userLogo}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border border-neutral-light"
                />
                <p className="text-neutral-dark font-medium">{people.userName}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <img src={loaderGif} alt="Loading..." className="h-12 w-12" />
        </div>
      )}
    </div>
  );
}

export default Search;
