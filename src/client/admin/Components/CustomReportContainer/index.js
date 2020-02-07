import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
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
import { Button, Spin } from "antd";
import styled from "styled-components";
import CustomReportModel from "../CustomReportModal";
import DistrictSearchForm from "../../Common/Form/DistrictSearchForm";
import { withNamespaces } from "@edulastic/localization";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDistrictData: {},
      customReportLoading: false,
      customReportList: [],
      isEditModalVisible: false,
      isCreateModalVisible: false
    };
  }

  getCustomReportForDistrict = val => {
    const { getCustomReportAction } = this.props;
    getCustomReportAction({ id: val._id });
  };

  showModal = (modalType, reportId) => {
    const { setOpenModalTypeAction, setSelectedReportDataAction, customReportList = [] } = this.props;
    setSelectedReportDataAction(customReportList.find(o => o._id === reportId));
    setOpenModalTypeAction(modalType);
  };

  closeModal = () => {
    const { setOpenModalTypeAction } = this.props;
    setOpenModalTypeAction("");
  };

  submitModal = data => {
    const { createCustomReportAction, updateCustomReportAction, openModalType } = this.props;
    console.log(`submit called!`);
    /*TODO: use correct url for the api and then enable the commented line*/
    if (openModalType === "edit") {
      // updateCustomReportAction(data);
    } else {
      createCustomReportAction(data);
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
    console.log(`district ${districtId}`);
    return (
      <>
        <DistrictSearchForm getCustomReport={this.getCustomReportForDistrict} />
        <StyledButtonContainer>
          <Button disabled={!districtId} type="primary" onClick={() => this.showModal("create")}>
            Configure New Report
          </Button>
        </StyledButtonContainer>
        {customReportLoading ? (
          <Spin size={"large"} />
        ) : (
          <CustomReportTable
            selectedDistrict={districtId}
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
    getCustomReportAction,
    createCustomReportAction,
    updateCustomReportAction,
    setOpenModalTypeAction,
    setSelectedReportDataAction
  }
);

export default compose(
  withNamespaces("customReports"),
  withConnect
)(Index);

const StyledButtonContainer = styled.div`
  padding: 10px 0px;
`;
