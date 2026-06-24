import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/Breadcrumbs";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Breadcrumbs />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;