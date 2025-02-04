import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import LeftSidebar from "../../components/LeftSidebar";
import ChatBox from "../../components/ChatBox";
import RightSidebar from "../../components/RightSidebar";
import { AppContext } from "../../context/AppContext";
const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);
  return (
    <div className="min-h-[100vh] bg-gradient-to-t from-cyan-200 to-blue-500 grid place-items-center  ">
      {loading ? (
        <p className="text-5xl text-white "> Loading ...</p>
      ) : (
        <div className="w-[95%] h-[75vh] max-w-[1000px] bg-sky-50 grid grid-cols-[1fr_2fr_1fr] max-lg:flex">
          <LeftSidebar />
          <ChatBox />
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default Chat;
