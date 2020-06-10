import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { IconExpandArrowIn, IconExpandArrowOut } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import {
  getCustomReportLoader,
  getCustomReportURL as getCustomReportURLSelector,
  getCustomReportURLAction,
  getCustomReportName
} from "../ducks";
import { StyledContainer, StyledIframe } from "../../../common/styled";

const CustomReportIframe = props => {
  const {
    isLoading,
    getCustomReportURL,
    reportUrl,
    match: { params },
    setDynamicBreadcrumb,
    customReportName
  } = props;
  const frameRef = useRef();

  const [isFull, toggleFullScreen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      getCustomReportURL(params.id);
    }
  }, []);

  useEffect(() => {
    setDynamicBreadcrumb(customReportName);
  }, [customReportName]);

  const toggleExpand = () => toggleFullScreen(!isFull);

  const fullScreenStyle = { position: "absolute", height: "100vh", top: 0, zIndex: 1000, left: 0, right: 0 };

  return (
    <StyledContainer style={isFull ? fullScreenStyle : { position: "relative", height: "calc(100vh - 165px)" }}>
      {!isLoading && (
        <ExpandButton onClick={toggleExpand} isFull={isFull}>
          {isFull ? <IconExpandArrowOut /> : <IconExpandArrowIn />}
        </ExpandButton>
      )}
      {isLoading ? (
        <Spin size="small" />
      ) : (
        <StyledIframe
          width="100%"
          height="100%"
          ref={frameRef}
          id={params?.id || ""}
          src={reportUrl}
          title="Custom Report"
        />
      )}
    </StyledContainer>
  );
};

CustomReportIframe.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  reportUrl: PropTypes.string.isRequired,
  customReportName: PropTypes.string.isRequired,
  getCustomReportURL: PropTypes.func.isRequired,
  setDynamicBreadcrumb: PropTypes.func.isRequired
};

const enhance = connect(
  state => ({
    isLoading: getCustomReportLoader(state),
    reportUrl: getCustomReportURLSelector(state),
    customReportName: getCustomReportName(state)
  }),
  {
    getCustomReportURL: getCustomReportURLAction
  }
);

export default enhance(CustomReportIframe);

const ExpandButton = styled.div`
  position: absolute;
  right: ${({ isFull }) => (isFull ? 4 : -8)}px;
  top: ${({ isFull }) => (isFull ? 4 : -8)}px;
  cursor: pointer;
  svg {
    fill: ${themeColor};
    &:hover {
      fill: ${themeColor};
    }
  }
`;
