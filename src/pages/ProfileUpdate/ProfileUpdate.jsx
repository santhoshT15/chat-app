import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (e) => {
    e.preventDefault();

    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture...");
      }

      const docRef = doc(db, "users", uid);

      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docsnap = await getDoc(docRef);

        if (docsnap.data().name) {
          setName(docsnap.data().name);
        }
        if (docsnap.data().bio) {
          setBio(docsnap.data().bio);
        }
        if (docsnap.data().avatar) {
          setPrevImage(docsnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="min-h-[100vh] bg-[url(/background_2.jpg)] bg-no-repeat bg-cover flex items-center justify-center">
      <div className="bg-white flex items-center justify-between min-w-[700px] rounded-lg max-lg:flex-col">
        <form onSubmit={profileUpdate} className="flex flex-col gap-5 p-10">
          <h1 className="font-medium">Profile Details</h1>
          <label
            className="flex items-center gap-2 text-gray-600 cursor-pointer"
            htmlFor="avatar"
          >
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".jpg, .png, .jpeg"
              hidden
            />
            <img
              className="w-[50px] aspect-square rounded-[50%]"
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="p-2 min-w-[300px] border-solid border-[1px] border-[#c9c9c9] outline-[#077eff]"
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-2 min-w-[300px] border-solid border-[1px] border-[#c9c9c9] outline-[#077eff]"
            placeholder="Write your profile bio..."
            required
          ></textarea>
          <button
            className="border-none text-white bg-[#077eff] p-2 text-base cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          className="max-w-[160px] aspect-square mx-auto my-5 rounded-[50%]"
          src={
            image
              ? URL.createObjectURL(image)
              : prevImage
              ? prevImage
              : assets.logo_icon
          }
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
