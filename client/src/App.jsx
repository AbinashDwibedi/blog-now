import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useEffect, useState } from "react";
import { Axios } from "./utils/axios.js";
import "react-toastify/ReactToastify.css"
import {toast, ToastContainer}  from "react-toastify"
import Profile from "./pages/Profile"
// import loaderGif from "./assets/Loader.gif"
import Loader from "./components/Loader";
import FollowingFollowers from "./components/FollowingFollowers.jsx";
import Messages from "./pages/Messages.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [loaded, setLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState({});

  useEffect(() => {
    async function checkUser() {
      try {
        const {data} = await Axios.get("/user/verifyUser");
        if(location.pathname === "/login" || location.pathname === "/register"){
          navigate("/")
        }
        setIsVerified(data);

      } catch (error) {
        // Redirect to /login only if the user is not already on an allowed page
        try {
          await Axios.get("/user/refreshAccessToken");
          setIsVerified(true)
        } catch (error) {
          
          if (location.pathname !== "/login" && location.pathname !== "/register") {
          navigate("/login");
        }
        }
      } finally {
        setLoaded(true);
      }
    }
    checkUser();
  }, [location.pathname]); 
    
  return (
    <>
      {loaded ? (
        <>
        <Routes>
          <Route path="/" element={<Home isVerified={isVerified}/>} />
          <Route path="/login" element={<Login isVerified={isVerified} />} />
          <Route path="/register" element={<Register isVerified={isVerified} />} />
          <Route path="/about" element={<About isVerified={isVerified}/>} />
          <Route path="/contact" element={<Contact isVerified={isVerified}/>} />
          <Route path="/profile/:userId" element={<Profile isVerified={isVerified}/>} />
          <Route path="/messages" element={<Messages isVerified={isVerified}/>}/>
          <Route path="/user/:userId/:followState" element={<FollowingFollowers/>} />
        </Routes>
        <ToastContainer/>
        </>
      ) : (
        <Loader/>
      )}
    </>
  );
}

export default App;
