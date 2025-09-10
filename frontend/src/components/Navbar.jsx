import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  // 👇 Create a ref specifically for the mobile dropdown menu
  const mobileMenuRef = useRef(null);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Templates", path: "/templates" },
    { label: "Generate Exercises", path: "/test" },
    { label: "Dashboard", path: "/dash" },
  ];

  const handleStartClick = () => {
    navigate("/auth");
  };

  const handleProfileClick = () => {
    logOut();
  };

  // 👇 Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 ">
      <nav className="relative w-full max-w-6xl ">
        <div className=" h-18 rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm ">
          <div className="flex items-center justify-between h-full px-8">
            <div>
              <h1 className="text-2xl font-mono tracking-wider">Navbar</h1>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setActiveIndex(index)}
                  className={`px-6 py-3 rounded-2xl font-bold text-lg ${
                    location.pathname === item.path
                      ? "bg-slate-400 text-slate-800 shadow-lg"
                      : "bg-white bg-opacity-20 text-slate-800 hover:bg-opacity-30"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="hidden lg:block">
              {user ? (
                <button
                  onClick={handleProfileClick}
                  className="bg-green-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-green-200 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className="tracking-wide">PROFILE</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleStartClick}
                  className="bg-purple-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-amber-500 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className="tracking-wide">START</span>
                  </div>
                </button>
              )}
            </div>
            <button
              className="lg:hidden bg-white bg-opacity-20 p-2 rounded-xl hover:bg-opacity-30 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              // 👉 This button is OUTSIDE the mobile menu ref, so clicking it will close the menu correctly
            >
              {isMenuOpen ? <h1>X</h1> : <h1>|||</h1>}
            </button>
          </div>
        </div>

        {/* 👇 Attach the ref to the mobile dropdown container */}
        {isMenuOpen && (
          <div
            ref={mobileMenuRef} // ✅ This is the key fix!
            className="absolute top-full left-0 right-0 mt-4 border border-zinc-400 border-opacity-30 rounded-3xl shadow-lg lg:hidden z-30 bg-white/80 backdrop-blur-sm"
          >
            <div className="p-8 space-y-4 ">
              <div className="text-center mb-6">
                <h3 className="text-xl font-mono mb-2 tracking-wide">
                  CHOOSE YOUR PATH
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
              </div>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsMenuOpen(false); // 👈 Optional: close menu on item click
                  }}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl border font-mono text-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-slate-400 text-gray-900 shadow-lg"
                      : "hover:bg-slate-400 border-zinc-400"
                  }`}
                >
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false); // 👈 Close on logout click
                  }}
                  className="w-full bg-green-400 text-gray-900 px-6 py-5 rounded-2xl font-mono text-lg transition-colors duration-200 shadow-lg mt-6"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="tracking-wide">LOGOUT</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleStartClick();
                    setIsMenuOpen(false); // 👈 Close on start click
                  }}
                  className="w-full bg-blue-400 text-gray-900 px-6 py-5 rounded-2xl font-mono text-lg transition-colors duration-200 shadow-lg mt-6"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="tracking-wide">START</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
