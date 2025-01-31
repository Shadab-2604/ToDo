const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enhanced MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully');
    // Safely log URI without credentials
    const sanitizedUri = process.env.MONGODB_URI.replace(
        /\/\/(.*):(.*)@/,
        '//***:***@'
    );
    console.log('MongoDB URI:', sanitizedUri);
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Define Todo Schema
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create todo with enhanced error handling
app.post('/api/todos', async (req, res) => {
    try {
        console.log('Received todo data:', req.body);
        const todo = new Todo({
            text: req.body.text,
            completed: false
        });
        const savedTodo = await todo.save();
        console.log('Saved todo:', savedTodo);
        res.json(savedTodo);
    } catch (err) {
        console.error('Error saving todo:', err);
        res.status(400).json({ message: err.message });
    }
});

// Get all todos with error handling
app.get('/api/todos', async (req, res) => {
    try {
        console.log('Fetching todos');
        const todos = await Todo.find();
        console.log('Found todos:', todos);
        res.json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ message: err.message });
    }
});

// Update todo with error handling
app.put('/api/todos/:id', async (req, res) => {
    try {
        console.log('Update request for todo:', req.params.id);
        console.log('Update data:', req.body);
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            throw new Error('Todo not found');
        }
        if (req.body.text !== undefined) {
            todo.text = req.body.text;
        }
        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed;
        }
        const updatedTodo = await todo.save();
        console.log('Updated todo:', updatedTodo);
        res.json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete todo with error handling
app.delete('/api/todos/:id', async (req, res) => {
    try {
        console.log('Deleting todo:', req.params.id);
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (!result) {
            throw new Error('Todo not found');
        }
        console.log('Deleted todo:', result);
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ message: err.message });
    }
});

// Serve static files for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});