import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select, Input, Menu, Dropdown, Icon, message } from "antd";
import { get, pickBy, identity, orderBy, lowerCase, find } from "lodash";
import {
  IconFolderNew,
  IconFolderAll,
  IconFolderActive,
  IconFolderDeactive,
  IconFolderMove,
  // IconDuplicate,
  IconMoreVertical
} from "@edulastic/icons";

import selectsData from "../../../TestPage/components/common/selectsData";
import { receiveAssignmentsSummaryAction, receiveAssignmentsAction } from "../../../src/actions/assignments";
import {
  receiveCreateFolderAction,
  receiveAddMoveFolderAction,
  receiveDeleteFolderAction,
  receiveRenameFolderAction,
  setFolderAction,
  clearFolderAction
} from "../../../src/actions/folder";
import { getDistrictIdSelector } from "../../../src/selectors/assignments";
import { getFoldersSelector, getFolderSelector } from "../../../src/selectors/folder";
import {
  FilterContainer,
  StyledBoldText,
  NewFolderButton,
  FolderButton,
  FolderActionModal,
  ModalFooterButton,
  ModalTitle,
  FolderActionButton,
  FolderListItem,
  FolderListItemTitle,
  MoreButton,
  StyledMenu,
  StyledIconPencilEdit
} from "./styled";

const { allGrades, allSubjects, testTypes } = selectsData;

class LeftFilter extends React.Component {
  state = {
    visibleModal: {},
    folderName: "",
    selectedFolder: null
  };

  showModal = name => {
    const { visibleModal } = this.state;
    this.setState({
      visibleModal: {
        ...visibleModal,
        [name]: true
      }
    });
  };

  showRenameModal = folderId => {
    this.setState({ selectedFolder: folderId }, () => this.showModal("newFolder"));
  };

  createUpdateFolder = () => {
    const { folders } = this.props;
    const { folderName, selectedFolder } = this.state;
    const isExist = find(folders, folder => lowerCase(folder.folderName) === lowerCase(folderName));

    if (isExist) {
      return message.error("The folder name is already used.");
    }

    if (selectedFolder) {
      const { renameFolder } = this.props;
      if (renameFolder) {
        renameFolder({ folderId: selectedFolder, folderName });
      }
    } else {
      const { createFolderRequest } = this.props;
      if (createFolderRequest) {
        createFolderRequest({ folderName });
      }
    }
    this.setState({
      visibleModal: false,
      folderName: "",
      selectedFolder: ""
    });
  };

  removeFolder = id => {
    const { deleteFolder } = this.props;
    if (deleteFolder) {
      deleteFolder({ folderId: id });
    }
  };

  moveFolder = () => {
    const {
      selectedRows,
      addMoveToFolderRequest,
      folderData: { _id: folderId },
      folders,
      setFolder,
      clearSelectedRow
    } = this.props;
    const { moveFolderId } = this.state;

    const params = selectedRows.map(row => {
      const param = {
        _id: row.testId,
        contentType: "TEST",
        sourceFolderId: folderId
      };
      return pickBy(param, identity);
    });

    const folder = find(folders, ({ _id }) => _id === moveFolderId);

    if (addMoveToFolderRequest) {
      addMoveToFolderRequest({ folderId: moveFolderId, params });
      setFolder(folder);
      clearSelectedRow();
      this.setState({ moveFolderId: "" });
    }
    this.hideModal("moveFolder");
  };

  hideModal = name => {
    const { visibleModal } = this.state;
    this.setState({
      visibleModal: {
        ...visibleModal,
        [name]: false
      },
      folderName: "",
      selectedFolder: null
    });
  };

  handleChange = key => value => {
    const {
      loadAssignments,
      onSetFilter,
      filterState,
      isAdvancedView,
      districtId,
      loadAssignmentsSummary
    } = this.props;
    let filters = { ...filterState, [key]: value };

    if (!isAdvancedView) {
      loadAssignments({ filters });
    } else {
      filters = { ...filters, pageNo: 1 };
      loadAssignmentsSummary({ districtId, filters: pickBy(filters, identity), filtering: true });
    }
    onSetFilter(filters);
  };

  handleSelectFolder = folder => {
    const { setFolder, clearFolder } = this.props;
    const { visibleModal } = this.state;

    if (visibleModal.moveFolder) {
      const { _id } = folder;
      this.setState({ moveFolderId: _id });
    } else if (folder) {
      setFolder(folder);
    } else {
      clearFolder();
    }
  };

  handleChangeNewFolderName = e => this.setState({ folderName: e.target.value });

  renderFolders = () => {
    const {
      folders,
      folderData: { _id: folderId }
    } = this.props;

    const { moveFolderId, visibleModal } = this.state;

    const menu = id => (
      <StyledMenu>
        <Menu.Item key="1" onClick={() => this.showRenameModal(id)}>
          <StyledIconPencilEdit width={14} height={14} />
          <span>Rename</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2" onClick={() => this.removeFolder(id)}>
          <Icon type="close" /> <span>Delete</span>
        </Menu.Item>
      </StyledMenu>
    );

    return (
      <>
        {!visibleModal.moveFolder && (
          <FolderButton
            onClick={() => this.handleSelectFolder(null)}
            active={!folderId}
            shadow="none"
            icon={<IconFolderAll />}
            variant="transparent"
          >
            ALL ASSIGNMENTS
          </FolderButton>
        )}
        {orderBy(folders, ["updatedAt"], ["desc"]).map((folder, index) => {
          const isActive = visibleModal.moveFolder ? folder._id === moveFolderId : folder._id === folderId;
          return (
            <FolderListItem key={index} active={isActive}>
              <FolderListItemTitle onClick={() => this.handleSelectFolder(folder)}>
                {isActive ? <IconFolderActive /> : <IconFolderDeactive />}
                <span>{folder.folderName}</span>
              </FolderListItemTitle>
              <Dropdown overlay={menu(folder._id)} trigger={["click"]} placement="bottomRight">
                <MoreButton active={isActive}>
                  <IconMoreVertical />
                </MoreButton>
              </Dropdown>
            </FolderListItem>
          );
        })}
      </>
    );
  };

  render() {
    const { termsData, selectedRows, filterState, isAdvancedView } = this.props;
    const { visibleModal, folderName, selectedFolder } = this.state;
    const { subject, grades, termId, testType } = filterState;

    return (
      <FilterContainer>
        <FolderActionModal
          title={<ModalTitle>{selectedFolder ? "Rename Folder" : "Create a New Folder"}</ModalTitle>}
          visible={visibleModal.newFolder}
          onCancel={() => this.hideModal("newFolder")}
          footer={[
            <ModalFooterButton key="back" variant="create" onClick={() => this.hideModal("newFolder")}>
              Cancel
            </ModalFooterButton>,
            <ModalFooterButton
              key="submit"
              color="primary"
              variant="create"
              disabled={!folderName}
              onClick={this.createUpdateFolder}
            >
              {selectedFolder ? "Update" : "Create"}
            </ModalFooterButton>
          ]}
        >
          <Input placeholder="Name this folder" value={folderName} onChange={this.handleChangeNewFolderName} />
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
            {/* <FolderActionButton color="secondary" icon={<IconDuplicate />} onClick={() => {}}>
              DUPLICATE
            </FolderActionButton> */}
          </>
        ) : (
          <>
            <StyledBoldText>Grade</StyledBoldText>
            <Select mode="multiple" placeholder="All grades" value={grades} onChange={this.handleChange("grades")}>
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
            <Select mode="default" placeholder="All subjects" value={subject} onChange={this.handleChange("subject")}>
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            <StyledBoldText>Year</StyledBoldText>
            <Select mode="default" placeholder="All years" value={termId} onChange={this.handleChange("termId")}>
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
            <Select
              mode="default"
              placeholder="All"
              disabled={!isAdvancedView}
              value={testType}
              onChange={this.handleChange("testType")}
            >
              {testTypes.map(({ value, text }) => (
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
  loadAssignments: PropTypes.func.isRequired,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  createFolderRequest: PropTypes.func.isRequired,
  addMoveToFolderRequest: PropTypes.func.isRequired,
  renameFolder: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  setFolder: PropTypes.func.isRequired,
  clearFolder: PropTypes.func.isRequired,
  districtId: PropTypes.string.isRequired,
  onSetFilter: PropTypes.func.isRequired,
  folderData: PropTypes.object.isRequired,
  clearSelectedRow: PropTypes.func.isRequired,
  folders: PropTypes.array,
  termsData: PropTypes.array,
  selectedRows: PropTypes.array,
  isAdvancedView: PropTypes.bool,
  filterState: PropTypes.object
};

LeftFilter.defaultProps = {
  filterState: {},
  termsData: [],
  selectedRows: [],
  folders: [],
  isAdvancedView: false
};

export default connect(
  state => ({
    districtId: getDistrictIdSelector(state),
    folders: getFoldersSelector(state),
    termsData: get(state, "user.user.orgData.terms", []),
    folderData: getFolderSelector(state)
  }),
  {
    loadAssignments: receiveAssignmentsAction,
    loadAssignmentsSummary: receiveAssignmentsSummaryAction,
    createFolderRequest: receiveCreateFolderAction,
    addMoveToFolderRequest: receiveAddMoveFolderAction,
    deleteFolder: receiveDeleteFolderAction,
    renameFolder: receiveRenameFolderAction,
    setFolder: setFolderAction,
    clearFolder: clearFolderAction
  }
)(LeftFilter);
