import React from "react";
import { connect } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'; 

import { toggleSiderBar } from "@/store/actions";
import "./index.less";
const Hamburger = (props) => {
  const { sidebarCollapsed, toggleSiderBar } = props;
  return (
    <div className="hamburger-container">
      { sidebarCollapsed ? <MenuFoldOutlined  onClick={toggleSiderBar} /> : <MenuUnfoldOutlined  onClick={toggleSiderBar} /> } 
    </div>
  );
};

export default connect((state) => state.app, { toggleSiderBar })(Hamburger);
