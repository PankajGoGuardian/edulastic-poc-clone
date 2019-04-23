import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select, Input } from "antd";
import { get } from "lodash";
import {
  IconFolderNew,
  IconFolderAll,
  IconFolderActive,
  IconFolderDeactive,
  IconFolderMove,
  IconDuplicate
} from "@edulastic/icons";

import selectsData from "../../../TestPage/components/common/selectsData";
import {
  FilterContainer,
  StyledBoldText,
  NewFolderButton,
  FolderButton,
  FolderActionModal,
  ModalFooterButton,
  ModalTitle,
  FolderActionButton
} from "./styled";

const { allGrades, allSubjects, testType } = selectsData;

class LeftFilter extends React.Component {
  state = { visibleModal: {} };

  showModal = name => {
    const { visibleModal } = this.state;
    this.setState({
      visibleModal: {
        ...visibleModal,
        [name]: true
      }
    });
  };

  createFolder = e => {
    console.log(e);
    this.setState({
      visibleModal: false
    });
  };

  moveFolder = () => {};

  hideModal = name => {
    const { visibleModal } = this.state;
    this.setState({
      visibleModal: {
        ...visibleModal,
        [name]: false
      }
    });
  };

  renderFolders = () => (
    <>
      <FolderButton onClick={() => {}} shadow="none" icon={<IconFolderAll />} variant="transparent">
        ALL ASSIGMENTS
      </FolderButton>
      <FolderButton onClick={() => {}} shadow="none" icon={<IconFolderActive />} variant="transparent">
        SPRING ASSIGMENTS
      </FolderButton>
      <FolderButton onClick={() => {}} shadow="none" icon={<IconFolderDeactive />} variant="transparent">
        WINTER ASSIGMENTS
      </FolderButton>
    </>
  );

  render() {
    const { termsData, selectedRows } = this.props;
    const { visibleModal } = this.state;
    return (
      <FilterContainer>
        <FolderActionModal
          title={<ModalTitle>Create a New Folder</ModalTitle>}
          visible={visibleModal.newFolder}
          onCancel={() => this.hideModal("newFolder")}
          footer={[
            <ModalFooterButton key="back" variant="create" onClick={() => this.hideModal("newFolder")}>
              Cancel
            </ModalFooterButton>,
            <ModalFooterButton key="submit" color="primary" variant="create" onClick={this.createFolder}>
              Create
            </ModalFooterButton>
          ]}
        >
          <Input placeholder="Name this folder" />
        </FolderActionModal>

        <FolderActionModal
          title={<ModalTitle>{`Move ${selectedRows.length} items to…`}</ModalTitle>}
          visible={visibleModal.moveFolder}
          onCancel={() => this.hideModal("moveFolder")}
          footer={[
            <ModalFooterButton key="back" variant="create" onClick={() => this.hideModal("moveFolder")}>
              Cancel
            </ModalFooterButton>,
            <ModalFooterButton key="submit" color="primary" variant="create" onClick={this.moveFolder}>
              Move
            </ModalFooterButton>
          ]}
        >
          {this.renderFolders()}
        </FolderActionModal>

        {selectedRows.length ? (
          <>
            <StyledBoldText>{`${selectedRows.length} item selected`}</StyledBoldText>
            <FolderActionButton onClick={() => this.showModal("moveFolder")} color="primary" icon={<IconFolderMove />}>
              Move
            </FolderActionButton>
            <FolderActionButton color="secondary" icon={<IconDuplicate />} onClick={() => {}}>
              DUPLICATE
            </FolderActionButton>
          </>
        ) : (
          <>
            <StyledBoldText>Grade</StyledBoldText>
            <Select mode="multiple" placeholder="All grades">
              {allGrades.map(
                ({ value, text, isContentGrade }) =>
                  !isContentGrade && (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  )
              )}
            </Select>
            <StyledBoldText>Subject</StyledBoldText>
            <Select mode="default" placeholder="All subjects">
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            <StyledBoldText>Year</StyledBoldText>
            <Select mode="default" placeholder="All years">
              <Select.Option key="all" value="">
                {"All years"}
              </Select.Option>
              {termsData.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
            <StyledBoldText>Test Type</StyledBoldText>
            <Select mode="default" placeholder="All">
              {testType.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            <NewFolderButton
              onClick={() => this.showModal("newFolder")}
              color="secondary"
              variant="create"
              shadow="none"
              icon={<IconFolderNew />}
            >
              NEW FOLDER
            </NewFolderButton>
            {this.renderFolders()}
          </>
        )}
      </FilterContainer>
    );
  }
}

LeftFilter.propTypes = {
  termsData: PropTypes.array,
  selectedRows: PropTypes.array
};

LeftFilter.defaultProps = {
  termsData: [],
  selectedRows: []
};

export default connect(
  state => ({
    termsData: get(state, "user.user.orgData.terms", [])
  }),
  {}
)(LeftFilter);
