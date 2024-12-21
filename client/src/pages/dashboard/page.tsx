import "./page.sass";
import { useState } from "react";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { Content } from "./components/content/content";
import { Outlet } from "react-router-dom";
import { Loader } from "../../components/loader/loader";
import { useAuthUC } from "../../context/user/user.hook";
import { NotAuthorized } from "../../components/not-authorized/not-authorized";
import { DataProvider } from "../../context/data/data";

export function DashboardPage() {
  const { isAuth } = useAuthUC();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const changeIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isAuth === null) return <Loader />;
  if (!isAuth) return <NotAuthorized />;

  return (
    <DataProvider>
      <Sidebar isCollapsed={isCollapsed} />
      <Header changeIsCollapsed={changeIsCollapsed} />
      <Content isCollapsed={isCollapsed}>
        <Outlet />
      </Content>
    </DataProvider>
  );
}
