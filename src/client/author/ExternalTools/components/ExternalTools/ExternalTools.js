import React, { Component } from "react";
import { Col } from "antd";
import { EduButton, SearchInputStyled } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";
import { set, cloneDeep } from "lodash";
import { MainContainer, SubHeaderWrapper } from "../../../../common/styled";
import ContentSubHeader from "../../../src/components/common/AdminSubHeader/ContentSubHeader";
import { ExternalToolsSearchHeader, StyledList, StyledRow, StyledColRight } from "./styled";
import { ToolForm } from "../ToolForm/ToolForm";
import {
  getFormData,
  fetchExternalToolProviderAction,
  deleteExternalToolProviderAction,
  saveExternalToolProviderAction
} from "../../ducks";
import { getUser, getManageTabLabelSelector, getUserOrgId } from "../../../src/selectors/user";
import Breadcrumb from "../../../src/components/Breadcrumb";

import ExternalToolsModal from "../ExternalToolsModalContent/ExternalToolsModalContent";

const menuActive = { mainMenu: "Content", subMenu: "ExternalTools" };

const ETPHeader = ({ addExternalTool }) => (
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
  },
  searchTerm: ""
};

const getInitailState = () => cloneDeep(initialState);

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

  getFilteredData = () => {
    const words = this.state.searchTerm.split(" ").filter(t => t);
    // search the presence of every search word in the order of its occurrence
    return this.props.formData.filter(({ toolName }) => {
      let pos = 0;
      let flag = true;
      // return false if either of the search term is not found
      words.every(w => {
        const nextPos = toolName.indexOf(w, pos);
        nextPos !== -1 ? (pos = nextPos + w.length) : (flag = false);
        return flag;
      });
      return flag;
    });
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
    const { user, deleteExternalToolProvider, history, userOrgId } = this.props;
    const { isModalVisible, data, searchTerm } = this.state;
    const dataSource = this.getFilteredData();
    return (
      <MainContainer>
        <SubHeaderWrapper>
          {user.role !== "edulastic-admin" && (
            <Breadcrumb data={this.getBreadcrumbData()} style={{ position: "unset" }} />
          )}
        </SubHeaderWrapper>
        <ContentSubHeader active={menuActive} history={history} />
        <ExternalToolsSearchHeader>
          <SearchInputStyled
            placeholder="Search External Tools"
            value={searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value })}
            height="36px"
          />
          <EduButton onClick={() => this.setState({ searchTerm })}>
            Search
          </EduButton>
        </ExternalToolsSearchHeader>
        <ExternalToolsModal
          isModalVisible={isModalVisible}
          data={data}
          onChange={this.onChange}
          onSave={this.onSave}
          onModalClose={this.onModalClose}
        />
        <StyledList
          split={false}
          header={ETPHeader({ addExternalTool: this.addExternalTool })}
          dataSource={dataSource}
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
