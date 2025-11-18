// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // MongoDB connection
import Hazard from "./models/Hazard.js"; // Mongoose model
import { Router } from "express";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// Socket-aware hazard routes
// ----------------------
const socketRouter = Router();

socketRouter.get("/", async (req, res) => {
  try {
    const hazards = await Hazard.find();
    res.json(hazards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

socketRouter.post("/", async (req, res) => {
  try {
    const hazard = new Hazard(req.body);
    const savedHazard = await hazard.save();

    // Emit new hazard to all connected clients
    io.emit("newHazard", savedHazard);

    res.status(201).json(savedHazard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api/hazards", socketRouter);

// ----------------------
// Create HTTP server & setup Socket.IO
// ----------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow frontend access
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});