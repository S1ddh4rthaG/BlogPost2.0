import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import CreatedBlogs from "./pages/CreatedBlogs.jsx";
import Blog from "./pages/Blog.jsx";
import EditBlog from "./pages/EditBlog.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/blogs/id=:id" element={<Blog />}></Route>
        <Route path="/blogs/create" element={<CreateBlog />}></Route>
        <Route path="/blogs/created" element={<CreatedBlogs />}></Route>
        <Route path="/blogs/edit/id=:id" element={<EditBlog />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
