"use client";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Alerta from '../components/Alerta';
import axios from 'axios';

const Olvidepassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || email.length < 6) {
      setAlerta({
        msg: "El correo es requerido",
        error: true
      });
      return;
    }

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/lost-password`, { email })
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  const { msg } = alerta

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container">
      <div className="corner-text">
      <h2 className="text-green-600 font-black text-4xl capitalize">Control de Almuerzos</h2>
      </div>

      {msg && <Alerta alerta={alerta} />}

      <form
        className="my-10 bg-white shadow rounded-lg shadow-lg shadow-gray-500 p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 italic block text-xl font-bold"
            htmlFor="email"
          >
            Correo
          </label>
          <input
            id="email"
            type="email"
            placeholder="Correo electronico"
            className="w-full mt-3 p-3 border italic rounded-xl shadow-lg shadow-gray-400 bg bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          value="Recover Access"
          className="
          transition-shadow opacity-70 hover:opacity-100 rounded-md
          italic w-full py-2 mt-10
          uppercase font-medium rounded-3xl
          bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-200 via-green-400 to-green-500
          shadow-lg shadow-gray-500
          "
        >
          Recuperar acceso
        </button>
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm cursor-pointer"
          to="/"
        >
          No necesitas recuperar tu contraseña?, inicia sesión
        </Link>

      </nav>
    </div>
  );
}

export default Olvidepassword;
