import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NotFound } from "./pages/error/404";
import { Layout } from "./pages/layout";
import { Home } from "./pages/home";
import { Report as ReportTask } from "./pages/task/report";
import { Report as ReportDone } from "./pages/done/report";
import { Save as SaveTask } from "./pages/task/save";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/404-not-found" element={<NotFound />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<ReportTask />} />
          <Route path="/tasks/save" element={<SaveTask />} />
          <Route path="/done" element={<ReportDone />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
