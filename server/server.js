// Import express and cors
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware to pass an Object to JSON Object (in a request)
app.use(express.json());
// Middleware to allow API access from a different domain (In this case, our 'client': localhost:8080)
app.use(cors());

// Application will use "/api/users" route as corresponding
// Example: "/api/users/abc123", 
const usersRouter = require('./routes/api/users');
app.use('/api/users', usersRouter);

// Start running server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server running on port ${port}`);