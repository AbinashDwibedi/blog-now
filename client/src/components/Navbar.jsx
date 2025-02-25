import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../utils/axios";
import {toast} from "react-toastify"
import { useDispatch,useSelector } from "react-redux";
import {setSearchBtnState,setSearchText,fetchSearchResults} from "../redux/search.js"
import Search from "./Search";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const {searchBtnState,searchText} = useSelector((state)=> state.search);
  const navigate = useNavigate();
  const handleLogoutUser = async()=>{
    try {
      await Axios.get("/user/logout");
      toast.error("Logout Successfully");
      navigate("/login")
    } catch (error) {
      toast.error("Something went wrong");
    }
  } 

  const handleSearch = async()=>{
    
      if(!!searchText){
        if(!searchBtnState){
        dispatch(fetchSearchResults(searchText))
        }
        dispatch(setSearchBtnState())
      }
    
   
  }
  return (
    <div className="z-40 bg-background-dark text-neutral-light shadow-md h-14 px-4 fixed w-full top-0">
      <div className="flex justify-between items-center h-full">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://cdn-icons-png.freepik.com/256/7466/7466047.png?semt=ais_hybrid"
            alt="Logo"
            className="h-8 w-8"
          />
        </Link>

        <div className="hidden md:flex space-x-6 text-sm">
          <Link
            to="/"
            className="text-neutral-light hover:text-primary-light transition-colors"
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="text-neutral-light hover:text-primary-light transition-colors"
          >
            ABOUT
          </Link>
          <Link
            to="/contact"
            className="text-neutral-light hover:text-primary-light transition-colors"
          >
            CONTACT
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2 relative">
          <input
          id="search"
          onChange={(e)=> dispatch(setSearchText(e.target.value))}
            type="text"
            placeholder="Search users..."
            className="px-3 py-1 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-accent-light text-neutral-dark text-sm"
          />
          <button onClick={handleSearch} className="px-3 py-1 bg-accent-dark text-white rounded-md hover:bg-accent-light transition-colors text-sm">
            <i className="fas fa-search"></i>
          </button>
          {searchBtnState && <Search />}
          <button onClick={handleLogoutUser} className="px-3 py-1 bg-accent-dark text-white rounded-md hover:bg-accent-light transition-colors text-sm">
            <i className="fas fa-sign-out-alt"></i> logout
          </button>
        </div>
        <div className="flex items-center justify-center md:hidden">
          
        <button
          className="md:hidden text-neutral-light"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
        <button onClick={handleLogoutUser} className="ml-4 md:hidden px-3 py-1 bg-accent-dark text-white rounded-md hover:bg-accent-light transition-colors text-sm">
            <i className="fas fa-sign-out-alt"></i> logout
          </button>
          </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background-dark text-neutral-light w-full absolute top-14 left-0 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="block text-sm text-center text-neutral-light hover:text-primary-light hover:bg-primary-dark p-3 rounded-md transition-all"
            >
              HOME
            </Link>
            <Link
              to="/about"
              className="block text-sm text-center text-neutral-light hover:text-primary-light hover:bg-primary-dark p-3 rounded-md transition-all"
            >
              ABOUT
            </Link>
            <Link
              to="/contact"
              className="block text-sm text-center text-neutral-light hover:text-primary-light hover:bg-primary-dark p-3 rounded-md transition-all"
            >
              CONTACT
            </Link>
            <div className="flex flex-col space-y-4 mt-6">
              <input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 rounded-md border border-neutral-dark bg-background-light focus:outline-none focus:ring-2 focus:ring-accent-light text-neutral-dark text-sm"
              />
              <button className="px-4 py-2 bg-accent-dark text-white rounded-md hover:bg-accent-light transition-colors text-sm">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}

export default Navbar;
