import React, { useState } from "react";

const HeroSection = ({
  subtitle = "Log your workouts, build consistency, and watch your strength grow — one exercise at a time",
  primaryButtonText = "START LOGGING →",
  onPrimaryClick = () => console.log("Primary button clicked"),
  backgroundGradient = "from-blue-50 to-purple-50",
  showStats = true,
  // Updated humble stats
  stats = [
    { value: "🏋️‍♂️", label: "Built by a fellow lifter" },
    { value: "✅", label: "Simple. Works. No quitting." },
    { value: "📱", label: "Always there when you need it" },
  ],
  // Optional personal signature
  showPersonalNote = false,
  personalNote = "I built this because I kept forgetting my reps — maybe you do too.",
  personalName = "— Your workout buddy",
}) => {
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mt-22">
        <div
          className={`rounded-[40px] shadow-lg border border-zinc-400 bg-gradient-to-br ${backgroundGradient} overflow-hidden relative`}
        >
          <div className="px-8 py-16 lg:py-24">
            {/* Main Hero Content */}
            <div className="text-center space-y-8">
              {/* Title Section */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-mono tracking-wider text-slate-800 leading-tight">
                  Track Every Rep <br />
                  Own Your Progress
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                {subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <button
                  onClick={onPrimaryClick}
                  className="bg-purple-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-amber-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="tracking-wide">{primaryButtonText}</span>
                </button>
              </div>

              {/* Stats Section — Now "Value Promises" */}
              {showStats && (
                <div className="pt-16">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredStat(index)}
                        onMouseLeave={() => setHoveredStat(null)}
                        className={`bg-white bg-opacity-30 rounded-2xl p-6 border border-zinc-300 transition-all duration-200 cursor-pointer ${
                          hoveredStat === index
                            ? "bg-opacity-50 shadow-lg transform scale-105"
                            : "hover:bg-opacity-40"
                        }`}
                      >
                        <div className="text-center space-y-2">
                          <div className="text-3xl lg:text-4xl font-mono font-black text-slate-800 tracking-wider">
                            {stat.value}
                          </div>
                          <div className="text-sm lg:text-base text-slate-600 font-medium tracking-wide">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Optional Personal Note */}
                  {showPersonalNote && (
                    <div className="pt-8">
                      <p className="text-slate-600 italic text-sm lg:text-base max-w-xl mx-auto">
                        “{personalNote}” <br />
                        <span className="font-medium not-italic">
                          {personalName}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-white bg-opacity-20 border border-zinc-300 hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
};

// Example usage component
const Hero = () => {
  return (
    <div className="min-h-screen bg-gray-100 space-y-8">
      {/* Default Hero — Humble & Personal */}
      <HeroSection showPersonalNote={true} />
    </div>
  );
};

export default Hero;
