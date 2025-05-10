import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#017020" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="/">
          Catech Admin
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
