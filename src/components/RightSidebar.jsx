import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";
import { AppContext } from "../context/AppContext";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
    <div className="text-white bg-[#001030] relative h-[75vh] overflow-y-scroll max-lg:hidden">
      {/* profile details */}
      <div className="pt-[60px] text-center w-[70%] m-auto">
        <img
          className="w-[110px] inline aspect-square rounded-[50%]"
          src={chatUser.userData.avatar}
          alt=""
        />
        <h3 className="text-lg font-normal flex items-center justify-center gap-1 mx-0 my-1 ">
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastseen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </h3>
        <p className="text-xs opacity-[80%] font-light ">
          {chatUser.userData.bio}
        </p>
      </div>
      <hr className="border-[#ffffff50] m-[15px_0px]" />
      {/* user sent media */}
      <div className="px-5 py-0 text-1">
        <p>Media</p>
        <div className="max-h-[180px] overflow-y-scroll grid grid-cols-[1fr_1fr_1fr] gap-1 mt-2">
          {msgImages.map((url, index) => (
            <img
              onClick={() => window.open(url)}
              className="w-60px rounded-[4px] cursor-pointer"
              key={index}
              src={url}
              alt=""
            />
          ))}
          {/* <img
            className="w-60px rounded-[4px] cursor-pointer"
            src={assets.pic1}
            alt=""
          />
          <img
            className="w-60px rounded-[4px] cursor-pointer"
            src={assets.pic2}
            alt=""
          />
          <img
            className="w-60px rounded-[4px] cursor-pointer"
            src={assets.pic3}
            alt=""
          />
          <img
            className="w-60px rounded-[4px] cursor-pointer"
            src={assets.pic4}
            alt=""
          />
          <img
            className="w-60px rounded-[4px] cursor-pointer"
            src={assets.pic2}
            alt=""
          />
          <img
            className="w-60px rounded-[4px] cursor-pointer"
            src={assets.pic1}
            alt=""
          /> */}
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-[50%] translate-x-[-50%] bg-[#077eff] text-white border-none rounded text-xs font-light px-16 py-[10px] rs"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="text-white bg-[#001030] relative h-[75vh] overflow-y-scroll   max-lg:hidden">
      <button
        className="absolute bottom-5 left-[50%] translate-x-[-50%] bg-[#077eff] text-white border-none rounded text-xs font-light px-16 py-[10px]"
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
