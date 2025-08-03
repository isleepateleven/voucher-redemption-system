const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const historyRoutes = require('./routes/historyRoutes');
const redeemRoutes = require("./routes/redeemRoutes");
const chatRoutes = require("./routes/chatRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Load env variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to DB
connectDB();

// Passport config
require('./utils/passport')(passport); 

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Passport middleware
app.use(passport.initialize());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);  
app.use('/api/history', historyRoutes);
app.use("/api/redeem", redeemRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);

// Optional: test route
app.get('/api/jwt-test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'JWT auth successful', user: req.user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});