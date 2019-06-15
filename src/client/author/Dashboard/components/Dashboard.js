import React from "react";
import { Layout } from "antd";
import HeaderSection from "./Header/Header";
// import ShowcaseSection from "../components/Showcase/showcase";
import MainContent from "../components/Showcase/showcase";
import SideContent from "../components/SideContent/Sidecontent";
import { ContentWrapper } from "./styled";

const Dashboard = () => {
  return (
    <Layout>
      <HeaderSection />
      <ContentWrapper>
        <MainContent />
        <SideContent />
      </ContentWrapper>
    </Layout>
  );
};
export default Dashboard;
