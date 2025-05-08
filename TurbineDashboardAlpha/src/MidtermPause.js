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
import WindDirection from "./WindDirection";

const sampleData = {
  windSpeed: 6.66,
  temperature: 25.3,
  actualPower: 881.06,
  theoreticalPower: 800,
  turbineDirection: 270,
  history: [
    {
      time: "10:00",
      windSpeed: 6.66,
      actualPower: 881.06,
      turbineDirection: 235.67,
    },
    {
      time: "10:10",
      windSpeed: 6.16,
      actualPower: 663.7,
      turbineDirection: 229.33,
    },
    {
      time: "10:20",
      windSpeed: 6.01,
      actualPower: 578.26,
      turbineDirection: 234.9,
    },
    {
      time: "10:30",
      windSpeed: 5.56,
      actualPower: 465.62,
      turbineDirection: 230.42,
    },
    {
      time: "10:40",
      windSpeed: 4.96,
      actualPower: 311.05,
      turbineDirection: 229.54,
    },
    {
      time: "10:50",
      windSpeed: 4.6,
      actualPower: 230.05,
      turbineDirection: 231.8,
    },
    {
      time: "11:00",
      windSpeed: 4.55,
      actualPower: 233.99,
      turbineDirection: 234.11,
    },
    {
      time: "11:10",
      windSpeed: 4.26,
      actualPower: 175.59,
      turbineDirection: 228.78,
    },
    {
      time: "11:20",
      windSpeed: 3.89,
      actualPower: 118.13,
      turbineDirection: 227.94,
    },
    {
      time: "11:30",
      windSpeed: 4.04,
      actualPower: 142.2,
      turbineDirection: 224.46,
    },
    {
      time: "11:40",
      windSpeed: 4.5,
      actualPower: 212.57,
      turbineDirection: 229.13,
    },
    {
      time: "11:50",
      windSpeed: 4.54,
      actualPower: 222.61,
      turbineDirection: 227.04,
    },
    {
      time: "12:00",
      windSpeed: 4.32,
      actualPower: 194.18,
      turbineDirection: 230.31,
    },
  ],
};

const WindTurbineDashboard = () => {
  const [data, setData] = useState(sampleData);
  const [selectedData, setSelectedData] = useState({
    windSpeed: data.windSpeed,
    actualPower: data.actualPower,
    turbineDirection: data.turbineDirection,
  });

  useEffect(() => {
    // Placeholder for future live data fetch
  }, []);

  const handlePointClick = (event) => {
    if (event) {
      setSelectedData({
        windSpeed: event.windSpeed,
        actualPower: event.actualPower,
        turbineDirection: event.turbineDirection,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Wind Turbine Dashboard
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Wind Speed</h2>
          <GaugeChart
            id="wind-gauge"
            nrOfLevels={10}
            percent={selectedData.windSpeed / 25}
            hideText={true}
          />
          <p className="text-lg font-bold mt-2">{selectedData.windSpeed} m/s</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Actual Power</h2>
          <GaugeChart
            id="power-gauge"
            nrOfLevels={10}
            percent={selectedData.actualPower / 1000}
            hideText={true}
          />
          <p className="text-lg font-bold mt-2">
            {selectedData.actualPower} kW
          </p>
        </div>
        <div>
          <WindDirection windDirection={WindDirection} />
        </div>
      </div>
      <div className="bg-white p-4 mt-4 rounded-xl shadow text-black">
        <h2 className="text-lg font-semibold">
          Wind Speed vs. Power Over Time
        </h2>
        <LineChart
          width={600}
          height={300}
          data={data.history}
          onClick={(e) => handlePointClick(e.activePayload?.[0]?.payload)}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="time" stroke="black" />
          <YAxis stroke="black" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" />
          <Line type="monotone" dataKey="actualPower" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default WindTurbineDashboard;
