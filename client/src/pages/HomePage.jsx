import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainBody from "./components/MainBody";

export default function HomePage() {
  return (
    <React.Fragment>
      <Navbar />
      <MainBody />
      <Footer />
    </React.Fragment>
  );
}
