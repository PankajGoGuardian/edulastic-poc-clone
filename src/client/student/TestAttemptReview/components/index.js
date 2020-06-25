import React, { useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { IconLogoCompact} from "@edulastic/icons";
import styled, { ThemeProvider } from "styled-components";
import { themeColor } from "@edulastic/colors";
import { themes } from "../../../theme";
import SummaryHeader from "./Header";
import SummaryTest from "./Content";
import { finishTestAcitivityAction } from "../../../assessment/actions/test";
import SubmitConfirmation from "../../../assessment/themes/common/SubmitConfirmation";
import { clearUserWorkAction } from "../../../assessment/actions/userWork";

const SummaryContainer = props => {
  const { finishTest, history, match, clearUserWork } = props;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const handlerConfirmationModal = () => {
    setShowConfirmationModal(true);
  };


  const groupId = match.params.groupId;
  return (
    <ThemeProvider theme={themes.default}>
      <Header>
        <IconLogoCompact style={{fill:themeColor,marginLeft:"21px"}} />
      </Header>
      <MainContainer>
        <SummaryHeader showConfirmationModal={handlerConfirmationModal} />
        <SummaryTest finishTest={() => finishTest(groupId)} />
      </MainContainer>
    </ThemeProvider>
  );
};

const enhance = compose(
  withRouter,
  connect(
    null,
    {
      finishTest: finishTestAcitivityAction,
      clearUserWork: clearUserWorkAction
    }
  )
);

export default enhance(SummaryContainer);

SummaryContainer.propTypes = {
  finishTest: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
};

const MainContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
`;

const Header=styled.div`
 display:flex;
 align-items:center;
 justify-content:space-between;
 height: 53px;
 border: 1px solid #DADAE4;
 opacity: 1;
`;
