import React, { useEffect } from "react";
import styled from "styled-components";
import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";
import ParentController from "./utility/api/parentController";

import "./winsight-testler.css";

const PlayerContentArea = () => {
  useEffect(() => {
    console.log("===========");
    const context = document.getElementById("testlet").contentWindow;
    const controller = new ParentController();
    controller.connect(context);
  }, []);
  return (
    <Main skinB="true">
      <MainContent>
        <div className="winsightFrame" />
        <div className="preview" id="preview">
          <iframe id="testlet" src="testlets/testlet-musicmixer/main.html" title="testlet" />
        </div>
      </MainContent>
    </Main>
  );
};

PlayerContentArea.propTypes = {};

PlayerContentArea.defaultProps = {};

export default PlayerContentArea;

const Main = styled.main`
  background-color: ${props => props.theme.mainBgColor};
  padding: 96px 0px 32px;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0px 32px;
`;

const MainContent = styled.div`
  background-color: ${props => props.theme.mainContentBgColor};
  color: ${props => props.theme.mainContentTextColor};
  border-radius: 10px;
  flex: 1;
  text-align: left;
  font-size: 18px;
  overflow: auto;

  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 24px;
  }
`;
