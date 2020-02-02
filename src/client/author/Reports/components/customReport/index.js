import React, { useEffect } from "react";
import { StyledContainer } from "../../common/styled";
import { connect } from "react-redux";
import CustomReportCard from "./customReportCard/customReportCard";
import { getCustomReportAction, getCustomReportList, getCustomReportLoader } from "../../components/customReport/ducks";
import { Result, Spin } from "antd";
import PropTypes from "prop-types";

const CustomReports = props => {
  const { customReportList = [], getCustomReport, isLoading, history } = props;
  const showLoader = () => <Spin size="small" />;
  useEffect(() => {
    if (customReportList.length === 0) {
      getCustomReport();
    }
  }, []);

  const showReport = (_id, title) => {
    history.push(`/author/reports/custom-reports/${_id}`);
  };

  return (
    <StyledContainer>
      {isLoading ? (
        showLoader()
      ) : customReportList.length > 0 ? (
        <CustomReportCard reportCards={customReportList} showReport={showReport} />
      ) : (
        <Result title="No report found" />
      )}
    </StyledContainer>
  );
};

CustomReports.propTypes = {
  isLoading: PropTypes.bool,
  customReportList: PropTypes.array,
  getCustomReport: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const enhance = connect(
  state => ({
    isLoading: getCustomReportLoader(state),
    customReportList: getCustomReportList(state)
  }),
  {
    getCustomReport: getCustomReportAction
  }
);

export default enhance(CustomReports);
