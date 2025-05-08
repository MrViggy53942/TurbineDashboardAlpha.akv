import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import WindDirection from "./WindDirection";

const WS_URL = "ws://localhost:8081";

const LiveTurbineData = () => {
  const [turbineData, setTurbineData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTurbineData(data);
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(() => window.location.reload(), 5000);
    };

    ws.onerror = (error) => console.error("WebSocket error", error);

    return () => ws.close();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Live Wind Turbine Data</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Wind Speed</h2>
          <GaugeChart
            id="wind-gauge"
            nrOfLevels={10}
            percent={(turbineData?.windSpeed || 0) / 25}
          />
          <p className="text-center mt-2">{turbineData?.windSpeed || 0} m/s</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Actual Power</h2>
          <GaugeChart
            id="power-gauge"
            nrOfLevels={10}
            percent={(turbineData?.actualPower || 0) / 1000}
          />
          <p className="text-center mt-2">{turbineData?.actualPower || 0} kW</p>
        </div>

        <WindDirection windDirection={turbineData?.turbineDirection || 0} />
      </div>

      {!isConnected && <p className="text-red-500 mt-4">Reconnecting...</p>}
    </div>
  );
};

export default LiveTurbineData;
