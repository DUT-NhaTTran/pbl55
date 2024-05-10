import Content from "./Components/Content/Content";
import { Outlet } from "react-router-dom";
import ReactModal from "react-modal";
import CreateBook from "./Components/BookFunction/CreateBook";
import EditBook from "./Components/BookFunction/EditBook";
import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";
import SideBar from "./Components/SideBar/SideBar";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./Components/Create/Create";
import Account from "./Components/Create/Account";
import BookList from "./Components/BookList/BookList";
import EditProfile from "./Components/EditProfile/EditProfile";
import ChangeAccount from "./Components/LoginForm/ChangeAccount";
import User from "./Components/User/User";
import { NotificationProvider } from "./Components/Noti/Noti";
import EditStudentProfile from "./Components/EditProfile/EditStudentProfile";
ReactModal.setAppElement("#root");

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/changeaccount" element={<ChangeAccount />} />
          <Route path="/home" element={<Home />}>
            {/* Các tuyến đường con cho Home */}
            <Route path="" element={<Content />} />
            <Route path="content" element={<Content />} />
            <Route path="create" element={<Create />} />
            <Route path="account" element={<Account />} />
            <Route path="booklist" element={<BookList />} />
            <Route path="editprofile" element={<EditProfile />} />
            <Route path="createbook" element={<CreateBook />} />
            <Route path="editbook" element={<EditBook />} />
            <Route path="user" element={<User />} />
            <Route path="editstudentprofile" element={<EditStudentProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
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
