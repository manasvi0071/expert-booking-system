const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;
    
    // Validation
    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    
    // Check if slot is already booked (prevent double booking)
    const existingBooking = await Booking.findOne({ expertId, date, timeSlot });
    if (existingBooking) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }
    
    // Create booking
    const booking = new Booking({
      expertId,
      name,
      email,
      phone,
      date,
      timeSlot,
      notes
    });
    
    await booking.save();
    
    // Emit real-time event
    const io = req.app.get('io');
    io.emit('slotBooked', { expertId, date, timeSlot });
    
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get bookings by email
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const bookings = await Booking.find({ email }).populate('expertId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

exports.getBookingsByExpert = async (req, res) => {
  try {
    const bookings = await Booking.find({ expertId: req.params.expertId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};