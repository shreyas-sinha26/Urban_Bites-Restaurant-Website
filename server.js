const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const Order = require('./models/order'); 
const Reservation = require('./models/reservation'); 
const session = require('express-session');
const flash = require('connect-flash');
const wrapAsync = require('./public/util/WrapAsync');

const app = express();

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Restaurant";
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Setup view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Setup session and passport configuration
const sessionOptions = {
  secret: "BMSCE", 
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session(sessionOptions));  // **session middleware comes first**
app.use(passport.initialize());    // Initialize Passport
app.use(passport.session());       // Use passport.session() after initializing passport
app.use(flash());                  // Use flash (optional)

// Static files and URL encoding
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport strategy
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Routes for handling pages
app.get('/', (req, res) => {
  res.render("../views/home.ejs");
});

app.get('/login', (req, res) => {
  res.render("../views/login.ejs");
});

app.get('/signup', (req, res) => {
  res.render("../views/signup.ejs");
});

app.get('/index', (req, res) => {
  res.render("../views/index.ejs");
});

app.get('/menu', (req, res) => {
  res.render("../views/menu.ejs");
});

app.get('/reservation', async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.render("reservation.ejs", { reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Internal Server Error");
  }
});



// Route for delivery page with orders
app.get('/delivery', wrapAsync(async (req, res) => {
  const orders = await Order.find(); // Fetch all orders from DB
  res.render("../views/delivery.ejs", { orders });
}));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/index', // Redirect on successful login
  failureRedirect: '/login', // Redirect back to login on failure
  failureFlash: true,        // Enable flash messages for errors
  successFlash: 'Welcome back!', // Optional success message
}));

// Add this in server.js near your other routes

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Create a new user instance (excluding the password)
        const user = new User({ username, email });
        
        // Use passport-local-mongoose's register method to hash and store the password
        const registeredUser = await User.register(user, password);
        
        // Automatically log the user in after successful sign up
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Urban Bites!');
            res.redirect('/'); // Redirect to the home page or menu
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup'); // Redirect back to signup if there's an error
    }
});

// Handling order submission
app.post('/submit-order', async (req, res) => {
  const { name, phone, address, items, totalPrice } = req.body;

  if (!name || !phone || !address || !Array.isArray(items) || items.length === 0 || !totalPrice) {
    console.error("Invalid input data:", req.body);
    return res.status(400).json({ message: "Invalid input. All fields are required." });
  }

  try {
    const newOrder = new Order({ name, phone, address, items, totalPrice });
    await newOrder.save();
    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API Routes for Reservations
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;

    // Validation
    if (!name || !phone || !date || !time || !guests) {
      console.error('Validation failed. Missing fields:', req.body);
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("Creating reservation:", req.body);

    // Create a new reservation
    const reservation = new Reservation({ name, phone, date, time, guests });
    await reservation.save();
    res.redirect('/reservation');

    // console.log("Reservation saved successfully:", reservation);
    // res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
