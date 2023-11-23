"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const navigate = useRouter();

  useEffect(() => {
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
    getTournaments();
  }, []);

  const handleRegister = async (id) => {
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
      setAlerta({
        msg: "You are correctly logged in the tournament",
        error: false,
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.message,
        error: true,
      });
    }
  };

  const handleLeave = async (id) => {
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
        msg: "Your has leave the tournament correctly",
        error: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { msg } = alerta;

  return (
    <>
      {loading ? (
        <h1>Cargando...</h1>
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
                      {tournament.players.some(
                        (player) => player._id === auth._id
                      ) ? (
                        <button
                          className="mx-auto bg-red-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
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
