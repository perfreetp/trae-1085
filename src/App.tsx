import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Obstacles from "@/pages/Obstacles";
import PatrolTasks from "@/pages/PatrolTasks";
import PublicReport from "@/pages/PublicReport";
import Inspection from "@/pages/Inspection";
import RiskAssessment from "@/pages/RiskAssessment";
import Announcements from "@/pages/Announcements";
import Reports from "@/pages/Reports";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/obstacles" element={<Obstacles />} />
          <Route path="/patrol-tasks" element={<PatrolTasks />} />
          <Route path="/public-report" element={<PublicReport />} />
          <Route path="/inspection" element={<Inspection />} />
          <Route path="/risk-assessment" element={<RiskAssessment />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
