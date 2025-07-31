const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

const router = express.Router();

// POST /api/bookings (create new booking)
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, serviceName, date, time, notes, totalPrice } = req.body;

    const booking = new Booking({
      userId: req.user.id,
      serviceId,
      serviceName,
      date,
      time,
      notes,
      totalPrice,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings (get user's bookings)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 