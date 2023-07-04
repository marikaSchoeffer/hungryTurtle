import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./components/Login";
import { Overview } from "./components/Overview";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/overview" element={<Overview/>}/>
        <Route path="*" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

