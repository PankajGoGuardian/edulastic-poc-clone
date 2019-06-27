import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select, Input, Menu, Dropdown, Icon, message, Modal } from "antd";
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
import { themeColor } from "@edulastic/colors";

import selectsData from "../../../TestPage/components/common/selectsData";
import { receiveAssignmentsSummaryAction, receiveAssignmentsAction } from "../../../src/actions/assignments";
import {
  receiveFolderAction,
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
import { getUserRole } from "../../../src/selectors/user";

const { allGrades, allSubjects, testTypes, AdminTestTypes } = selectsData;

const ExtendedInput = ({ value, onChange, visible }) => {
  const renameInput = useRef();
  useLayoutEffect(() => {
    renameInput.current.select();
  }, [visible]);
  return (
    <Input
      style={{ "border-color": themeColor }}
      placeholder="Name this folder"
      value={value}
      onChange={onChange}
      ref={renameInput}
    />
  );
};
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

  moveFolder = () => {
    const {
      selectedRows,
      addMoveToFolderRequest,
      folderData: { _id: folderId },
      folders,
      loadFolders,
      clearSelectedRow
    } = this.props;
    const { moveFolderId } = this.state;

    const { folderName, content } = folders.find(folder => folder._id === moveFolderId) || {};

    const itemsExistInFolder = [];
    const itemsNotExistInFolder = [];

    const currentFolderMap = content.reduce((p, v) => {
      p[v._id] = true;
      return p;
    }, {});
    selectedRows.forEach(item => {
      if (currentFolderMap[item.testId]) {
        itemsExistInFolder.push(item.name);
      } else {
        itemsNotExistInFolder.push(item.name);
      }
    });
    if (itemsExistInFolder.length > 0) {
      message.info(`${itemsExistInFolder.join(", ")} already exist in ${folderName} folder`);
    }
    if (itemsNotExistInFolder.length === 0) {
      return;
    }

    const params = selectedRows.map(row => {
      const param = {
        _id: row.testId,
        contentType: "TEST",
        sourceFolderId: folderId,
        assignmentsNameList: itemsNotExistInFolder,
        folderName
      };
      return pickBy(param, identity);
    });

    if (addMoveToFolderRequest) {
      addMoveToFolderRequest({ folderId: moveFolderId, params });
      loadFolders();
      clearSelectedRow();
      this.setState({ moveFolderId: "" });
    }
    this.hideModal("moveFolder");
  };

  showDeleteConfirm = id => {
    const { folders, deleteFolder } = this.props;
    const folderContent = folders.filter(folder => id === folder._id);
    const delFolderName = folders.find(folder => id === folder._id).folderName;
    if (folderContent[0] && folderContent[0].content && folderContent[0].content.length > 0) {
      return message.info("Only empty folders can be deleted");
    }
    Modal.confirm({
      title: `Are you sure you want to delete ${delFolderName} folder?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (deleteFolder) {
          deleteFolder({ folderId: id, delFolderName });
        }
      },
      onCancel() {}
    });
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
        <Menu.Item key="2" onClick={() => this.showDeleteConfirm(id)}>
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
              {!visibleModal.moveFolder && (
                <Dropdown overlay={menu(folder._id)} trigger={["click"]} placement="bottomRight">
                  <MoreButton active={isActive}>
                    <IconMoreVertical />
                  </MoreButton>
                </Dropdown>
              )}
            </FolderListItem>
          );
        })}
      </>
    );
  };

  render() {
    const { termsData, selectedRows, folders, filterState, isAdvancedView, userRole } = this.props;
    const { visibleModal, folderName, selectedFolder } = this.state;
    const { subject, grades, termId, testType } = filterState;
    const roleBasedTestType = userRole === "teacher" ? testTypes : AdminTestTypes;
    const oldFolderName = selectedFolder ? folders.find(folder => selectedFolder === folder._id).folderName : "";
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
          <ExtendedInput
            value={folderName || oldFolderName}
            onChange={this.handleChangeNewFolderName}
            visible={visibleModal.newFolder}
          />
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
            <Select mode="default" placeholder="All" value={testType} onChange={this.handleChange("testType")}>
              {roleBasedTestType.map(({ value, text }, index) => (
                <Select.Option key={index} value={value}>
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
  loadFolders: PropTypes.func.isRequired,
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
    folderData: getFolderSelector(state),
    userRole: getUserRole(state)
  }),
  {
    loadAssignments: receiveAssignmentsAction,
    loadAssignmentsSummary: receiveAssignmentsSummaryAction,
    createFolderRequest: receiveCreateFolderAction,
    addMoveToFolderRequest: receiveAddMoveFolderAction,
    deleteFolder: receiveDeleteFolderAction,
    renameFolder: receiveRenameFolderAction,
    setFolder: setFolderAction,
    loadFolders: receiveFolderAction,
    clearFolder: clearFolderAction
  }
)(LeftFilter);
