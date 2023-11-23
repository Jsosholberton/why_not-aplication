"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Alerta from "../components/Alerta";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const router = useRouter();
  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `http://johnatanortiz.tech:4000/api/users/login`,
        { email, password }
      );

      localStorage.setItem("token", data.token);
      setAuth(data);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <div className="page-container m-20 w-80 mx-auto">
      <div className="corner-text mt-10 fixed top-0 left-0 p-5">
        <h2 className="text-green-600 font-black text-4xl capitalize">
          WhyNot Tenis Tournaments
        </h2>
      </div>

      {msg && <Alerta alerta={alerta} />}
      <div className="shadow-card">
      <form
        className="delay-100 mx-auto mt-40
        hover:opacity-100
        my-10 bg-white shadow rounded-lg p-10 
        rounded-3xl p-6 text-black"
        onSubmit={handleSubmit}
      >
        <div className="m-auto mx-auto pt-10">
          <label
            className="uppercase italic block text-xl font-bold"
            htmlFor="email"
          ></label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full mt-3 p-3 border italic rounded-xl shadow-lg shadow-gray-400 bg bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="m-auto mx-auto pt-10">
          <label
            className="uppercase font-thin italic text-black"
            htmlFor="password"
          ></label>
          <input
            id="PASSWORD"
            type="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border italic rounded-xl shadow-lg shadow-gray-400 bg bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className=" 
          transition-shadow opacity-70 hover:opacity-100 rounded-md
          italic w-full py-2 mt-10 mx-auto
          uppercase font-medium rounded-3xl
          bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-200 via-green-400 to-green-500
          shadow-lg shadow-gray-500"
        >
          Sign in
        </button>
      </form>
      </div>
      <nav className="lg:flex lg:justify-between text-center">
        <a
          href="/olvidepassword"
          className="mx-auto delay-75 opacity-90 hover:skew-x-3 hover:opacity-100 text-center my-5 text-[#ffffff] shadow-lg p-2 hover:shadow-white shadow-black-950 rounded-full uppercase text-sm"
        >
          Lost your password?
        </a>
        <a
          href="/register"
          className="mx-auto delay-75 opacity-90 hover:skew-x-3 hover:opacity-100 text-center my-5 text-[#ffffff] shadow-lg p-2 hover:shadow-white shadow-black-950 rounded-full uppercase text-sm"
        >
          Sign up
        </a>
      </nav>
    </div>
  );
};

export default Login;
