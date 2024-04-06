import React, { useState } from "react";
import './App.css'
import axios from "axios";

const App = () => {
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const startTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/start_task");
      setTaskId(response.data.status_uri.split("/")[2]); // Extract taskId from status_uri
      setStatus("Running");
      // Check the status immediately after starting the task
      await checkStatus(response.data.status_uri.split("/")[2]);
    } catch (error) {
      console.error("Error starting task:", error);
    }
    setLoading(false);
  };

  const checkStatus = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/check_status/${taskId}`
      );
      setStatus(response.data.status);
      if (response.data.status === "Completed") {
        setLoading(false)
        return; // Stop checking status when completed
      }
      // Schedule next status check after 2 seconds
      setTimeout(() => checkStatus(taskId), 2000);
    } catch (error) {
      console.error("Error checking task status:", error);
    }
  };

  const normalTask = async () => {
    try {
      const response = await axios.get("http://localhost:8000/delay/10");
      console.log("response ", response);
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  return (
    <div>
      <button onClick={startTask} disabled={loading}>
        Start Task
      </button>
      <button onClick={normalTask}>Normal Task</button>
      <div>
        Status:{" "}
        {status === "Running" ? (
          <>
            {status}
            <span className="loader"></span>
          </>
        ) : (
          status
        )}
      </div>
    </div>
  );
};

export default App;
