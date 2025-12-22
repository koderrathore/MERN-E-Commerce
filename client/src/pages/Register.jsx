import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authRegister } from "/store/authSlice";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const {toast} = useToast()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("yo")

    dispatch(authRegister({username,email,password}))
      .then((data) =>{
        if(data){
          toast({
          title:"Registration Successfull"
          })
          setUsername("")
          setPassword("")
          setEmail("")
          navigate("/auth/login")
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col rounded-2xl border-2 border-white border-opacity-25 h-fit p-10 px-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl text-center">
          Create an acoount
        </h1>
        <h1 className="text-xl text-center">
          Already have an account
          <Link
            className="font-bold hover:underline cursor-pointer ml-1"
            to={"/auth/login "}
          >
            Login
          </Link>
        </h1>
      </div>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex-col flex my-4">
            <h1 className="my-2">Ussrname:</h1>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              placeholder="Enter your username"
              className="outline pl-1 rounded-md text-black"
              type="text"
            />
          </div>
          <div className="flex-col flex my-4">
            <h1 className="my-2">Email:</h1>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              className="outline pl-1 rounded-md text-black"
              type="email"
            />
          </div>
          <div className="flex-col flex my-4 text-black">
            <h1 className="my-2 text-white">Password:</h1>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
              className="outline pl-1 rounded-md"
              type="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black rounded-md px-2 py-1 text-white my-4"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
