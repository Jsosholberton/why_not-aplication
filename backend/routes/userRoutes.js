import express from "express";
import {
  register,
  authenticate,
  confirmAccount,
  lostPwd,
  checkToken,
  newPwd,
  profile,
  allUsers,
} from "../controllers/UserController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", register);
router.post("/login", authenticate);
router.get("/confirm/:token", confirmAccount);
router.post("/lost-password", lostPwd);
router.get("/lost-password/:token", checkToken);
router.post("/lost-password/:token", newPwd);
router.get("/profile", checkAuth, profile);
router.get("/all", checkAuth, allUsers);

export default router;
