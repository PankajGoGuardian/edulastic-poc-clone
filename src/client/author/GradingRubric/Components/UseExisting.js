import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { sumBy, maxBy } from "lodash";
import { Col, Form, Icon, message, Pagination } from "antd";
import {
  ExistingRubricContainer,
  SearchBar,
  ActionBarContainer,
  PaginationContainer,
  RecentlyUsedContainer,
  TagContainer,
  RubricsTag
} from "../styled";
import produce from "immer";
import { v4 } from "uuid";
import {
  updateRubricDataAction,
  getCurrentRubricDataSelector,
  saveRubricAction,
  updateRubricAction,
  searchRubricsRequestAction,
  getSearchedRubricsListSelector,
  getSearchingStateSelector,
  getTotalSearchedCountSelector,
  deleteRubricAction,
  getRecentlyUsedRubricsSelector,
  addRubricToRecentlyUsedAction
} from "../ducks";
import RubricTable from "./RubricTable";
import ShareModal from "./common/ShareModal";
import DeleteModal from "./common/DeleteModal";
import PreviewRubricModal from "./common/PreviewRubricModal";
import CreateNew from "./CreateNew";
import ConfirmModal from "./common/ConfirmModal";
import { getUserDetails } from "../../../student/Login/ducks";
import { setRubricIdAction, getCurrentQuestionSelector, removeRubricIdAction } from "../../sharedDucks/questions";

const UseExisting = ({
  updateRubricData,
  currentRubricData,
  closeRubricModal,
  actionType,
  user,
  saveRubric,
  updateRubric,
  searchRubricsRequest,
  searchedRubricList,
  searchingState,
  totalSearchedCount,
  associateRubricWithQuestion,
  dissociateRubricFromQuestion,
  currentQuestion,
  deleteRubric,
  recentlyUsedRubrics,
  addRubricToRecentlyUsed
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewRubricModal, setShowPreviewRubricModal] = useState(false);
  const [currentMode, setCurrentMode] = useState("SEARCH");
  const [isEditable, setIsEditable] = useState(actionType === "CREATE NEW" ? true : false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentRubricData?.status) setIsEditable(false);
  }, [currentRubricData?.status]);

  useEffect(() => {
    if (actionType === "VIEW RUBRIC") setCurrentMode("PREVIEW");
  }, []);

  const maxScore = useMemo(() => sumBy(currentRubricData?.criteria, c => maxBy(c?.ratings, "points")?.points), [
    currentRubricData?.criteria
  ]);

  const getContent = () => {
    return (
      <>
        {(!["RUBRIC_TABLE", "SEARCH"].includes(currentMode) || actionType === "CREATE NEW") && (
          <ActionBarContainer>
            {actionType === "USE EXISTING" && currentMode === "PREVIEW" ? (
              <div>
                <span onClick={() => setCurrentMode("RUBRIC_TABLE")}>
                  <Icon type="left" /> <span>Back</span>
                </span>
              </div>
            ) : (
              <div />
            )}
            <div>
              <span onClick={() => setShowPreviewRubricModal(true)}>
                <Icon type="eye" /> Preview
              </span>
              {currentMode === "PREVIEW" && !isEditable && (
                <>
                  {currentQuestion.rubrics?.id !== currentRubricData._id && (
                    <span
                      onClick={() => {
                        associateRubricWithQuestion({
                          metadata: { id: currentRubricData._id, name: currentRubricData.name },
                          maxScore
                        });
                        addRubricToRecentlyUsed(currentRubricData);
                      }}
                    >
                      <Icon type="check" /> <span>Use</span>
                    </span>
                  )}
                  {currentQuestion.rubrics?.id === currentRubricData._id && (
                    <span onClick={() => dissociateRubricFromQuestion()}>
                      <i class="fa fa-minus" aria-hidden="true" /> Remove
                    </span>
                  )}
                  <span onClick={() => handleClone(currentRubricData)}>
                    <i class="fa fa-clone" aria-hidden="true" /> <span>Clone</span>
                  </span>
                  {currentRubricData.createdBy._id === user._id && (
                    <>
                      <span onClick={() => setShowShareModal(true)}>
                        <Icon type="share-alt" /> <span>Share</span>
                      </span>

                      <span onClick={() => handleEditRubric()}>
                        <i class="fa fa-pencil" aria-hidden="true" /> <span>Edit</span>
                      </span>

                      <span onClick={() => setShowDeleteModal(true)}>
                        <i class="fa fa-trash" aria-hidden="true" /> <span>Delete</span>
                      </span>
                    </>
                  )}
                </>
              )}
              {isEditable && (
                <>
                  <span onClick={() => setShowConfirmModal(true)}>
                    <Icon type="close" /> <span>Cancel</span>
                  </span>
                  <span onClick={() => handleSaveRubric("draft")}>
                    <Icon type="save" theme="filled" /> <span>Save</span>
                  </span>
                  <span className="publish" onClick={() => handleSaveRubric("published")}>
                    <i class="fa fa-paper-plane" aria-hidden="true" /> <span>Save & Publish</span>
                  </span>
                </>
              )}
            </div>
          </ActionBarContainer>
        )}

        <ExistingRubricContainer>
          {["RUBRIC_TABLE", "PREVIEW", "SEARCH"].includes(currentMode) && actionType === "USE EXISTING" && (
            <>
              <SearchBar
                placeholder="Search by rubric name or author name"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                loading={searchingState}
              />
              {recentlyUsedRubrics.length > 0 && (
                <RecentlyUsedContainer>
                  <span>Recently Used: </span>
                  <TagContainer>
                    {recentlyUsedRubrics.map(rubric => (
                      <RubricsTag
                        onClick={() => {
                          updateRubricData(rubric);
                          setCurrentMode("PREVIEW");
                          setIsEditable(false);
                        }}
                      >
                        {rubric.name}
                      </RubricsTag>
                    ))}
                  </TagContainer>
                </RecentlyUsedContainer>
              )}
            </>
          )}

          {currentMode === "RUBRIC_TABLE" && (
            <>
              <RubricTable
                handleTableAction={handleTableAction}
                searchedRubricList={searchedRubricList}
                loading={searchingState}
                user={user}
              />
              <PaginationContainer>
                <Pagination
                  current={currentPage}
                  total={totalSearchedCount}
                  pageSize={5}
                  onChange={page => handlePaginationChange(page)}
                  hideOnSinglePage
                />
              </PaginationContainer>
            </>
          )}
          {["CLONE", "PREVIEW", "EDIT"].includes(currentMode) && (
            <CreateNew isEditable={isEditable} handleSaveRubric={() => handleSaveRubric()} />
          )}
          {actionType === "CREATE NEW" && !["CLONE", "PREVIEW", "EDIT"].includes(currentMode) && (
            <CreateNew isEditable={isEditable} handleSaveRubric={() => handleSaveRubric()} />
          )}
        </ExistingRubricContainer>
        {showShareModal && (
          <ShareModal visible={showShareModal} handleResponse={res => handleShareModalResponse(res)} />
        )}
        {showDeleteModal && (
          <DeleteModal visible={showDeleteModal} toggleModal={res => handleDeleteModalResponse(res)} />
        )}
        {showPreviewRubricModal && (
          <PreviewRubricModal
            visible={showPreviewRubricModal}
            toggleModal={() => setShowPreviewRubricModal(false)}
            currentRubricData={currentRubricData}
          />
        )}
        <ConfirmModal visible={showConfirmModal} handleResponse={handleConfirmModalResponse} />
      </>
    );
  };

  const handlePaginationChange = page => {
    setCurrentPage(page);
    searchRubricsRequest({
      limit: 5,
      page: page,
      searchString: searchQuery
    });
    setCurrentMode("RUBRIC_TABLE");
  };

  const handleSaveRubric = type => {
    const { __v, updatedAt, modifiedBy, ...data } = currentRubricData;
    if (currentRubricData.name) {
      if (currentRubricData._id)
        updateRubric({
          ...data,
          status: type
        });
      else
        saveRubric({
          ...currentRubricData,
          status: type
        });

      setCurrentMode("PREVIEW");
    } else message.error("Rubric name cannot be empty.");
  };

  const handleEditRubric = () => {
    updateRubricData({
      ...currentRubricData,
      status: ""
    });
    setIsEditable(true);
    setCurrentMode("EDIT");
  };

  const handleShareModalResponse = (response, value) => {
    setShowShareModal(false);
  };

  const handleDeleteModalResponse = response => {
    if (response === "YES") {
      deleteRubric(currentRubricData._id);
      if (currentQuestion.rubrics) dissociateRubricFromQuestion();
      closeRubricModal();
    }
    setShowDeleteModal(false);
  };

  const handleSearch = value => {
    searchRubricsRequest({
      limit: 5,
      page: currentPage,
      searchString: value
    });
    setCurrentMode("RUBRIC_TABLE");
  };

  const handleTableAction = (actionType, _id) => {
    const rubric = searchedRubricList.find(rubric => rubric._id === _id);
    updateRubricData(rubric);
    if (actionType === "SHARE") setShowShareModal(true);
    else if (actionType === "DELETE") setShowDeleteModal(true);
    else if (actionType === "PREVIEW") {
      setCurrentMode("PREVIEW");
      setIsEditable(false);
    } else if (actionType === "CLONE") handleClone(rubric);
  };

  const handleClone = rubric => {
    const clonedData = produce(rubric, draft => {
      draft.name = `Clone of ${draft.name}`;
      draft.criteria = draft.criteria.map(criteria => {
        return {
          ...criteria,
          id: v4(),
          ratings: criteria.ratings.map(rating => ({
            ...rating,
            id: v4()
          }))
        };
      });
    });
    setIsEditable(true);
    const { name, description, criteria } = clonedData;
    updateRubricData({ name, description, criteria });
    setCurrentMode("CLONE");
  };

  const handleConfirmModalResponse = response => {
    setShowConfirmModal(false);
    if (response === "YES") {
      closeRubricModal();
    }
  };

  return (
    <>
      <Col md={24}>{getContent()}</Col>
    </>
  );
};

const enhance = compose(
  Form.create(),
  connect(
    state => ({
      currentRubricData: getCurrentRubricDataSelector(state),
      user: getUserDetails(state),
      searchedRubricList: getSearchedRubricsListSelector(state),
      searchingState: getSearchingStateSelector(state),
      totalSearchedCount: getTotalSearchedCountSelector(state),
      currentQuestion: getCurrentQuestionSelector(state),
      recentlyUsedRubrics: getRecentlyUsedRubricsSelector(state)
    }),
    {
      updateRubricData: updateRubricDataAction,
      saveRubric: saveRubricAction,
      updateRubric: updateRubricAction,
      searchRubricsRequest: searchRubricsRequestAction,
      associateRubricWithQuestion: setRubricIdAction,
      dissociateRubricFromQuestion: removeRubricIdAction,
      deleteRubric: deleteRubricAction,
      addRubricToRecentlyUsed: addRubricToRecentlyUsedAction
    }
  )
);

export default enhance(UseExisting);
