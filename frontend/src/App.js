import Content from "./Components/Content/Content";
import { Outlet } from "react-router-dom";

import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";
import SideBar from "./Components/SideBar/SideBar";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LibManagement from "./Components/LibManagement/LibManagement";
import Create from "./Components/Create/Create";
import Account from "./Components/Create/Account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />}>
          {/* Các tuyến đường con cho Home */}
          <Route path="" element={<Content />} />
          <Route path="content" element={<Content />} />
          <Route path="create" element={<Create />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
function Home() {
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard--content">
        <Outlet />
      </div>
    </div>
  );
}


export default App;
