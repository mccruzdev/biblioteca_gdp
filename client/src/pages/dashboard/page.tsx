import "./page.sass";
import { useState } from "react";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { Content } from "./components/content/content";
import { Outlet } from "react-router-dom";

export function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const changeIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} />
      <Header changeIsCollapsed={changeIsCollapsed} />
      <Content isCollapsed={isCollapsed}>
        <Outlet />
      </Content>
    </>
  );
}
