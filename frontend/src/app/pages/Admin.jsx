import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Alerta from "../components/Alerta";
const { useRouter } = require("next/navigation");
Modal.setAppElement("body");

function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [alerta, setAlerta] = useState({});

  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenUser, setIsModalOpenUser] = useState({
    open: false,
    user: {
      name: "",
      email: "",
      role: "",
    },
  });

  const token = localStorage.getItem("token");

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeDrop, setActiveDrop] = useState("");

  const handleToggleDropdown = (id) => {
    setActiveDrop(id);
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    setIsModalOpenUser({
      open: false,
      user: {
        name: "",
        email: "",
        role: "",
      },
    });
    const getUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await axios.get(
          `https://johnatanortiz.tech:4000/api/users/all`,
          config
        );
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
    const getTournaments = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await axios.get(
          `https://johnatanortiz.tech:4000/api/tournaments`,
          config
        );
        setTournaments(data);
      } catch (error) {
        console.log(error);
      }
    };
    getTournaments();
  }, []);
  const openModal = (tournament) => {
    setIsModalOpen(true);
    setDropdownOpen(false);
    if (tournament) {
      setId(tournament._id);
      setName(tournament.name);
      setDate(tournament.date);
      setDescription(tournament.description);
      setTime(tournament.time);
      setLocation(tournament.location);
    }
  };

  const closeModal = () => {
    setIsModalOpen(prevIsModalOpen => !prevIsModalOpen);
    setId(null);
    setName("");
    setDate("");
    setDescription("");
    setTime("");
    setLocation("");
  };

  const openModalUser = (user) => {
    setIsModalOpenUser({
      open: true,
      user: user,
    });
    setDropdownOpen(false);
  };

  const closeModalUser = () => {
    setIsModalOpenUser({
      open: false,
      user: {
        name: "",
        email: "",
        role: "",
      },
    });
  };

  const handleFormSubmit = async (e, id) => {
    e.preventDefault();

    if ([name, description, date, time, location].includes("")) {
      setAlerta({
        msg: "All fields are required",
        error: true,
      });
      return;
    }

    if (id) {
      try {
        const tournamentFormData = { name, description, date, time, location };
        const response = await axios.patch(
          `https://johnatanortiz.tech:4000/api/tournaments/${id}`,
          tournamentFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAlerta({
          msg: "Tournament updated successfully",
          error: false,
        });
        setId(null);
        setName("");
        setDate("");
        setDescription("");
        setTime("");
        setLocation("");
        setIsModalOpen(false);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
        return;
      }
      return;
    }

    try {
      const tournamentFormData = { name, description, date, time, location };
      const response = await axios.post(
        `https://johnatanortiz.tech:4000/api/tournaments`,
        tournamentFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlerta({
        msg: "Tournament created successfully",
        error: false,
      });
      setId(null);
      setName("");
      setDate("");
      setDescription("");
      setTime("");
      setLocation("");
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      return;
    }
  };

  const handleUpdateUser = () => {
    const { user } = isModalOpenUser;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const updateUser = async () => {
        const response = await axios.patch(
          `https://johnatanortiz.tech:4000/api/users/${user._id}`,
          config,
          user
        );
      };
      updateUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = axios.delete(
        `https://johnatanortiz.tech:4000/api/tournaments/${id}`,
        config
      );
      router.push("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  setTimeout(() => {
    setAlerta({});
  }, 10000);

  const { msg } = alerta;

  return (
    <>
      <div className="max-h-screen overflow-x-auto p-auto">
        <h1>Users</h1>
        <table className="min-w-full bg-white divide-y divide-gray-300 text-black mt-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Options</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.role}</td>
                <td className="py-2 px-4 border z-50">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => handleToggleDropdown(user._id)}
                      className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:bg-gray-100"
                    >
                      Options
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isDropdownOpen && activeDrop === user._id
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {isDropdownOpen && activeDrop === user._id && (
                      <div className="absolute z-50 w-full mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg overflow-visible">
                        <div className="py-1">
                          <button
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => openModalUser(user)}
                          >
                            Update
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-h-screen overflow-x-auto p-auto mt-10">
        <div className="row flex items-center justify-between">
          <h1>Tournaments</h1>
          <button
            className="text-white text-sm bg-black-950 p-5
                      rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
            onClick={openModal}
          >
            Create tournament
          </button>
        </div>

        <table className="min-w-full bg-white divide-y divide-gray-300 text-black mt-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Time</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Players</th>
              <th className="py-2 px-4 border">Options</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament._id}>
                <td className="py-2 px-4 border">{tournament.name}</td>
                <td className="py-2 px-4 border">{tournament.date}</td>
                <td className="py-2 px-4 border">{tournament.time}</td>
                <td className="py-2 px-4 border">{tournament.location}</td>
                <td className="py-2 px-4 border">{tournament.description}</td>
                <td className="py-2 px-4 border">
                  {tournament.players.map((player) => (
                    <div className="border-b" key={player._id}>
                      {player.name}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border z-50">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => handleToggleDropdown(tournament._id)}
                      className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:bg-gray-100"
                    >
                      Options
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isDropdownOpen && activeDrop === tournament._id
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {isDropdownOpen && activeDrop === tournament._id && (
                      <div className="absolute z-50 w-full mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg overflow-visible">
                        <div className="py-1">
                          <button
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => openModal(tournament)}
                          >
                            Update
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            onClick={() => handleDelete(tournament._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Tournament Modal"
        className="backdrop-blur backdrop-filter backdrop-saturate-150 fixed top-0 left-0 right-0 bottom-0"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="p-14">
          <h2 className="text-white capitalize text-center m-5 text-xl">
            Create Tournament
          </h2>
          {msg && <Alerta alerta={alerta} />}
          <form
            className="bg-white py-10 shadow-lg shadow-gray-500 px-5 md:w-1/2 rounded-lg mx-auto my-10"
            onSubmit={(e) => handleFormSubmit(e, id)}
          >
            <label
              className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1"
              htmlFor="name"
            >
              Name:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label
              className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1"
              htmlFor="date"
            >
              Date:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                type="text"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1">
              Time:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                type="text"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
            <label className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1">
              Location:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <label className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1">
              Description:
              <textarea
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                type="text"
                name="location"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <div className="text-center">
              {id ? (
                <button
                  className="text-white text-sm bg-black p-5 m-2
                          rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
                  type="submit"
                >
                  Actualizar
                </button>
              ) : (
                <button
                  className="text-white text-sm bg-black p-5 m-2
                            rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
                  type="submit"
                >
                  Create
                </button>
              )}

              <button
                className="text-white text-sm bg-red-500 p-5 m-2
                      rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-black active:bg-cyan-500 transition-colors"
                type="button"
                onClick={() => closeModal()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpenUser.open}
        onRequestClose={closeModalUser}
        contentLabel="Create Tournament Modal"
        className="backdrop-blur backdrop-filter backdrop-saturate-150 fixed top-0 left-0 right-0 bottom-0"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="p-14">
          <h2 className="text-white capitalize text-center m-5 text-xl">
            Update User
          </h2>
          {msg && <Alerta alerta={alerta} />}
          <form
            className="bg-white py-10 shadow-lg shadow-gray-500 px-5 md:w-1/2 rounded-lg mx-auto my-10"
            onSubmit={handleUpdateUser}
          >
            <label
              className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1"
              htmlFor="name"
            >
              Name:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                id="name"
                type="text"
                value={isModalOpenUser.user.name}
                onChange={(e) =>
                  setIsModalOpenUser((prev) => ({
                    ...prev,
                    user: { ...prev.user, name: e.target.value },
                  }))
                }
              />
            </label>
            <label
              className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1"
              htmlFor="date"
            >
              Email:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                type="text"
                name="date"
                value={isModalOpenUser.user.email}
                onChange={(e) =>
                  setIsModalOpenUser((prev) => ({
                    ...prev,
                    user: { ...prev.user, email: e.target.value },
                  }))
                }
              />
            </label>
            <label className="text-gray-700 italic uppercase font-bold text-sm shadow rounded-lg p-1">
              Role:
              <input
                className="text-white border w-full p-2 italic placeholder-gray-400 rounded-md rounded-lg p-1 shadow-xl"
                type="text"
                name="time"
                value={isModalOpenUser.user.role}
                onChange={(e) =>
                  setIsModalOpenUser((prev) => ({
                    ...prev,
                    user: { ...prev.user, role: e.target.value },
                  }))
                }
              />
            </label>
            <div className="text-center">
              <button
                className="text-white text-sm bg-black p-5 m-2
                    rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
                type="submit"
              >
                Update
              </button>
              <button
                className="text-white text-sm bg-red-500 p-5 m-2
                      rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-black active:bg-cyan-500 transition-colors"
                type="button"
                onClick={closeModalUser}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Admin;
