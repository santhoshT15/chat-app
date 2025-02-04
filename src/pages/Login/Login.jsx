import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPassword } from "../../config/firebase";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currentState === "Sign up") {
      signup(username, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="bg-[url(/background_2.jpg)] bg-no-repeat min-h-[100vh] bg-cover flex flex-col items-center md:justify-evenly md:flex-row md:gap-7 gap-8">
      <img src={assets.logo_big} alt="" className="max-w-[20vm, 200px] " />
      <form
        onSubmit={onSubmitHandler}
        className="bg-blue-100 px-9 py-6 flex flex-col gap-5 rounded-2xl"
      >
        <h2 className="font-bold">{currentState}</h2>
        {currentState === "Sign up" ? (
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="User Name"
            className="px-[10px] py-2 border-solid border-[1px] rounded-[4px] bg-[#f5f5f5] outline-[#077eff]"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
          className="px-[10px] py-2 border-solid border-[1px] rounded-[4px] bg-[#f5f5f5] outline-[#077eff]"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="px-[10px] py-2 border-solid border-[1px] rounded-[4px] bg-[#f5f5f5] outline-[#077eff]"
          required
        />
        <button
          className="p-[10px] bg-[#077eff] text-white text-base border-none rounded-[4px] cursor-pointer hover:bg-[#245b96]"
          type="submit"
        >
          {currentState === "Sign up" ? "Sign Up" : "Login"}
        </button>
        <div className="flex gap-[5px] text-sm text-[#808080]">
          <input type="checkbox" />
          <p>Accept Terms and Conditions & Privacy Policy.</p>
        </div>
        {/* login or signup or forgotpassword section */}
        <div className="flex flex-col gap-1">
          {currentState === "Sign up" ? (
            <p className="text-[13px] text-[#5c5c5c]">
              {" "}
              Already have an account ?{" "}
              <span
                onClick={() => setCurrentState("Login")}
                className="font-medium text-[#077eff] cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-[13px] text-[#5c5c5c]">
              {" "}
              Don't have an account ?{" "}
              <span
                onClick={() => setCurrentState("Sign up")}
                className="font-medium text-[#077eff] cursor-pointer"
              >
                Signup here
              </span>
            </p>
          )}
          {currentState === "Login" ? (
            <p className="text-[13px] text-[#5c5c5c]">
              {" "}
              Forgot Password ?{" "}
              <span
                onClick={() => resetPassword(email)}
                className="font-medium text-[#077eff] cursor-pointer"
              >
                Reset here
              </span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
