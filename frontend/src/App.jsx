import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import WorkoutPlanForm from "./components/WorkoutPlanForm";
import WorkoutPlansManager from "./components/WorkoutPlansManager";
import Hero from "./components/Hero";
import CreateTemplate from "./components/CreateTemplate";
import TemplateList from "./components/TemplateList";
import AuthComponent from "./components/AuthComponent";

const Templates = () => {
  return (
    <div>
      <CreateTemplate></CreateTemplate>
      <TemplateList></TemplateList>
    </div>
  );
};

function App() {
  return (
    <div className="relative z-10">
      <Router>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/test" element={<WorkoutPlanForm />} />
              <Route path="/auth" element={<AuthComponent />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/workout-plans" element={<WorkoutPlansManager />} />
            </Routes>
          </main>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
