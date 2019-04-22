import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "antd";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import connect from "react-redux/es/connect/connect";
import { ThemeProvider } from "styled-components";
import _ from "lodash";

import { themes } from "../../themes";

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
  getCurriculumsListSelector,
  getStandardsListSelector,
  standardsSelector,
  getDictionariesAlignmentsSelector
} from "../../../author/src/selectors/dictionaries";

import { Container } from "./styled/Container";
import { ShowAlignmentRowsContainer } from "./styled/ShowAlignmentRowsContainer";
import { AddButtonContainer } from "./styled/AddButtonContainer";
import SecondBlock from "./SecondBlock";
import AlignmentRow from "./AlignmentRow";

const { Title } = Typography;

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
  getCurriculums,
  removeAlignment,
  editAlignment,
  curriculumStandardsLoading
}) => {
  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums();
    }
  }, []);

  const [searchProps, setSearchProps] = useState({ id: "", grades: [], searchStr: "" });

  const handleDelete = curriculumId => () => {
    removeAlignment(curriculumId);
  };

  const handleChangeTags = ({ target: { value } }) => {
    const newQuestionData = {
      ...questionData,
      tags: value.split(",").map(tag => tag.trim())
    };
    setQuestionData(newQuestionData);
  };

  const handleAdd = () => {
    addAlignment(getNewAlignmentState());
  };

  const handleQuestionDataSelect = fieldName => value => {
    const newQuestionData = {
      ...questionData,
      [fieldName]: value
    };
    setQuestionData(newQuestionData);
  };

  const handleUpdateQuestionAlignment = (index, alignment) => {
    const newAlignments = questionData.alignment.map((c, i) => (i === index ? alignment : c));
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

  return (
    <ThemeProvider theme={themes.default}>
      <div>
        <Container>
          <Title level={3}>{t("component.options.addSkillsForQuestion")}</Title>

          <ShowAlignmentRowsContainer>
            {alignment.map((el, index) => (
              <AlignmentRow
                key={index}
                t={t}
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
              />
            ))}
          </ShowAlignmentRowsContainer>

          <AddButtonContainer>
            <Button htmlType="button" type="primary" onClick={handleAdd}>
              <span>{t("component.options.newAligment")}</span>
            </Button>
          </AddButtonContainer>
        </Container>

        <SecondBlock
          t={t}
          depthOfKnowledge={questionData.depthOfKnowledge}
          authorDifficulty={questionData.authorDifficulty}
          tags={questionData.tags}
          onChangeTags={handleChangeTags}
          onQuestionDataSelect={handleQuestionDataSelect}
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
      alignment: getDictionariesAlignmentsSelector(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      setQuestionAlignmentAddRow: setQuestionAlignmentAddRowAction,
      setQuestionAlignmentRemoveRow: setQuestionAlignmentRemoveRowAction,
      setQuestionData: setQuestionDataAction,
      addAlignment: addNewAlignmentAction,
      removeAlignment: removeExistedAlignmentAction,
      editAlignment: updateDictAlignmentAction
    }
  )
);

export default enhance(QuestionMetadata);
