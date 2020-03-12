import React, { Component } from "react";
import { Col } from "antd";
import { MainContainer, SubHeaderWrapper } from "../../../../common/styled";
import ContentSubHeader from "../../../src/components/common/AdminSubHeader/ContentSubHeader";
import { ExternalToolsSearchHeader, StyledSearch, StyledList, StyledRow, StyledColRight } from "./styled";
import { EduButton } from "@edulastic/common";
import { ToolForm } from "../ToolForm/ToolForm";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  getFormData,
  fetchExternalToolProviderAction,
  addExternalToolProviderAction,
  deleteExternalToolProviderAction,
  changeDataAction,
  saveExternalToolProviderAction
} from "../../ducks";
import { getUser, getManageTabLabelSelector } from "../../../src/selectors/user";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { getUserOrgId } from "../../../src/selectors/user";

const menuActive = { mainMenu: "Content", subMenu: "ExternalTools" };

const ETPHeader = ({ addExternalToolProvider }) => {
  return (
    <StyledRow>
      <Col span={12}>
        <h4>External Tool Provider</h4>
      </Col>
      <StyledColRight span={12}>
        <EduButton height="40px" isGhost onClick={() => addExternalToolProvider()}>
          Add Provider
        </EduButton>
      </StyledColRight>
    </StyledRow>
  );
};

class ExternalTools extends Component {
  componentDidMount() {
    const { fetchExternalToolProviders, userOrgId } = this.props;
    fetchExternalToolProviders({ orgId: userOrgId });
  }

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

  render() {
    const {
      formData,
      user,
      addExternalToolProvider,
      deleteExternalToolProvider,
      changeData,
      history,
      saveData,
      userOrgId
    } = this.props;

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
        <StyledList
          split={false}
          header={ETPHeader({ addExternalToolProvider })}
          dataSource={formData}
          renderItem={(tool, i) => (
            <ToolForm
              data={tool}
              deleteData={deleteExternalToolProvider}
              onChangeData={(key, value) => changeData({ index: i, key, value })}
              onSaveData={data => saveData({ orgId: userOrgId, data })}
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
      addExternalToolProvider: addExternalToolProviderAction,
      deleteExternalToolProvider: deleteExternalToolProviderAction,
      changeData: changeDataAction,
      saveData: saveExternalToolProviderAction
    }
  )
);

export default enhance(ExternalTools);
