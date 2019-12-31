import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import connect from "react-redux/es/connect/connect";
import { ThemeProvider } from "styled-components";
import _ from "lodash";
import { Subtitle } from "../../styled/Subtitle";
import { themes } from "../../../theme";
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
  addNewAlignmentAction,
  removeExistedAlignmentAction,
  updateDictAlignmentAction
} from "../../../author/src/actions/dictionaries";
import {
  setQuestionAlignmentAddRowAction,
  setQuestionAlignmentRemoveRowAction,
  setQuestionDataAction,
  getQuestionDataSelector
} from "../../../author/QuestionEditor/ducks";

import {
  getCollectionsSelector,
  setCollectionsAction,
  getHighlightCollectionSelector
} from "../../../author/ItemDetail/ducks";

import {
  getCurriculumsListSelector,
  getStandardsListSelector,
  standardsSelector,
  getDictionariesAlignmentsSelector,
  getRecentCollectionsListSelector
} from "../../../author/src/selectors/dictionaries";

import { Container } from "./styled/Container";
import { ShowAlignmentRowsContainer } from "./styled/ShowAlignmentRowsContainer";
import SecondBlock from "./SecondBlock";
import AlignmentRow from "./AlignmentRow";
import {
  getInterestedCurriculumsSelector,
  getOrgDataSelector,
  getUserFeatures
} from "../../../author/src/selectors/user";
import { getAllTagsAction, getAllTagsSelector, addNewTagAction } from "../../../author/TestPage/ducks";
import { withMathFormula } from "@edulastic/common/src/HOC/withMathFormula";

const getNewAlignmentState = () => ({
  curriculum: "",
  curriculumId: "",
  subject: "",
  grades: [],
  domains: []
});

const QuestionMetadata = ({
  t,
  alignment,
  questionData,
  setQuestionData,
  addAlignment,
  curriculumStandards,
  getCurriculumStandards,
  curriculums,
  getAllTags,
  allTagsData,
  addNewTag,
  getCurriculums,
  removeAlignment,
  interestedCurriculums,
  editAlignment,
  curriculumStandardsLoading,
  setCollections,
  collections,
  orgData,
  userFeatures,
  highlightCollection,
  recentCollectionsList
}) => {
  const [searchProps, setSearchProps] = useState({ id: "", grades: [], searchStr: "" });
  const { id: qId, grades: selectedGrades = [], subjects: selectedSubjects = [] } = questionData;

  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums();
    }
    getAllTags({ type: "testitem" });
  }, []);

  const handleDelete = curriculumId => () => {
    removeAlignment(curriculumId);
  };

  const handleChangeTags = tags => {
    const newQuestionData = {
      ...questionData,
      tags
    };
    setQuestionData(newQuestionData);
  };

  const handleQuestionDataSelect = fieldName => value => {
    const newQuestionData = {
      ...questionData,
      [fieldName]: value
    };
    if ((fieldName === "authorDifficulty" || fieldName === "depthOfKnowledge") && value === "") {
      delete newQuestionData[fieldName];
    }
    setQuestionData(newQuestionData);
  };

  const handleCollectionsSelect = (value, options) => {
    let _value = options.map(i => ({ _id: i.props.value, name: i.props.title }));
    setCollections(_value);
  };

  const handleRecentCollectionsSelect = collectionItem => {
    let _collections = collections.map(o => ({ ...o }));
    _collections = [..._collections, collectionItem];
    setCollections(_collections);
  };

  const handleUpdateQuestionAlignment = (index, alignment) => {
    const newAlignments = (questionData.alignment || []).map((c, i) => (i === index ? alignment : c));
    if (!newAlignments.length) {
      newAlignments.push(alignment);
    }
    const newQuestionData = {
      ...questionData,
      alignment: newAlignments
    };
    setQuestionData(newQuestionData);
  };

  const searchCurriculumStandards = searchObject => {
    if (!_.isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject);
      getCurriculumStandards(searchObject.id, searchObject.grades, searchObject.searchStr);
    }
  };

  const createUniqGradeAndSubjects = (grades, subject) => {
    const uniqGrades = _.uniq([...grades, ...selectedGrades]).filter(item => !!item);
    const uniqSubjects = _.uniq([subject, ...selectedSubjects]).filter(item => !!item);
    setQuestionData({ ...questionData, grades: uniqGrades, subjects: uniqSubjects });
  };

  return (
    <ThemeProvider theme={themes.default}>
      <div>
        <Container padding="20px">
          <Subtitle>{t("component.options.addSkillsForQuestion")}</Subtitle>

          <ShowAlignmentRowsContainer>
            {alignment.map((el, index) => (
              <AlignmentRow
                key={index}
                t={t}
                qId={qId}
                alignmentIndex={index}
                handleUpdateQuestionAlignment={handleUpdateQuestionAlignment}
                alignment={el}
                curriculums={curriculums}
                getCurriculumStandards={searchCurriculumStandards}
                onDelete={handleDelete}
                curriculumStandardsELO={curriculumStandards.elo}
                curriculumStandardsTLO={curriculumStandards.tlo}
                curriculumStandardsLoading={curriculumStandardsLoading}
                editAlignment={editAlignment}
                interestedCurriculums={interestedCurriculums}
                createUniqGradeAndSubjects={createUniqGradeAndSubjects}
              />
            ))}
          </ShowAlignmentRowsContainer>
        </Container>

        <SecondBlock
          t={t}
          depthOfKnowledge={questionData.depthOfKnowledge}
          authorDifficulty={questionData.authorDifficulty}
          tags={questionData.tags}
          allTagsData={allTagsData}
          addNewTag={addNewTag}
          onChangeTags={handleChangeTags}
          onQuestionDataSelect={handleQuestionDataSelect}
          handleCollectionsSelect={handleCollectionsSelect}
          handleRecentCollectionsSelect={handleRecentCollectionsSelect}
          collections={collections}
          orgData={orgData}
          userFeatures={userFeatures}
          highlightCollection={highlightCollection}
          recentCollectionsList={recentCollectionsList}
        />
      </div>
    </ThemeProvider>
  );
};

QuestionMetadata.propTypes = {
  getCurriculums: PropTypes.func.isRequired,
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })
  ).isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  curriculumStandardsLoading: PropTypes.bool.isRequired,
  alignment: PropTypes.arrayOf(
    PropTypes.shape({
      curriculumId: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      standards: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          level: PropTypes.string.isRequired,
          identifier: PropTypes.string.isRequired,
          tloId: PropTypes.string,
          eloId: PropTypes.string,
          subEloId: PropTypes.string
        })
      )
    })
  ).isRequired,
  questionData: PropTypes.shape({
    depthOfKnowledge: PropTypes.string,
    authorDifficulty: PropTypes.string
  }).isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  addAlignment: PropTypes.func.isRequired,
  removeAlignment: PropTypes.func.isRequired,
  editAlignment: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      curriculums: getCurriculumsListSelector(state),
      curriculumStandardsLoading: standardsSelector(state).loading,
      curriculumStandards: getStandardsListSelector(state),
      questionData: getQuestionDataSelector(state),
      allTagsData: getAllTagsSelector(state, "testitem"),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      alignment: getDictionariesAlignmentsSelector(state),
      collections: getCollectionsSelector(state),
      orgData: getOrgDataSelector(state),
      userFeatures: getUserFeatures(state),
      highlightCollection: getHighlightCollectionSelector(state),
      recentCollectionsList: getRecentCollectionsListSelector(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      setQuestionAlignmentAddRow: setQuestionAlignmentAddRowAction,
      setQuestionAlignmentRemoveRow: setQuestionAlignmentRemoveRowAction,
      setQuestionData: setQuestionDataAction,
      addAlignment: addNewAlignmentAction,
      removeAlignment: removeExistedAlignmentAction,
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      editAlignment: updateDictAlignmentAction,
      setCollections: setCollectionsAction
    }
  )
);

export default enhance(withMathFormula(QuestionMetadata));
