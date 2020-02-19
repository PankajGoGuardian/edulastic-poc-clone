import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Spin } from "antd";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { getDistrictDataSelector } from "../../Upgrade/ducks";
import {
  createCustomReportAction,
  getCustomReportAction,
  getCustomReportList,
  getCustomReportLoader,
  getOpenModalType,
  getSelectedDistrict,
  getSelectedReportData,
  setOpenModalTypeAction,
  setSelectedReportDataAction,
  updateCustomReportAction
} from "./ducks";
import CustomReportTable from "../CustomReportTable";
import CustomReportModel from "../CustomReportModal";
import DistrictSearchForm from "../../Common/Form/DistrictSearchForm";

class Index extends React.Component {
  getCustomReportForDistrict = val => {
    const { getCustomReport } = this.props;
    getCustomReport({ id: val._id });
  };

  showModal = (modalType, reportId) => {
    const { setOpenModalType, setSelectedReportData, customReportList = [] } = this.props;
    setSelectedReportData(customReportList.find(o => o._id === reportId));
    setOpenModalType(modalType);
  };

  closeModal = () => {
    const { setOpenModalType } = this.props;
    setOpenModalType("");
  };

  submitModal = data => {
    const { createCustomReport, updateCustomReport, openModalType } = this.props;
    console.log(`submit called!`);
    if (openModalType === "edit") {
      updateCustomReport(data);
    } else {
      createCustomReport(data);
    }
  };

  render() {
    const {
      selectedDistrictData: { _id: districtId } = {},
      customReportList,
      customReportLoading,
      openModalType,
      reportData,
      t
    } = this.props;
    return (
      <>
        <DistrictSearchForm getCustomReport={this.getCustomReportForDistrict} />
        <StyledButtonContainer>
          <Button disabled={!districtId} type="primary" onClick={() => this.showModal("create")}>
            Configure New Report
          </Button>
        </StyledButtonContainer>
        {customReportLoading ? (
          <Spin size="large" />
        ) : (
          <CustomReportTable
            selectedDistrictId={districtId}
            customReportData={customReportList}
            showEditModal={this.showModal}
          />
        )}
        {openModalType && (
          <CustomReportModel
            districtId={districtId}
            onCancel={this.closeModal}
            onSubmit={this.submitModal}
            modalType={openModalType}
            reportData={reportData}
            t={t}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  districtData: getDistrictDataSelector(state),
  customReportList: getCustomReportList(state),
  selectedDistrictData: getSelectedDistrict(state),
  customReportLoading: getCustomReportLoader(state),
  openModalType: getOpenModalType(state),
  reportData: getSelectedReportData(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    getCustomReport: getCustomReportAction,
    createCustomReport: createCustomReportAction,
    updateCustomReport: updateCustomReportAction,
    setOpenModalType: setOpenModalTypeAction,
    setSelectedReportData: setSelectedReportDataAction
  }
);

export default compose(
  withNamespaces("customReports"),
  withConnect
)(Index);

const StyledButtonContainer = styled.div`
  padding: 10px 0px;
`;
