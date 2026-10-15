import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAssignedTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get manager email from session storage
  const managerEmail = sessionStorage.getItem("email");

  useEffect(() => {
    // Fetch tasks assigned to the manager
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/events/manager/${managerEmail}`
        );
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks.");
        setLoading(false);
      }
    };
    fetchTasks();
  }, [managerEmail]);

  // Mark task as completed
  const completeTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:8080/events/updateTask/${taskId}`);
      toast.success(`Task with ID ${taskId} marked as Completed.`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, task: "Completed" } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to complete the task. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">Assigned Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Event Type</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Description</th>
              <th>Address</th>
              <th>Event Date</th>
              <th>Task</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.eventType.eTypes}</td>
                <td>{task.name}</td>
                <td>{task.phone}</td>
                <td>{task.discription}</td>
                <td>{task.address}</td>
                <td>{task.dateOfEvent}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: task.status === "Processing" ? "red" : "green",
                      color: "white",
                    }}
                  >
                    {task.task}
                  </span>
                </td>
                
                <td>
                  {task.task !== "Completed" ? (
                    <Button
                      variant="success"
                      onClick={() => completeTask(task.id)}
                    >
                      Mark as Completed
                    </Button>
                  ) : (
                    <span className="text-success">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  );
};

export default ViewAssignedTask;
