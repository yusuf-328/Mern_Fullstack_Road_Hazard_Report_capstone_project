// backend/models/Hazard.js
import mongoose from "mongoose";

const HazardSchema = new mongoose.Schema({
  type: { type: String, required: true },       // e.g., "Pothole", "Flood"
  description: { type: String },                // optional details
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  severity: { type: String, default: "medium" }, // low, medium, high
  createdAt: { type: Date, default: Date.now }
});

const Hazard = mongoose.model("Hazard", HazardSchema);
export default Hazard; // ✅ ES module default export