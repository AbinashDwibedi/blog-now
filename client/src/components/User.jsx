import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Axios } from '../utils/axios';
import { toast } from 'react-toastify';
import DeleteDialog from './DeleteDialog';
import ChangeImage from './ChangeImage';
import Loader from "./Loader"
import FollowBtn from './FollowBtn';
import FollowingFollowers from './FollowingFollowers';

function User({ isVerified }) {
  const { userId } = useParams();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); 
  const [deleteInputState, setDeleteInputState] = useState(false); 
  const [isChangeImageOpen, setIsChangeImageOpen] = useState(false); 
  const [imageType, setImageType] = useState(''); 
  const [userData, setUserData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [followBoxOpen,setFollowBoxOpen] = useState(null);
  useState(() => {
    async function asyncFunc() {
      try {
        if (userId) {
          const { data } = await Axios.get(`/user/showProfile/${userId}`);
          setUserData(data.data);
        }
      } catch (error) {
        toast.error('Something went wrong');
      }finally{
        setLoaded(true)
      }
    }
    asyncFunc();
  }, [userData,userId]);
  

  function handleChangeImage(type) {
    setImageType(type);
    setIsChangeImageOpen(true);
  }

  return (
    <>
    {loaded? <div className="bg-background-light rounded-lg">
      {deleteInputState && <DeleteDialog setDeleteInputState={setDeleteInputState} />}
      {isChangeImageOpen && (
        <ChangeImage
          type={imageType}
          userId={userId}
          setIsChangeImageOpen={setIsChangeImageOpen}
          setUserData={setUserData}
        />
      )}
      <div className="relative">
       
        <div className={`relative w-full ${!userData.avatarImage && "animate-pulse"} bg-gray-300 h-40 md:h-48 rounded-xl`}>
          {userData.backgroundImage && <img
            src={
              userData.backgroundImage
            }
            alt="Background"
            className="w-full h-full object-cover rounded-xl"
          />}
          {(isVerified?.data?._id === userId) && <div className="absolute bottom-4 right-4">
            <button
              onClick={() => handleChangeImage('background')}
              className="text-primary-dark block cursor-pointer bg-gray-300 p-2 rounded-full shadow-lg"
            >
              📷
            </button>
          </div>}
          
        </div>
        <div className={`relative  bg-gray-300 border-4 ${!userData.avatarImage && "animate-pulse"} border-white rounded-full bottom-20 left-8  w-28 h-28 md:w-40 md:h-40 `}>
          {userData.avatarImage && <img
            src={
              userData.avatarImage ||
              'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=60'
            }
            alt="Avatar"
            className="avatar-image  w-full h-full  object-cover rounded-full"
          />}
          {(isVerified?.data?._id === userId) && <div className="absolute -bottom-0 left-20 md:left-28 md:bottom-15">
            <button
              onClick={() => handleChangeImage('avatar')}
              className="text-primary-dark cursor-pointer block bg-white p-2 rounded-full shadow-lg z-10"
            >
              📷
            </button>
          </div>}
          
        </div>
      </div>

      
        <div className="relative w-full flex items-center justify-end -mt-20 sm:-mt-24">
          <div className=" rounded-md p-2 text-sm flex items-center justify-center gap-2  md:flex-row md:gap-2 text-neutral-dark">
            <p onClick={()=> {setFollowBoxOpen(1)}} className='font-extrabold text-primary cursor-pointer hover:text-primary-dark'>{userData.followersCount} Followers</p>
            <p onClick={()=> {setFollowBoxOpen(2)}} className='font-extrabold text-primary cursor-pointer hover:text-primary-dark'>{userData.followingCount} Following</p>
            {followBoxOpen && <FollowingFollowers userId={userId} followBoxOpen={followBoxOpen} setFollowBoxOpen={setFollowBoxOpen}/>}
            {/* {followBoxOpen===2 && <FollowingFollowers setFollowBoxOpen={setFollowBoxOpen}/>} */}
          </div>
          
          {isVerified?.data?._id !== userId && <FollowBtn  followUser={userId} />}
          {(isVerified?.data?._id === userId) && (<>
          <button
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="px-2 py-1 bg-primary-light hover:bg-primary-dark transition-all text-white rounded-xl"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          
          {isProfileMenuOpen && (
            <div className="absolute flex flex-col gap-1 right-8 mt-14 bg-white w-fit p-2 h-fit border-2 border-primary-dark rounded-xl">
              <button
                onClick={() => {setDeleteInputState(!deleteInputState);setIsProfileMenuOpen(!isProfileMenuOpen)}}
                className="p-2 bg-danger-light hover:bg-danger-dark hover:text-white transition-all rounded-md"
              >
                Delete Account
              </button>
            </div>
          )}
          </>)}
        </div>
      

      <div className="p-4 rounded-lg max-w-lg  mt-6 md:mt-12 bg-gray-300">
        <h2 className="text-2xl  font-semibold text-primary-dark mb-4">Profile Information</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-neutral-dark">
            <span className="font-medium text-lg">👤</span>
            <span className="font-medium text-lg">{userData.userName}</span>
          </div>
          <div className="flex items-center space-x-2 text-neutral-dark">
            <span className="font-medium text-lg">📝</span>
            <span className="text-lg">{userData.fullName}</span>
          </div>
          <div className="flex items-center space-x-2 text-neutral-dark">
            <span className="font-medium text-lg">📧</span>
            <span className="text-lg">{userData.email}</span>
          </div>
        </div>
      </div>
    </div>
   : <Loader/>}
    </>);
}


export default User;

// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Axios } from '../utils/axios';
// import { toast } from 'react-toastify';
// import DeleteDialog from './DeleteDialog';
// import ChangeImage from './ChangeImage';
// import Loader from "./Loader"
// import FollowBtn from './FollowBtn';
// import FollowingFollowers from './FollowingFollowers';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '../redux/profile.js';

// function User({ isVerified }) {
//   const dispatch = useDispatch();
//   const { userId } = useParams();
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); 
//   const [deleteInputState, setDeleteInputState] = useState(false); 
//   const [isChangeImageOpen, setIsChangeImageOpen] = useState(false); 
//   const [imageType, setImageType] = useState(''); 
//   // const [userData, setUserData] = useState({});
//   // const [loaded, setLoaded] = useState(false);
//   const {userData , loaded} = useSelector((state)=> state.profile);
//   const [followBoxOpen,setFollowBoxOpen] = useState(null);
//   useState(() => {
//     // async function asyncFunc() {
//     //   try {
//     //     if (userId) {
//     //       const { data } = await Axios.get(`/user/showProfile/${userId}`);
//     //       setUserData(data.data);
//     //     }
//     //   } catch (error) {
//     //     toast.error('Something went wrong');
//     //   }finally{
//     //     setLoaded(true)
//     //   }
//     // }
//     // asyncFunc();
//     dispatch(fetchUserData(userId))
//   }, [userData,userId,dispatch]);
  

//   function handleChangeImage(type) {
//     setImageType(type);
//     setIsChangeImageOpen(true);
//   }