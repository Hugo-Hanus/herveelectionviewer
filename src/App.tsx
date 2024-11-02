import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Parti from "./components/Parti";
import Year from "./components/Year";
import AllCandidats from "./components/AllCandidats";
import AllDataCandidats from "./components/AllDataCandidats";

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Analytics />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Annee/:annee" Component={Year} />
        <Route path="/List/:yearSelected/:listName" Component={Parti} />
        <Route path="/AllCandidats/:yearSelected" Component={AllCandidats} />
        <Route path="/AllDataCandidats" Component={AllDataCandidats} />
      </Routes>
    </HashRouter>
  );
}

export default App;
