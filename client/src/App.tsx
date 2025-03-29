import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
        {/* Redirect all unmatched paths to 404 */}
        <Route path="*" element={<Navigate to="/404-not-found" replace />} />
        <Route path="/404-not-found" element={<NotFound />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tasks" element={<ReportTask />} />
          <Route path="tasks/save" element={<SaveTask />} />
          <Route path="complete" element={<ReportDone />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
