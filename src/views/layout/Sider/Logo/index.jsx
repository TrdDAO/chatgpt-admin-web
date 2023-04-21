import React from "react";
import logo from "@/assets/images/logo.svg";
import "./index.less";
const Logo = () => {
  return (
    <div className="sidebar-logo-container">
      <img src={logo} className="sidebar-logo" alt="logo" />
      <h1 className="sidebar-title">Admin</h1>
    </div>
  );
};

export default Logo;
