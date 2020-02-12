import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select, Input, Menu, Dropdown, Icon, message, Modal, Button } from "antd";
import { get, pickBy, identity, orderBy, lowerCase, find } from "lodash";
import {
  IconFolderNew,
  IconFolderAll,
  IconFolderActive,
  IconFolderDeactive,
  IconFolderMove,
  // IconDuplicate,
  IconMoreVertical,
  IconPencilEdit
} from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

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
  MoveFolderActionModal,
  FooterCancelButton,
  FoldersListWrapper,
  ModalTitle,
  FolderActionButton,
  FolderListItem,
  FolderListItemTitle,
  MoreButton,
  DropMenu,
  MenuItems,
  CaretUp
} from "./styled";
import { getUserRole, getGroupList } from "../../../src/selectors/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive } from "@fortawesome/free-solid-svg-icons";

const { allGrades, allSubjects, testTypes, AdminTestTypes } = selectsData;

const AssignmentStatus = {
  NOT_OPEN: "NOT OPEN",
  IN_PROGRESS: "IN PROGRESS",
  IN_GRADING: "IN GRADING",
  DONE: "DONE"
};

const ExtendedInput = ({ value, onChange, visible, onKeyUp }) => {
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
      onKeyUp={onKeyUp}
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

  handleCreateOnKeyPress = e => {
    const { folderName } = this.state;
    if (e.keyCode === 13 && folderName.length) {
      this.createUpdateFolder();
    }
  };

  moveFolder = () => {
    const {
      selectedRows,
      addMoveToFolderRequest,
      folderData: { _id: folderId },
      folders,
      clearSelectedRow,
      isAdvancedView
    } = this.props;
    const { moveFolderId } = this.state;
    if (!moveFolderId) {
      message.info(`Please select a folder`);
      return;
    }
    const { folderName, content } = folders.find(folder => folder._id === moveFolderId) || {};

    const itemsExistInFolder = [];
    const itemsNotExistInFolder = [];

    const currentFolderMap = content.reduce((p, v) => {
      p[v._id] = true;
      return p;
    }, {});
    selectedRows.forEach(item => {
      if (currentFolderMap[item.testId]) {
        itemsExistInFolder.push(isAdvancedView ? item.title : item.name);
      } else {
        itemsNotExistInFolder.push(isAdvancedView ? item.title : item.name);
      }
    });
    if (itemsExistInFolder && itemsExistInFolder.length > 0) {
      const showAlreadyExistMsg =
        itemsExistInFolder.length > 1 ? `${itemsExistInFolder.length} assignments` : itemsExistInFolder;
      message.info(`${showAlreadyExistMsg} already exist in ${folderName} folder`);
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

    addMoveToFolderRequest({ folderId: moveFolderId, params });
    clearSelectedRow();
    this.setState({ moveFolderId: "" });
    this.hideModal("moveFolder");
  };

  showDeleteConfirm = folderId => {
    const { folders } = this.props;
    const folderContent = folders.filter(folder => folderId === folder._id);
    if (folderContent[0] && folderContent[0].content && folderContent[0].content.length > 0) {
      return message.info("Only empty folders can be deleted");
    }
    this.setState({ selectedFolder: folderId }, () => this.showModal("delFolder"));
  };

  deleteSelectedFolder = () => {
    const { folders, deleteFolder } = this.props;
    const { selectedFolder } = this.state;
    const delFolderName = folders.find(folder => selectedFolder === folder._id).folderName;
    if (deleteFolder) {
      deleteFolder({ folderId: selectedFolder, delFolderName });
    }
    this.setState({
      visibleModal: false,
      folderName: "",
      selectedFolder: ""
    });
  };

  hideModal = (name, callback) => {
    const { visibleModal } = this.state;
    this.setState(
      () => ({
        visibleModal: {
          ...visibleModal,
          [name]: false
        },
        folderName: "",
        selectedFolder: null
      }),
      () => {
        if (callback) callback();
      }
    );
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

  handleSelectFolder = async folder => {
    const {
      setFolder,
      clearFolder,
      filterState: filters,
      districtId,
      loadAssignmentsSummary,
      isAdvancedView
    } = this.props;
    const { visibleModal } = this.state;

    if (visibleModal.moveFolder) {
      const { _id } = folder;
      this.setState({ moveFolderId: _id });
    } else if (folder) {
      await setFolder(folder);
      if (isAdvancedView) {
        loadAssignmentsSummary({ districtId, filters: pickBy(filters, identity), filtering: true });
      }
    } else {
      await clearFolder();
      if (isAdvancedView) {
        loadAssignmentsSummary({ districtId, filters: pickBy(filters, identity), filtering: true });
      }
    }
  };

  handleChangeNewFolderName = e => this.setState({ folderName: e.target.value });

  renderFolders = ellipsis => {
    const {
      folders,
      folderData: { _id: folderId }
    } = this.props;

    const { moveFolderId, visibleModal } = this.state;

    const menu = id => (
      <DropMenu>
        <CaretUp className="fa fa-caret-up" />
        <MenuItems data-cy="rename" key="1" onClick={() => this.showRenameModal(id)}>
          <IconPencilEdit width={12} height={12} />
          <span>Rename</span>
        </MenuItems>
        <MenuItems data-cy="delete" key="2" onClick={() => this.showDeleteConfirm(id)}>
          <Icon type="close" /> <span>Delete</span>
        </MenuItems>
      </DropMenu>
    );

    return (
      <>
        {!visibleModal.moveFolder && (
          <FolderButton
            data-cy="allAssignment"
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
            <FolderListItem data-cy={folder.folderName} key={index} active={isActive}>
              <FolderListItemTitle
                ellipsis={ellipsis}
                title={folder.folderName}
                onClick={() => this.handleSelectFolder(folder)}
              >
                <IconFolderDeactive />
                <span>{folder.folderName}</span>
              </FolderListItemTitle>
              {!visibleModal.moveFolder && (
                <Dropdown overlay={menu(folder._id)} trigger={["click"]} placement="bottomRight">
                  <MoreButton data-cy="moreButton" active={isActive}>
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
    const { termsData, selectedRows, folders, filterState, isAdvancedView, userRole, classList } = this.props;
    const { visibleModal, folderName, selectedFolder } = this.state;
    const { subject, grades, termId, testType, classId, status } = filterState;
    const roleBasedTestType = userRole === "teacher" ? testTypes : AdminTestTypes;
    const oldFolderName = selectedFolder ? folders.find(folder => selectedFolder === folder._id).folderName : "";
    const classListByTerm = classList.filter(item => item.termId === termId || !termId);
    const classListActive = classListByTerm.filter(item => item.active === 1);
    const classListArchive = classListByTerm.filter(item => item.active === 0);
    return (
      <FilterContainer>
        <FolderActionModal
          centered
          title={
            !visibleModal.createFolder && <ModalTitle>{selectedFolder ? "Rename" : "Create a New Folder"}</ModalTitle>
          }
          visible={visibleModal.newFolder || visibleModal.createFolder}
          onCancel={() => this.hideModal(visibleModal.createFolder ? "createFolder" : "newFolder")}
          footer={[
            <FooterCancelButton
              data-cy="cancel"
              key="back"
              variant="create"
              onClick={() => this.hideModal(visibleModal.createFolder ? "createFolder" : "newFolder")}
            >
              Cancel
            </FooterCancelButton>,
            <ModalFooterButton
              data-cy="submit"
              key="submit"
              color="primary"
              variant="create"
              disabled={!visibleModal.createFolder ? !folderName : ""}
              onClick={
                !visibleModal.createFolder
                  ? this.createUpdateFolder
                  : () => this.hideModal("createFolder", () => this.showModal("newFolder"))
              }
            >
              {visibleModal.createFolder ? "Create New Folder" : selectedFolder ? "Update" : "Create"}
            </ModalFooterButton>
          ]}
        >
          {visibleModal.createFolder ? (
            <h4>No folders have been created.</h4>
          ) : (
            <ExtendedInput
              value={folderName || oldFolderName}
              onChange={this.handleChangeNewFolderName}
              visible={visibleModal.newFolder}
              onKeyUp={this.handleCreateOnKeyPress}
            />
          )}
        </FolderActionModal>

        <ConfirmationModal
          title="Delete Folder"
          visible={visibleModal.delFolder}
          onCancel={() => this.hideModal("delFolder")}
          footer={[
            <Button data-cy="cancel" ghost key="back" onClick={() => this.hideModal("delFolder")}>
              CANCEL
            </Button>,
            <Button data-cy="submit" key="submit" color="primary" onClick={this.deleteSelectedFolder}>
              PROCEED
            </Button>
          ]}
        >
          <p>
            Are you sure? <br /> This will delete the folder but all the tests will remain untouched.
          </p>
        </ConfirmationModal>

        <MoveFolderActionModal
          centered
          title={<ModalTitle>{`Move ${selectedRows.length} item(s) to…`}</ModalTitle>}
          visible={visibleModal.moveFolder}
          onCancel={() => this.hideModal("moveFolder")}
          footer={[
            <FooterCancelButton
              data-cy="cancel"
              key="back"
              variant="create"
              onClick={() => this.hideModal("moveFolder")}
            >
              Cancel
            </FooterCancelButton>,
            <ModalFooterButton data-cy="submit" key="submit" color="primary" variant="create" onClick={this.moveFolder}>
              Move
            </ModalFooterButton>
          ]}
        >
          <FoldersListWrapper>{this.renderFolders()}</FoldersListWrapper>
        </MoveFolderActionModal>

        {selectedRows.length ? (
          <>
            <StyledBoldText>{`${selectedRows.length} item(s) selected`}</StyledBoldText>
            <FolderActionButton
              onClick={() => this.showModal(folders && folders.length === 0 ? "createFolder" : "moveFolder")}
              color="primary"
              icon={<IconFolderMove />}
            >
              Move
            </FolderActionButton>
            {/* <FolderActionButton color="secondary" icon={<IconDuplicate />} onClick={() => {}}>
              DUPLICATE
            </FolderActionButton> */}
          </>
        ) : (
          <>
            <StyledBoldText>Grade</StyledBoldText>
            <Select
              data-cy="grades"
              mode="multiple"
              placeholder="All grades"
              value={grades}
              onChange={this.handleChange("grades")}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
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
            <Select
              data-cy="subjects"
              mode="default"
              placeholder="All subjects"
              value={subject}
              onChange={this.handleChange("subject")}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            <StyledBoldText>Year</StyledBoldText>
            <Select
              data-cy="schoolYear"
              mode="default"
              placeholder="All years"
              value={termId}
              onChange={this.handleChange("termId")}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
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
              data-cy="filter-testType"
              mode="default"
              placeholder="All"
              value={testType}
              onChange={this.handleChange("testType")}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {roleBasedTestType.map(({ value, text }, index) => (
                <Select.Option key={index} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            {userRole === "teacher" && (
              <>
                <StyledBoldText>Class</StyledBoldText>
                <Select
                  data-cy="filter-class"
                  showSearch
                  optionFilterProp="children"
                  mode="default"
                  placeholder="All"
                  value={classId}
                  onChange={this.handleChange("classId")}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Select.Option key={"all"} value={""}>
                    {"All classes"}
                  </Select.Option>
                  {classListActive.map(item => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))}
                  {classListArchive.map(item => (
                    <Select.Option key={item._id} value={item._id}>
                      <span style={{ marginRight: "15px" }}>{item.name}</span>
                      <FontAwesomeIcon icon={faArchive} />
                    </Select.Option>
                  ))}
                </Select>
                <StyledBoldText>Status</StyledBoldText>
                <Select
                  data-cy="filter-status"
                  showSearch
                  optionFilterProp="children"
                  mode="default"
                  placeholder="Select status"
                  value={status}
                  onChange={this.handleChange("status")}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Select.Option key={"all"} value={""}>
                    Select Status
                  </Select.Option>
                  {Object.keys(AssignmentStatus).map(status => (
                    <Select.Option key={status} value={AssignmentStatus[status]}>
                      {AssignmentStatus[status]}
                    </Select.Option>
                  ))}
                </Select>
              </>
            )}

            <NewFolderButton
              data-cy="newFolder"
              onClick={() => this.showModal("newFolder")}
              color="secondary"
              variant="create"
              shadow="none"
              icon={<IconFolderNew />}
            >
              NEW FOLDER
            </NewFolderButton>
            <FoldersListWrapper>{this.renderFolders(true)}</FoldersListWrapper>
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
    folderData: getFolderSelector(state),
    userRole: getUserRole(state),
    classList: getGroupList(state)
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
