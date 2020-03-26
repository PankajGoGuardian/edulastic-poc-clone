import React, { Component } from "react";
import { Col } from "antd";
import { MainContainer, SubHeaderWrapper } from "../../../../common/styled";
import ContentSubHeader from "../../../src/components/common/AdminSubHeader/ContentSubHeader";
import { ExternalToolsSearchHeader, StyledSearch, StyledList, StyledRow, StyledColRight, CustomModal } from "./styled";
import { EduButton } from "@edulastic/common";
import { ToolForm } from "../ToolForm/ToolForm";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  getFormData,
  fetchExternalToolProviderAction,
  deleteExternalToolProviderAction,
  saveExternalToolProviderAction
} from "../../ducks";
import { getUser, getManageTabLabelSelector } from "../../../src/selectors/user";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { getUserOrgId } from "../../../src/selectors/user";
import { ExternalToolsModalContent } from "../ExternalToolsModalContent/ExternalToolsModalContent";
import { set, cloneDeep } from "lodash";

const menuActive = { mainMenu: "Content", subMenu: "ExternalTools" };

const ETPHeader = ({ addExternalTool }) => {
  return (
    <StyledRow>
      <Col span={12}>
        <h4>External Tool Provider</h4>
      </Col>
      <StyledColRight span={12}>
        <EduButton height="40px" isGhost onClick={addExternalTool}>
          Add Provider
        </EduButton>
      </StyledColRight>
    </StyledRow>
  );
};

const initialState = {
  isModalVisible: false,
  data: {
    toolName: "",
    toolType: "",
    settings: {
      consumerKey: "",
      sharedSecret: "",
      privacy: "",
      configurationType: "",
      matchBy: "",
      domain: "",
      customParams: ""
    }
  }
};

const getInitailState = () => {
  return cloneDeep(initialState);
};

class ExternalTools extends Component {
  componentDidMount() {
    const { fetchExternalToolProviders, userOrgId } = this.props;
    fetchExternalToolProviders({ orgId: userOrgId });
  }

  state = getInitailState();

  getBreadcrumbData = () => {
    const { manageTabLabel } = this.props;
    return [
      {
        title: manageTabLabel.toUpperCase(),
        to: "/author/districtprofile"
      },
      {
        title: "CONTENT",
        to: ""
      }
    ];
  };

  onModalClose = () => {
    this.setState({
      isModalVisible: false
    });
  };

  addExternalTool = () => {
    const initState = getInitailState();
    initState.isModalVisible = true;
    this.setState(initState);
  };

  onSave = () => {
    const { saveData, userOrgId } = this.props;
    saveData({ orgId: userOrgId, data: this.state.data });
    this.setState(getInitailState());
  };

  onChange = (key, value) => {
    this.setState({
      data: set(this.state.data, key, value)
    });
  };

  onEdit = data => {
    this.setState({
      data,
      isModalVisible: true
    });
  };

  render() {
    const { formData, user, deleteExternalToolProvider, history, userOrgId } = this.props;
    const { isModalVisible, data } = this.state;
    return (
      <MainContainer>
        <SubHeaderWrapper>
          {user.role !== "edulastic-admin" && (
            <Breadcrumb data={this.getBreadcrumbData()} style={{ position: "unset" }} />
          )}
        </SubHeaderWrapper>
        <ContentSubHeader active={menuActive} history={history} />
        <ExternalToolsSearchHeader>
          <StyledSearch placeholder="Search External Tools" />
          <EduButton height="40px">Search</EduButton>
        </ExternalToolsSearchHeader>
        <CustomModal
          title="External LTI Resource"
          visible={isModalVisible}
          onCancel={this.onModalClose}
          footer={[
            <EduButton isGhost height="40px" onClick={this.onModalClose}>
              CANCEL
            </EduButton>,
            <EduButton height="40px" onClick={this.onSave}>
              SAVE
            </EduButton>
          ]}
        >
          <ExternalToolsModalContent data={data} onChange={this.onChange} />
        </CustomModal>
        <StyledList
          split={false}
          header={ETPHeader({ addExternalTool: this.addExternalTool })}
          dataSource={formData}
          renderItem={(tool, i) => (
            <ToolForm
              key={i}
              onEdit={() => this.onEdit(cloneDeep(tool))}
              data={tool}
              deleteData={() => deleteExternalToolProvider({ orgId: userOrgId, id: tool._id })}
            />
          )}
        />
      </MainContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      manageTabLabel: getManageTabLabelSelector(state),
      user: getUser(state),
      formData: getFormData(state),
      userOrgId: getUserOrgId(state)
    }),
    {
      fetchExternalToolProviders: fetchExternalToolProviderAction,
      deleteExternalToolProvider: deleteExternalToolProviderAction,
      saveData: saveExternalToolProviderAction
    }
  )
);

export default enhance(ExternalTools);
