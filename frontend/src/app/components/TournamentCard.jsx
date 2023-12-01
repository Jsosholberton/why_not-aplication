"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { fadeIn } from "../utils/motion";
import useAuth from "../hooks/useAuth";
import Alerta from "../components/Alerta";
import Image from "next/image";

function TournamentCard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const [alerta, setAlerta] = useState({});
  const [loadingBtn, setLoadingBtn] = useState({});

  useEffect(() => {
    getTournaments();
  }, []);

  const getTournaments = async () => {
    try {
      const response = await axios.get(
        `https://johnatanortiz.tech:4000/api/tournaments`
      );
      setTournaments(response.data);
      setLoading(false);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      setLoading(false);
    }
  };

  const handleRegister = async (id) => {
    setLoadingBtn((prevLoadingBtns) => ({
      ...prevLoadingBtns,
      [id]: true,
    }));

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAlerta({
          msg: "You must be logged in to register",
          error: true,
        });
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `https://johnatanortiz.tech:4000/api/tournaments/join/${id}`,
        { user: auth._id },
        config
      );
      await getTournaments();
      setAlerta({
        msg: "You are correctly logged in the tournament",
        error: false,
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.message,
        error: true,
      });
    } finally {
      setLoadingBtn((prevLoadingBtns) => ({
        ...prevLoadingBtns,
        [id]: false,
      }));
    }
  };

  const handleLeave = async (id) => {
    setLoadingBtn((prevLoadingBtns) => ({
      ...prevLoadingBtns,
      [id]: true,
    }));

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `https://johnatanortiz.tech:4000/api/tournaments/leave/${id}`,
        { user: auth._id },
        config
      );
      setAlerta({
        msg: "You have left the tournament correctly",
        error: false,
      });
      await getTournaments();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn((prevLoadingBtns) => ({
        ...prevLoadingBtns,
        [id]: false,
      }));
    }
  };

  const { msg } = alerta;

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-500 border-solid"></div>
        </div>
      ) : (
        <div>
          {msg && <Alerta alerta={alerta} />}
          <div className="mx-10 text-center mt-20 flex flex-wrap gap-10">
            {tournaments.map((tournament, index) => (
              <Tilt
                key={`${tournament._id}-${index}`}
                className="xs:w-[250px]"
                options={{ max: 45, scale: 1, speed: 450 }}
              >
                <motion.div
                  key={tournament._id}
                  variants={fadeIn("right", "spring", index * 0.5, 0.75)}
                  className="p-[1px] rounded-[20px] shadow-card relative"
                >
                  <div className="bg-white p-4 rounded-[20px] shadow-md mx-auto">
                    <div
                      className="p-0 green-pink-gradient absolute inset-0 rounded-[20px] mx-auto shadow-card"
                      style={{
                        backgroundClip: "padding-box",
                        zIndex: -1,
                      }}
                    />
                    <div className="w-full h-32 sm:h-48 relative">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={"/images/1.jpg"}
                        alt="avatar"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-black">
                      {tournament.name}
                    </h2>
                    <p className="text-gray-600">
                      Date: {tournament.date} - {tournament.time}
                    </p>
                    <p className="text-gray-600">
                      Location: {tournament.location}
                    </p>
                    <p className="text-gray-700 mt-2">
                      {tournament.description}
                    </p>
                    <div className="text-center">
                      {loadingBtn[tournament._id] ? (
                        <button className="mx-auto bg-gray-500 text-white font-bold py-2 px-4 rounded mt-2 relative" disabled>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-25 mr-2"></span>
                          <span className="animate-pulse">Loading...</span>
                        </button>
                      ) : tournament.players.some(
                          (player) => player._id === auth._id
                        ) ? (
                        <button
                          className="mx-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
                          onClick={() => handleLeave(tournament._id)}
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          className="mx-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
                          onClick={() => handleRegister(tournament._id)}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default TournamentCard;
