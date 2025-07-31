const express = require('express');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({}, { bookings: 0 }); // Don't include bookings in list
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/services/:id/book - Book a service
router.post('/:id/book', auth, async (req, res) => {
  try {
    const { date, time, notes } = req.body;
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Add booking to the service
    service.bookings.push({
      userId: req.user.id,
      date,
      time,
      notes,
      status: 'pending'
    });

    await service.save();
    res.status(201).json({ message: 'Service booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/services/bookings - Get user's bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const services = await Service.find({
      'bookings.userId': req.user.id
    });

    const userBookings = services.map(service => {
      const userBookings = service.bookings.filter(
        booking => booking.userId.toString() === req.user.id
      );
      return userBookings.map(booking => ({
        ...booking.toObject(),
        serviceName: service.name,
        servicePrice: service.price,
        serviceCategory: service.category
      }));
    }).flat();

    res.json(userBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;