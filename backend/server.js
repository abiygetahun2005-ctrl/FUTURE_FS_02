const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for demo purposes
let users = [];
let leads = [];
let leadNotes = [];
let nextUserId = 1;
let nextLeadId = 1;
let nextNoteId = 1;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

// Export storage for routes to use
global.users = users;
global.leads = leads;
global.leadNotes = leadNotes;
global.nextUserId = nextUserId;
global.nextLeadId = nextLeadId;
global.nextNoteId = nextNoteId;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (In-memory mode)`);
});