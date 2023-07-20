import { Register } from "./view/pages/Register";
import { Login } from "./view/pages/Login";
import { Home } from "./view/pages/Home";
import { useState } from "react";

export function App() {
  const [view, setView] = useState(sessionStorage.token ? 'home' : 'login')

  const handleNavigateRegister = () => setView('register')
  const handleNavigateToLogin = () => setView('login')
  const handleNavigateHome = () => setView('home')

  if (view === 'login') {
    return <Login onRegisterClick={handleNavigateRegister} onLogin={handleNavigateHome} />
  } else if (view === 'register') {
    return <Register onLoginClick={handleNavigateToLogin} onRegister={handleNavigateToLogin} />
  } else if (view === 'home') {
    return <Home onLogout={handleNavigateToLogin} />
  }
}
