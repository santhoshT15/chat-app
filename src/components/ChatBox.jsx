import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import upload from "../lib/upload";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const {
    userData,
    messagesId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
    setInput("");
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      onsole.error(error);
      toast.error(error.message);
    }
  };

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM";
    } else {
      return hour + ":" + minute + " AM";
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
        //console.log(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  return chatUser ? (
    <div
      className={`h-[75vh] relative bg[#f1f5ff] max-lg:w-[100%] max-lg:justify-center ${
        chatVisible ? "" : "max-lg:hidden"
      }`}
    >
      <div className="px-[15px] py-[10px] flex items-center gap-[10px] border-solid border-[#c6c6c6] border-b ">
        {/* user avatar */}
        <img
          className="w-[38px] aspect-square rounded-[50%]"
          src={chatUser.userData.avatar}
          alt=""
        />
        {/* user name and status */}
        <p className="flex-1 font-medium text-xl flex items-center gap-1">
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastseen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img
          className="w-6 rounded-[50%] max-lg:hidden"
          src={assets.help_icon}
          alt=""
        />
        <img
          onClick={() => setChatVisible(false)}
          className="w-6 rounded-[50%] hidden max-lg:block"
          src={assets.arrow_icon}
          alt=""
        />
      </div>
      {/* chat messages display box */}
      <div className="h-[calc(100%-70px)] pb-12 overflow-y-scroll flex flex-col-reverse">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sId === userData.id
                ? "flex items-end justify-end gap-1 px-4 py-0" //sender message
                : "flex flex-row-reverse items-end justify-end gap-1 px-4 py-0" //reciver message
            }
          >
            {msg["image"] ? (
              <img
                className="max-w-[230px] mb-8 rounded-lg"
                src={msg.image}
                alt=""
              />
            ) : (
              <p className="text-white bg-[#077eff] p-2 max-w-[200px] text-xs font-light rounded-[8px_8px_0px_8px] mb-7">
                {msg.text}
              </p>
            )}

            <div>
              <img
                className="w-7 aspect-square rounded-[50%]"
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p className="items-center text-[9px]">
                {convertTimestamp(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* input Message box */}
      <div className="flex items-center gap-3 px-4 py-[10px] bg-white absolute bottom-0 left-0 right-0 ">
        {/* text message input */}
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="flex-1 border-none outline-none placeholder:text-slate-700"
          type="text"
          placeholder="Send a message"
        />
        {/* image input */}
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpg"
          hidden
        />
        <label className="flex " htmlFor="image">
          <img
            className="w-5 cursor-pointer "
            src={assets.gallery_icon}
            alt=""
          />
        </label>
        {/* send button */}
        <img
          onClick={sendMessage}
          className="w-7 cursor-pointer"
          src={assets.send_button}
          alt=""
        />
      </div>
    </div>
  ) : (
    <div
      className={`w-[100%] flex flex-col items-center justify-center gap-1 ${
        chatVisible ? "" : "max-lg:hidden"
      }`}
    >
      <img className="w-[60px]" src={assets.logo_icon} alt="" />
      <p className="text-xl font-medium text-[#383838]">
        Chat anytime, anywhere
      </p>
    </div>
  );
};

export default ChatBox;

{
  /* <div className="flex items-end justify-end gap-1 px-4 py-0">
          <img
            className="max-w-[230px] mb-8 rounded-lg"
            src={assets.pic1}
            alt=""
          />
          <div>
            <img
              className="w-7 aspect-square rounded-[50%]"
              src={assets.profile_img}
              alt=""
            />
            <p className="items-center text-[9px]">2:30pm</p>
          </div>
        </div>
          // receiver message dailogue
          <div className="flex flex-row-reverse items-end justify-end gap-1 px-4 py-0">
            <p className="text-white bg-[#077eff] p-2 max-w-[200px] text-xs font-light rounded-[8px_8px_8px_0px] mb-7">
              {" "}
              Hello, man
            </p>
            <div>
              <img
                className="w-7 aspect-square rounded-[50%]"
                src={assets.profile_img}
                alt=""
              />
              <p className="items-center text-[9px]">2:30pm</p>
            </div>
          </div>; */
}
