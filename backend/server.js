const express = require("express");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require('uuid')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Dictionary to store tasks and their statuses
const tasks = {};

// Function to simulate a long-running task
const simulateLongRunningTask = (taskId) => {
    setTimeout(() => {
        tasks[taskId] = "Completed";
    }, 120000); // Simulating a 10-second long-running process
};

// Endpoint to initiate the task
app.post('/start_task', (req, res) => {
    const taskId = uuidv4(); // Generate a unique task ID
    tasks[taskId] = "Running";

    // Start the task
    simulateLongRunningTask(taskId);

    res.status(202).json({ status_uri: `/check_status/${taskId}` });
});

// Endpoint to check the status of the task
app.get('/check_status/:taskId', (req, res) => {
    const { taskId } = req.params;
    
    if (!(taskId in tasks)) {
        return res.status(404).json({ error: "Task not found" });
    }

    const status = tasks[taskId];
    if (status === "Completed") {
        return res.status(200).json({ status });
    } else {
        return setTimeout(() => res.status(202).json({ status }),5000) // Task still running, return 202 Accepted
    }
});

// Endpoint to handle requests
app.get('/delay/:seconds', (req, res) => {
    const seconds = parseInt(req.params.seconds);
    
    // Check if seconds is a valid number
    if (isNaN(seconds) || seconds <= 0) {
        return res.status(400).json({ error: 'Invalid time duration' });
    }

    // Set a timeout to simulate the delay
    setTimeout(() => {
        res.json({ message: `Response delayed by ${seconds} seconds` });
    }, seconds * 1000); // converting seconds to milliseconds
});

app.listen(8000, () => console.log("server is running..."));
