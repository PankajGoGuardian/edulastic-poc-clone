import React, { useEffect, useRef } from "react";
import { StyledContainer } from "../../../common/styled";
import { connect } from "react-redux";
import { Spin } from "antd";
import { getCustomReportLoader, getCustomReportURL, getCustomReportURLAction, getCustomReportName } from "../ducks";
import PropTypes from "prop-types";

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

  useEffect(() => {
    if (params?.id) {
      getCustomReportURL(params.id);
    }
  }, []);

  useEffect(() => {
    setDynamicBreadcrumb(customReportName);
  }, [customReportName]);

  return (
    <StyledContainer style={{ position: "relative", height: "calc(100vh - 140px)", padding: "10px" }}>
      {isLoading ? (
        <Spin size="small" />
      ) : (
        <iframe
          width={"100%"}
          height={"100%"}
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
  isLoading: PropTypes.bool,
  reportUrl: PropTypes.string,
  customReportName: PropTypes.string,
  getCustomReportURL: PropTypes.func.isRequired,
  setDynamicBreadcrumb: PropTypes.func.isRequired
};

const enhance = connect(
  state => ({
    isLoading: getCustomReportLoader(state),
    reportUrl: getCustomReportURL(state),
    customReportName: getCustomReportName(state)
  }),
  {
    getCustomReportURL: getCustomReportURLAction
  }
);

export default enhance(CustomReportIframe);
