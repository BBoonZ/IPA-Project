import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RouterLog from "./pages/RouterLog";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/router/:ip" element={<RouterLog />} />
      </Routes>
    </div>
  );
}

export default App;
