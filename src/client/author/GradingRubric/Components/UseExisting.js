import { faClone, faMinus, faPaperPlane, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Form, Icon, message, Pagination } from "antd";
import produce from "immer";
import { maxBy, sumBy, uniqBy, debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { v4 } from "uuid";
import { CustomStyleBtn } from "../../../assessment/styled/ButtonStyles";
import { getUserDetails } from "../../../student/Login/ducks";
import { setItemLevelScoreFromRubricAction } from "../../ItemDetail/ducks";
import { getCurrentQuestionSelector, removeRubricIdAction, setRubricIdAction } from "../../sharedDucks/questions";
import {
  addRubricToRecentlyUsedAction,
  deleteRubricAction,
  getCurrentRubricDataSelector,
  getRecentlyUsedRubricsSelector,
  getSearchedRubricsListSelector,
  getSearchingStateSelector,
  getTotalSearchedCountSelector,
  saveRubricAction,
  searchRubricsRequestAction,
  updateRubricAction,
  updateRubricDataAction
} from "../ducks";
import {
  ActionBarContainer,
  ExistingRubricContainer,
  PaginationContainer,
  RecentlyUsedContainer,
  RubricsTag,
  SearchBar,
  TagContainer
} from "../styled";
import ConfirmModal from "./common/ConfirmModal";
import DeleteModal from "./common/DeleteModal";
import PreviewRubricModal from "./common/PreviewRubricModal";
import ShareModal from "./common/ShareModal";
import CreateNew from "./CreateNew";
import RubricTable from "./RubricTable";

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
  addRubricToRecentlyUsed,
  setItemLevelScoring
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewRubricModal, setShowPreviewRubricModal] = useState(false);
  const [currentMode, setCurrentMode] = useState("SEARCH");
  const [isEditable, setIsEditable] = useState(actionType === "CREATE NEW" || false);
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

  const handlePaginationChange = page => {
    setCurrentPage(page);
    searchRubricsRequest({
      limit: 5,
      page,
      searchString: searchQuery
    });
    setCurrentMode("RUBRIC_TABLE");
  };

  const validateRubric = () => {
    let isValid = true;
    if (currentRubricData.name && isValid) {
      currentRubricData.criteria.every(criteria => {
        if (criteria.name && isValid) {
          const uniqueRatings = [];
          criteria.ratings.every(rating => {
            if (rating.name) {
              if (!uniqueRatings.includes(rating.points)) uniqueRatings.push(parseFloat(rating.points));
            } else {
              isValid = false;
              message.error("Rating name cannot be empty.");
            }
            return isValid;
          });
          if (isValid && uniqueRatings.includes(NaN)) {
            isValid = false;
            message.error("Rating point must not be empty.");
          }
          if (isValid && !uniqueRatings.includes(0)) {
            isValid = false;
            message.error("Rating point must be 0 for at least one rating within a criteria.");
          }
          if (isValid && !uniqueRatings.find(p => p > 0)) {
            isValid = false;
            message.error("Rating point must be more than 0 for atleast one rating within a criteria");
          }
        } else {
          isValid = false;
          message.error("Criteria name cannot be empty.");
        }
        return isValid;
      });
      if (isValid) {
        const uniqueCriteriaArray = uniqBy(currentRubricData.criteria, "name");
        if (uniqueCriteriaArray.length < currentRubricData.criteria.length) {
          isValid = false;
          message.error("Criteria names should be unique.");
        }
      }
    } else {
      isValid = false;
      message.error("Rubric name cannot be empty.");
    }
    return isValid;
  };

  const handleSaveRubric = type => {
    const isValid = validateRubric();
    const { __v, updatedAt, modifiedBy, ...data } = currentRubricData;

    if (isValid) {
      if (currentRubricData._id) {
        updateRubric({
          rubricData: {
            ...data,
            status: type
          },
          maxScore
        });
        // if (currentQuestion.rubrics?._id === currentRubricData._id)
        //   associateRubricWithQuestion({
        //     metadata: { _id: currentRubricData._id, name: currentRubricData.name },
        //     maxScore
        //   });
      } else
        saveRubric({
          rubricData: {
            ...currentRubricData,
            status: type
          },
          maxScore
        });

      setCurrentMode("PREVIEW");
    }
  };

  const handleUseRubric = () => {
    associateRubricWithQuestion({
      metadata: { _id: currentRubricData._id, name: currentRubricData.name },
      maxScore
    });
    addRubricToRecentlyUsed(currentRubricData);
    setItemLevelScoring(false);
  };

  const handleEditRubric = () => {
    updateRubricData({
      ...currentRubricData,
      status: ""
    });
    setIsEditable(true);
    setCurrentMode("EDIT");
  };

  const handleShareModalResponse = () => {
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

  const handleSearch = debounce(value => {
    searchRubricsRequest({
      limit: 5,
      page: currentPage,
      searchString: value
    });
    setCurrentMode("RUBRIC_TABLE");
  }, 500);

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

  const handleConfirmModalResponse = response => {
    setShowConfirmModal(false);
    if (response === "YES") {
      closeRubricModal();
    }
  };

  const btnStyle = {
    width: "auto",
    margin: "0px 0px 0px 10px"
  };

  const getContent = () => (
    <>
      {(!["RUBRIC_TABLE", "SEARCH"].includes(currentMode) || actionType === "CREATE NEW") && (
        <ActionBarContainer>
          <div>
            {actionType === "USE EXISTING" && currentMode === "PREVIEW" && (
              <CustomStyleBtn style={btnStyle} onClick={() => setCurrentMode("RUBRIC_TABLE")}>
                <Icon type="left" /> <span>Back</span>
              </CustomStyleBtn>
            )}
            {currentMode === "PREVIEW" && !isEditable && (
              <>
                <CustomStyleBtn style={btnStyle} onClick={() => handleClone(currentRubricData)}>
                  <FontAwesomeIcon icon={faClone} aria-hidden="true" /> <span>Clone</span>
                </CustomStyleBtn>
                {currentRubricData.createdBy._id === user._id && (
                  <>
                    <CustomStyleBtn style={btnStyle} onClick={() => handleEditRubric()}>
                      <FontAwesomeIcon icon={faPencilAlt} aria-hidden="true" /> <span>Edit</span>
                    </CustomStyleBtn>

                    <CustomStyleBtn style={btnStyle} onClick={() => setShowDeleteModal(true)}>
                      <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" /> <span>Delete</span>
                    </CustomStyleBtn>
                  </>
                )}
              </>
            )}
          </div>
          <div>
            <CustomStyleBtn style={btnStyle} onClick={() => setShowPreviewRubricModal(true)}>
              <Icon type="eye" /> Preview
            </CustomStyleBtn>
            {currentMode === "PREVIEW" && !isEditable && (
              <>
                {currentQuestion.rubrics?._id !== currentRubricData._id && (
                  <CustomStyleBtn style={btnStyle} onClick={handleUseRubric}>
                    <Icon type="check" /> <span>Use</span>
                  </CustomStyleBtn>
                )}
                {currentQuestion.rubrics?._id === currentRubricData._id && (
                  <CustomStyleBtn style={btnStyle} onClick={() => dissociateRubricFromQuestion()}>
                    <FontAwesomeIcon icon={faMinus} aria-hidden="true" /> Remove
                  </CustomStyleBtn>
                )}
                {currentRubricData.createdBy._id === user._id && (
                  <>
                    <CustomStyleBtn style={btnStyle} onClick={() => setShowShareModal(true)}>
                      <Icon type="share-alt" /> <span>Share</span>
                    </CustomStyleBtn>
                  </>
                )}
              </>
            )}
            {isEditable && (
              <>
                <CustomStyleBtn style={btnStyle} onClick={() => setShowConfirmModal(true)}>
                  <Icon type="close" />
                  <span>Cancel</span>
                </CustomStyleBtn>
                <CustomStyleBtn style={btnStyle} onClick={() => handleSaveRubric("published")}>
                  {/* <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" /> */}
                  <Icon type="save" theme="filled" />
                  <span>Save & Use</span>
                </CustomStyleBtn>
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
              onChange={e => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
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
      {showShareModal && <ShareModal visible={showShareModal} handleResponse={res => handleShareModalResponse(res)} />}
      {showDeleteModal && <DeleteModal visible={showDeleteModal} toggleModal={res => handleDeleteModalResponse(res)} />}
      {showPreviewRubricModal && (
        <PreviewRubricModal
          visible={showPreviewRubricModal}
          toggleModal={() => setShowPreviewRubricModal(false)}
          currentRubricData={currentRubricData}
          shouldValidate={false}
        />
      )}
      <ConfirmModal visible={showConfirmModal} handleResponse={handleConfirmModalResponse} />
    </>
  );

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
      addRubricToRecentlyUsed: addRubricToRecentlyUsedAction,
      setItemLevelScoring: setItemLevelScoreFromRubricAction
    }
  )
);

export default enhance(UseExisting);
