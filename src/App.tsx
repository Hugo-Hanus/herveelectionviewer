import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Parti from "./components/Parti";
import Year from "./components/Year";

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Analytics />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Annee/:annee" Component={Year} />
        <Route path="/List/:listName" Component={Parti} />
      </Routes>
    </HashRouter>
  );
}

export default App;
