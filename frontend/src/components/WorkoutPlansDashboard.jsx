import React, { useState } from "react";
import { Plus, List, Dumbbell } from "lucide-react";
import WorkoutPlanForm from "./WorkoutPlanForm";
import WorkoutPlansManager from "./WorkoutPlansManager";

const WorkoutPlansDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");

  const tabs = [
    {
      id: "create",
      label: "CREATE PLAN",
      icon: Plus,
      component: WorkoutPlanForm,
    },
    {
      id: "manage",
      label: "VIEW PLANS",
      icon: List,
      component: WorkoutPlansManager,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen mt-22 -mb-20">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-mono tracking-wider mb-2 flex items-center justify-center gap-3">
                <Dumbbell className="w-8 h-8" />
                WORKOUT PLANS DASHBOARD
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-4 justify-center">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-mono tracking-wider text-lg transition-all duration-200 shadow-lg ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800 border border-zinc-400"
                        : "bg-white/60 backdrop-blur-sm text-slate-700 border border-zinc-400 hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
};

export default WorkoutPlansDashboard;
