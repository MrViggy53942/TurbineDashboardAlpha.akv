import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import GaugeChart from "react-gauge-chart";
import Papa from "papaparse";
import jwtDecode from "jwt-decode"; // Install via `npm install jwt-decode`
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

//authentication checking
const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}; // Set authentication status based on token validity
useEffect(() => {
  setAuth(checkAuth());
}, []);

const WindTurbineDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [timeFrame, setTimeFrame] = useState(6);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Create a WebSocket connection to the server
    const socket = new WebSocket("ws://localhost:8080"); // Adjust to your server URL

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        console.log("Received Data:", newData);

        // Update state with the latest data
        setData((prevData) => [...prevData, newData]);
        setSelectedData(newData); // Display the latest data
      } catch (error) {
        console.error("Error parsing received data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % data.length;
        setSelectedData(data[newIndex]);
        return newIndex;
      });
    }, 1000); // Update every 1 seconds

    return () => clearInterval(interval);
  }, [data]);

  const filteredData = data.slice(-timeFrame);

  const Login = ({ setAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
      try {
        const response = await axios.post("http://localhost:5000/login", {
          username,
          password,
          rememberMe,
        });
        localStorage.setItem("token", response.data.token);
        setAuth(true);
      } catch (error) {
        setMessage("Invalid credentials");
      }
    };

    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />{" "}
          Remember Me
        </label>
        <br />
        <br />
        <button onClick={handleLogin}>Login</button>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Wind Turbine Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Wind Speed</h2>
          <GaugeChart
            id="wind-gauge"
            nrOfLevels={10}
            percent={(selectedData?.windSpeed || 0) / 25}
          />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Actual Power</h2>
          <GaugeChart
            id="power-gauge"
            nrOfLevels={10}
            percent={(selectedData?.actualPower || 0) / 1000}
          />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Wind Direction</h2>
          <div className="flex justify-center items-center h-32">
            <div className="w-24 h-24 border border-gray-400 rounded-full flex items-center justify-center relative">
              <div
                className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-red-500 absolute"
                style={{
                  transform: `rotate(${
                    selectedData?.turbineDirection || 0
                  }deg)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 mt-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold">
          Wind Speed vs. Power Over Time
        </h2>
        <LineChart width={600} height={300} data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" />
          <Line type="monotone" dataKey="actualPower" stroke="#82ca9d" />
        </LineChart>
      </div>
      <div className="flex gap-4 mb-4">
        {[6, 12, 36].map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded ${
              timeFrame === option ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setTimeFrame(option)}
          >
            Last {option} Readings
          </button>
        ))}
      </div>
    </div>
  );
};

export default WindTurbineDashboard;
