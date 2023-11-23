import express from "express";
import dotenv from "dotenv";
import conectDB from "./config/db.js";
import cors from "cors";
import https from "https";
import fs from "fs";

import userRoutes from "./routes/userRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

conectDB();

app.use("/api/users", userRoutes);
app.use("/api/tournaments", tournamentRoutes);

const privateKeyPath = "/etc/letsencrypt/live/johnatanortiz.tech/privkey.pem";
const certificatePath = "/etc/letsencrypt/live/johnatanortiz.tech/fullchain.pem";

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT, () => {
  console.log(`Server running on https://localhost:${process.env.PORT}`);
});
