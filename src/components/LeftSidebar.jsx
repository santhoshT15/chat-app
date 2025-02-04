import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, logout } from "../config/firebase";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setMessagesId,
    setChatUser,
    messagesId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rid === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });

          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addChat = async () => {
    const msgRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMsgRef = doc(msgRef);
      await setDoc(newMsgRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      //   First Chat update
      const userChatRef = doc(chatsRef, user.id);
      await updateDoc(userChatRef, {
        chatsData: arrayUnion({
          messageId: newMsgRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      //   Second Chat update
      const UerDataChatRef = doc(chatsRef, userData.id);
      await updateDoc(UerDataChatRef, {
        chatsData: arrayUnion({
          messageId: newMsgRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChat({
        messagesId: newMsgRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData,
      });

      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      const userChatsRef = doc(db, "chats", userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatsData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatsData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatsData: userChatsData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser((prev) => ({ ...prev, userData: userData }));
      }
    };
    updateChatUserData();
  }, [chatData]);

  return (
    <div
      className={`bg-[#040b1a] text-white h-[75vh] max-lg:w-[100%] ${
        chatVisible ? "max-lg:hidden" : ""
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} className="max-w-[140px]" alt="" />
          <div className="group relative px-0 py-2 ">
            <img
              className="max-h-[20px] cursor-pointer"
              src={assets.menu_icon}
              alt=""
            />
            <div className="absolute top-[100%] right-0 w-32 p-5 rounded bg-white text-black hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="border-none h-[1px] bg-[#a4a4a4] mx-0 my-2" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#153168] flex items-center gap-2 px-3 py-[10px] mt-5">
          <img className="w-4" src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            className="bg-transparent border-none outline-none text-white text-xs"
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="flex flex-col h-[70%] overflow-y-scroll">
        {showSearch && user ? (
          <div
            onClick={addChat}
            className="flex items-center gap-2 px-5 py-[10px] cursor-pointer text-xs hover:bg-[#077eff]"
          >
            <img
              className="w-9 rounded-[50%] aspect-square"
              src={user.avatar}
              alt=""
            />
            <p className="flex flex-col">{user.name}</p>
          </div>
        ) : chatData && chatData.length > 0 ? (
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className="flex items-center gap-2 px-5 py-[10px] cursor-pointer text-xs hover:bg-[#077eff]"
            >
              <img
                className={`w-9 rounded-[50%] aspect-square ${
                  item.messageSeen || item.messageId === messagesId
                    ? ""
                    : "border-solid border-[3px] border-[#07fff3]"
                }`}
                src={item.userData.avatar}
                alt=""
              />
              <div className="flex flex-col">
                <p>{item.userData.name}</p>
                <span
                  className={`text-[#9f9f9f] text-[11px] hover:text-white ${
                    item.messageSeen || item.messageId === messagesId
                      ? ""
                      : "text-[#07fff3]"
                  }`}
                >
                  {item.lastMessage}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 mt-5">
            No chats available
          </p>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
