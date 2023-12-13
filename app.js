// Import required modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Set up middleware
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up MySQL connection for Google Cloud SQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'sandadi',
  password: 'Student$ub1',
  database: 'sandadi',  // Replace with your actual database name
  port: '3306', // Use the appropriate port number
  socketPath: '/cloudsql/dynamic-density-407719:us-central1:sandadi',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate the username and password (implement your own validation logic)

  // Simulate user authentication (replace with actual authentication logic)
  if (username === 'your_username' && password === 'your_password') {
    req.session.username = username;
    res.redirect('/book-room');
  } else {
    res.send('Invalid credentials. Please try again.');
  }
});

// Registration route
app.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Implement registration validation logic
  if (password !== confirmPassword) {
    res.send('Password and Confirm Password do not match. Please try again.');
    return;
  }

  // Insert user data into MySQL
  const user = { name, email, password, user_type: 'user' }; // Setting user_type as 'user' by default
  db.query('INSERT INTO user_form SET ?', user, (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.send('Registration failed. Please try again.');
      return;
    }
    res.send('Registration successful! You can now log in.');
  });
});

// Book room routes
app.get('/book-room', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    res.redirect('/');
    return;
  }

  res.sendFile(__dirname + '/views/book-room.html');
});

app.post('/book-room', (req, res) => {
  const { room } = req.body;

  // Implement room booking logic (store data in Google Cloud or MySQL)

  res.send(`Room ${room} booked successfully!`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
