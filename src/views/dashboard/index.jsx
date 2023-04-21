import {
  message,
} from "antd";
import React, { useEffect, useState } from "react";

import "./index.less";

const Dashboard = () => {
  // 提示框
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    
  }, []);


  return (
    <div className="app-container">
      {contextHolder}
      首页
    </div>
  );
};

export default Dashboard;
