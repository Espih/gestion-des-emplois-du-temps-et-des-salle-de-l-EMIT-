import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../services/authService";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  //  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoggedIn(true);
      // ajout du redirection vers le Dashboard apres connexion
     setTimeout(() => {
    navigate("/dashboard");
        }, 1000);

    } catch (err: unknown) {
      // On convertit l'inconnu en Error pour accéder à .message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  // --- VUE UTILISATEUR CONNECTÉ ---
  if (isLoggedIn) {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="text-2xl font-bold text-blue-900 mb-2">
            Portail EMIT
          </div>
          <div className="text-emerald-700 bg-emerald-100 p-3 rounded-lg text-sm mb-6">
            Connexion réussie !
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Bienvenue, <strong className="text-gray-900">{user?.nom}</strong>
            <br />
            Rôle :{" "}
            <span className="font-medium text-blue-800">{user?.role}</span>
          </p>
          <button
            onClick={handleLogout}
            className="w-full p-3 bg-red-600 text-white rounded-lg text-[15px] font-semibold hover:bg-red-700 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // --- VUE FORMULAIRE DE CONNEXION ---
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="text-2xl font-bold text-blue-900 mb-2">
          EMIT Planner
        </div>
        <p className="text-gray-500 text-sm mb-8">
          Connectez-vous pour gérer les emplois du temps
        </p>

        {error && (
          <div className="text-red-700 bg-red-100 p-3 rounded-lg text-sm mb-6 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm transition-colors focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm transition-colors focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-blue-900 text-white rounded-lg text-[15px] font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
