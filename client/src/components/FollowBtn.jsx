import React, { useEffect, useState } from 'react'
import { Axios } from '../utils/axios';
function FollowBtn({followUser}) {
    const [allFollowingUsers , setAllFollowingUsers] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    // if(userId === followUserId){
    //     setIsFollowing(true)
    // 
    async function handleFollow(){
        try {
            await Axios.get(`/user/followUnfollow?followingUserId=${followUser}`);
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.log("error while following or unfollowing",error);
        }
    }
    useEffect(()=>{
         async function f(){
        try {
              const {data} = await Axios.get(`/user/checkFollow?followUser=${followUser}`);
              setIsFollowing(data.data)
            }
        catch (error) {
            console.log("error getting followerst", error);
        }
    }
        f();
    },[followUser])
    
  return (
    <button onClick={()=> handleFollow()} className="ml-4 mr-4   hover:text-white text-black ">
       {isFollowing? <p className='bg-gray-300 rounded-full py-2 px-3 font-medium'>unfollow</p> : <p className='rounded-full py-2 px-3 font-medium sbg-primary-light bg-primary-light hover:bg-primary-dark'>follow</p>} 
        
    </button>
  )
}

export default FollowBtn