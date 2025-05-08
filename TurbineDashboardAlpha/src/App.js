// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./LoginPage";
import LiveTurbineData from "./TurbineData";

function App() {
  const token = localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        {/* Default route: if not authenticated, show login. If authenticated, go to live data */}
        <Route
          path="/"
          element={!token ? <LoginForm /> : <Navigate to="/live" />}
        />

        {/* Protected live data route */}
        <Route
          path="/live"
          element={token ? <LiveTurbineData /> : <Navigate to="/" />}
        />

        {/* Catch-all route for unmatched URLs */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
