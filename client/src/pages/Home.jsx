import Navbar from "../components/Navbar";
import HomeFirst from "../components/HomeFirst";
import HomeSecond from "../components/HomeSecond";
import HomeThird from "../components/HomeThird";
import { useState } from "react";

function Home({isVerified}) {
  const [openLeftMenu, setOpenLeftMenu] = useState(false);
  const [openRightMenu, setOpenRightMenu] = useState(false);
  return (
    <>
      <Navbar />
      <div className="main-section select-none h-screen w-full pt-14 flex  md:flex-row bg-background-light text-neutral-dark">
        {/* First Sub-section */}
        <div className="left-Menu-icon p-1 md:hidden h-fit fixed left-0" ><i onClick={()=>setOpenLeftMenu(!openLeftMenu)} className="fa fa-user text-2xl p-2 bg-gray-200 cursor-pointer transition-all hover:text-white rounded-full hover:bg-gray-300"></i></div>
        <HomeFirst setOpenLeftMenu={setOpenLeftMenu} openLeftMenu={openLeftMenu}/>
        {/* Second Sub-section */}
        <HomeSecond isVerified={isVerified}/>

        {/* Third Sub-section */}
        <div className="right-Menu-icon p-1 md:hidden h-fit fixed right-0" ><i className="fa fa-users text-2xl p-2 bg-gray-200 cursor-pointer transition-all hover:text-white rounded-full hover:bg-gray-300" onClick={()=>setOpenRightMenu(!openRightMenu)}></i></div>
        <HomeThird setOpenRightMenu={setOpenRightMenu} openRightMenu={openRightMenu}/>
      </div>
    </>
  );
}

export default Home;
