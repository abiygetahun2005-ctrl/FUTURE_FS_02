const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all leads for the user
router.get('/', auth, async (req, res) => {
  try {
    const userLeads = global.leads.filter(lead => lead.user === req.user._id);
    res.json(userLeads);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new lead
router.post('/', [
  auth,
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const lead = {
      id: global.nextLeadId++,
      ...req.body,
      user: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    global.leads.push(lead);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a lead
router.put('/:id', [
  auth,
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('status').optional().isIn(['new', 'contacted', 'converted', 'lost']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const leadIndex = global.leads.findIndex(lead => lead.id === parseInt(req.params.id) && lead.user === req.user._id);
    if (leadIndex === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    global.leads[leadIndex] = {
      ...global.leads[leadIndex],
      ...req.body,
      updatedAt: new Date(),
    };
    res.json(global.leads[leadIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const leadIndex = global.leads.findIndex(lead => lead.id === parseInt(req.params.id) && lead.user === req.user._id);
    if (leadIndex === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    global.leads.splice(leadIndex, 1);
    // Also delete associated notes
    global.leadNotes = global.leadNotes.filter(note => note.lead !== parseInt(req.params.id));
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get notes for a lead
router.get('/:id/notes', auth, async (req, res) => {
  try {
    const lead = global.leads.find(lead => lead.id === parseInt(req.params.id) && lead.user === req.user._id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const notes = global.leadNotes.filter(note => note.lead === parseInt(req.params.id));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a note to a lead
router.post('/:id/notes', [
  auth,
  body('note').notEmpty().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const lead = global.leads.find(lead => lead.id === parseInt(req.params.id) && lead.user === req.user._id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const note = {
      id: global.nextNoteId++,
      ...req.body,
      lead: parseInt(req.params.id),
      user: req.user._id,
      createdAt: new Date(),
    };
    global.leadNotes.push(note);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a note
router.delete('/:id/notes/:noteId', auth, async (req, res) => {
  try {
    const noteIndex = global.leadNotes.findIndex(note =>
      note.id === parseInt(req.params.noteId) &&
      note.lead === parseInt(req.params.id) &&
      note.user === req.user._id
    );
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    global.leadNotes.splice(noteIndex, 1);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;