import express from "express";
import dotenv from "dotenv";
import conectDB from "./config/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

conectDB();

app.use("/api/users", userRoutes);
app.use("/api/tournaments", tournamentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on: ${process.env.PORT}`);
});
