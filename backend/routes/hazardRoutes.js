const express = require('express');
const router = express.Router();
const Hazard = require('../models/Hazard');

// Create a new hazard report
router.post('/', async (req, res) => {
  try {
    const hazard = new Hazard(req.body);
    await hazard.save();
    res.status(201).json(hazard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all hazard reports
router.get('/', async (req, res) => {
  try {
    const hazards = await Hazard.find().sort({ createdAt: -1 });
    res.json(hazards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;