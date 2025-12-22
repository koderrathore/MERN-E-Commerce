import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { authLogin } from "/store/authSlice";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authLogin({ email, password }))
      .then((data) => {
        if (data) {
          toast({
            title: data.payload.data.message,
          });
          setEmail("")
          setPassword("")
        }
      })
      .catch((err) => {
        toast({
          title:"Something went wrong"
        });
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col rounded-2xl border-2 border-white border-opacity-25 h-fit p-10 px-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl text-center">
          Sign In to your acoount
        </h1>
        <h1 className="text-[2.2vh] lg:text-xl text-center">
          Dont have an account
          <Link
            className="font-bold hover:underline cursor-pointer ml-1"
            to={"/auth/register "}
          >
            Register
          </Link>
        </h1>
      </div>
      <div className="">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex-col flex my-4">
            <h1 className="my-2 lg:my-4">Email:</h1>
            <input
              name="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="outline pl-1 rounded-md text-black"
              type="text"
            />
          </div>
          <div className="flex-col flex my-4 ">
            <h1 className="my-2 lg:my-4">Password:</h1>
            <input
              name="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="outline pl-1 rounded-md text-black"
              type="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black rounded-md px-2 py-1 text-white my-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
