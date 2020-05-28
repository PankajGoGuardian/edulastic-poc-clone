import React, { Fragment } from "react";
import { Button, Cascader, Input, Modal } from "antd";
import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";

import AddEditModuleModal from "./AddEditModuleModal";
import AddUnitModalBody from "./AddUnitModalBody";
import ChangePlaylistModal from "./ChangePlaylistModal";
import RemoveTestModal from "../../../PlaylistPage/components/RemoveTestModal/RemoveTestModal";
import EmbeddedVideoPreviewModal from "../ManageContentBlock/components/EmbeddedVideoPreviewModal";
import DropPlaylistModal from "./DropPlaylistModal";

const CurriculumSequenceModals = ({
  isDesktop,
  isStudent,
  destinationCurriculumSequence,
  showConfirmRemoveModal,
  onCloseConfirmRemoveModal,
  removeTestFromPlaylist,
  isVisibleAddModule,
  closeAddModuleModal,
  handleSavePlaylist,
  moduleForEdit,
  addUnit,
  newUnit,
  handleAddUnit,
  addNewUnitToDestination,
  addCustomContent,
  handleAddCustomContent,
  options1,
  options2,
  curatedStudentPlaylists,
  slicedRecentPlaylists,
  handlePlaylistChange,
  onExplorePlaylists,
  curriculumGuide,
  handleGuideSave,
  handleGuideCancel,
  countModular,
  GridCountInARow,
  fromPlaylist,
  dropPlaylistModalVisible,
  isVideoResourcePreviewModal,
  closeDropPlaylistModal,
  setEmbeddedVideoPreviewModal
}) => (
  <Fragment>
    <RemoveTestModal
      isVisible={showConfirmRemoveModal}
      onClose={onCloseConfirmRemoveModal}
      handleRemove={removeTestFromPlaylist}
    />
    {isVisibleAddModule && (
      <AddEditModuleModal
        isPlaylist={fromPlaylist}
        visible={isVisibleAddModule}
        onClose={closeAddModuleModal}
        handleSavePlaylist={handleSavePlaylist}
        moduleDate={moduleForEdit}
      />
    )}

    <Modal
      visible={addUnit}
      title="Add Unit"
      onOk={handleAddUnit}
      onCancel={handleAddUnit}
      footer={null}
      style={isDesktop ? { minWidth: "640px", padding: "20px" } : { padding: "20px" }}
    >
      <AddUnitModalBody
        destinationCurriculumSequence={destinationCurriculumSequence}
        addNewUnitToDestination={addNewUnitToDestination}
        handleAddUnit={handleAddUnit}
        newUnit={newUnit}
      />
    </Modal>

    <ChangePlaylistModal
      isStudent={isStudent}
      playlists={isStudent ? curatedStudentPlaylists : slicedRecentPlaylists}
      onChange={handlePlaylistChange}
      onExplorePlaylists={onExplorePlaylists}
      activePlaylistId={destinationCurriculumSequence._id}
      visible={curriculumGuide}
      footer={null}
      onOk={handleGuideSave}
      onCancel={handleGuideCancel}
      countModular={countModular}
      GridCountInARow={GridCountInARow}
    />

    <Modal
      visible={addCustomContent}
      title="Add Custom Content"
      onOk={handleAddCustomContent}
      onCancel={handleAddCustomContent}
      footer={null}
      style={isDesktop ? { minWidth: "640px", padding: "20px" } : { padding: "20px" }}
    >
      <ModalBody>
        <ModalLabelWrapper>
          <label>Content Type</label>
          <label>Add to</label>
        </ModalLabelWrapper>
        <ModalInputWrapper>
          <Input.Group compact>
            <Cascader defaultValue={["Lesson"]} options={options2} />
          </Input.Group>
          <Input.Group compact>
            <Cascader defaultValue={["Unit Name"]} options={options1} />
          </Input.Group>
        </ModalInputWrapper>
        <label>Reference #</label>
        <Input />
      </ModalBody>
      <ModalFooter>
        <Button type="primary" ghost key="back" onClick={handleAddCustomContent}>
          CANCEL
        </Button>
        <Button data-cy="save" key="submit" type="primary" onClick={handleAddCustomContent}>
          SAVE
        </Button>
      </ModalFooter>
    </Modal>

    {dropPlaylistModalVisible && (
      <DropPlaylistModal visible={dropPlaylistModalVisible} closeModal={closeDropPlaylistModal} />
    )}
    {isVideoResourcePreviewModal && (
      <EmbeddedVideoPreviewModal
        closeCallback={() => setEmbeddedVideoPreviewModal(false)}
        isVisible={isVideoResourcePreviewModal}
      />
    )}
  </Fragment>
);

export default CurriculumSequenceModals;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  .ant-input:not(.ant-cascader-input) {
    margin-bottom: 20px;
  }
  .ant-input-group {
    width: 48%;
  }
  label {
    font-weight: 600;
    margin-bottom: 10px;
  }
`;

const ModalLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  label {
    width: 48%;
  }
`;

const ModalInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .ant-cascader-picker {
    width: 100%;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 70px;
    padding-right: 70px;
    margin-left: 5px;
    margin-right: 5px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;
