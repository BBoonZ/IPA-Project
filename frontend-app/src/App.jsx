import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RouterLog from "./pages/RouterLog";
import Test from "./pages/Test";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/Test" element={<Test />} />
        <Route path="/" element={<Home />} />
        <Route path="/router/:ip" element={<RouterLog />} />
      </Routes>
    </div>
  );
}

export default App;
