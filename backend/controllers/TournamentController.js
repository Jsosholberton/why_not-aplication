import Tournament from "../models/Tournament.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const createTournament = async (req, res) => {
  const { name, date, time, location, description, image } = req.body;

  const tournament = new Tournament({
    name,
    date,
    time,
    location,
    description,
    image: image || "",
  });

  try {
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate({
      path: "players",
      select: "name",
    });
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTournament = async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id);
    res.status(200).json(tournament);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateTournament = async (req, res) => {
  const { id } = req.params;
  const { name, date, time, location, description, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No tournament with id: ${id}`);

  const updatedTournament = {
    name,
    date,
    time,
    location,
    description,
    image: image || "",
    _id: id,
  };

  await Tournament.findByIdAndUpdate(id, updatedTournament, { new: true });

  res.json(updatedTournament);
};

const deleteTournament = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No tournament with id: ${id}`);

  await Tournament.findByIdAndDelete(id);

  res.json({ message: "Tournament deleted successfully." });
};

const joinTournament = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "Sign in first" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No tournament with id: ${id}`);

  const tournament = await Tournament.findById(id);

  const userExist = tournament.players.find(
    (player) => player.toString() === user
  );

  if (userExist) {
    return res.status(400).json({ message: "User already joined" });
  }

  tournament.players.push(user);

  await Tournament.findByIdAndUpdate(id, tournament, { new: true });

  res.json(tournament);
};

const leaveTournament = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No tournament with id: ${id}`);

  const tournament = await Tournament.findById(id);

  const userExist = tournament.players.find(
    (player) => player.toString() === user
  );

  if (!userExist) {
    return res.status(400).json({ message: "User not joined" });
  }

  const index = tournament.players.indexOf(user);

  tournament.players.splice(index, 1);

  await Tournament.findByIdAndUpdate(id, tournament, { new: true });

  res.json(tournament);
};

export {
  createTournament,
  getTournaments,
  getTournament,
  updateTournament,
  deleteTournament,
  joinTournament,
  leaveTournament,
};
