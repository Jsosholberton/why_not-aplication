import express from "express";
import {
  createTournament,
  getTournaments,
  getTournament,
  updateTournament,
  deleteTournament,
  joinTournament,
  leaveTournament,
} from "../controllers/TournamentController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournament);
router.post("/", checkAuth, createTournament);
router.patch("/:id", checkAuth, updateTournament);
router.delete("/:id", checkAuth, deleteTournament);
router.patch("/join/:id", checkAuth, joinTournament);
router.patch("/leave/:id", checkAuth, leaveTournament);

export default router;
