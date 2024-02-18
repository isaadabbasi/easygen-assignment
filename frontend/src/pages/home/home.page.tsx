import { authService, persistantStorageService } from "src/services";
import "./home.page.css";
import { constants } from "src/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAuth } from "src/defs";

const { AppRoutes } = constants;

export function HomePage() {
  const navigateTo = useNavigate();

  const [user, setUser] = useState<IAuth.IUser>({
    _id: "",
    createdAt: "",
    updatedAt: "",
    email: "",
    name: "",
  });

  useEffect(() => {
    authService.fetchProtectedData().then((user) => setUser(user))
  }, []);

  const onClick = async () => {
    await authService.signOut();
    persistantStorageService.removeSessionId();
    navigateTo(AppRoutes.SignIn);
  };

  return (
    <div id="home-page">
      <div className="container">
        <div className="hero">
          
          <h2>Hello! {user.name}</h2>
          <h2>🏆 Welcome to the application. 🏆</h2>

        </div>
        {/* Security bad bractice | for **Demo App Only** */}
        {/* Using Images from third party URLs is not recommended */}
        {/* Better use trusted CDNs. but for now its peanut butter jelly time */}
        <img
          src="https://www.enworld.org/media/peanut-butter-jelly-time-banana-gif.95112/full"
          alt="peanut-butter-jelly-time.gif"
        />
        <br />
        <button onClick={onClick}>Sign Out</button>
      </div>
    </div>
  );
}
