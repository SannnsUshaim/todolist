import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toast } from "react-hot-toast";
import { NotFound } from "./pages/error/404";
import { Layout } from "./pages/layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/404-not-found" element={<NotFound />} />
        <Route path="/" element={<Layout />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
