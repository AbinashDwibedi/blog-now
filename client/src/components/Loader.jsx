import React from 'react'
import LoaderGif from "../assets/Loader.gif"
function Loader() {
  return (
    <div className="loader h-screen w-full flex justify-center  items-center">
          <img src={LoaderGif} alt="" className="h-40" />
        </div>
  )
}

export default Loader