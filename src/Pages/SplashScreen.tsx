import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreenLogo from "../assets/new-logo.svg";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set timeout to navigate after 5000ms (5 seconds)
    const timer = setTimeout(() => {
      navigate("/onboarding-1"); // Navigate to your desired route
    }, 5000);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-full w-full flex justify-center items-center bg-white">
      <div className="max-w-sm w-full px-4">
        <img
          src={SplashScreenLogo}
          alt="OrchidSky Logo"
          className="w-[206px] h-[206px] mx-auto"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
