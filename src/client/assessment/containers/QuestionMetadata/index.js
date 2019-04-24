import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Typography, Select } from "antd";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import connect from "react-redux/es/connect/connect";
import { ThemeProvider } from "styled-components";
import _ from "lodash";

import { themes } from "../../themes";

import selectsData from "../../../author/TestPage/components/common/selectsData";
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
import { CustomSelect } from "./styled/SubjectAndGradeSelect";
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
  const [searchProps, setSearchProps] = useState({ id: "", grades: [], searchStr: "" });
  const [selectedSubjects, setSelectSubject] = useState([]);
  const [selectedGrades, setSelectGrade] = useState([]);

  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums();
    }
  }, []);

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
    const newAlignments = (questionData.alignment || []).map((c, i) => (i === index ? alignment : c));
    const subjects = selectedSubjects;
    const grades = selectedGrades;
    const newQuestionData = {
      ...questionData,
      alignment: newAlignments,
      subjects,
      grades
    };
    setQuestionData(newQuestionData);
  };

  const searchCurriculumStandards = searchObject => {
    if (!_.isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject);
      getCurriculumStandards(searchObject.id, searchObject.grades, searchObject.searchStr);
    }
  };

  const handleSubjectsChange = value => {
    setSelectSubject(value);
    const subjects = value;
    const newQuestionData = {
      ...questionData,
      subjects
    };
    setQuestionData(newQuestionData);
  };

  const handleGradesChange = value => {
    setSelectGrade(value);
    const grades = value;
    const newQuestionData = {
      ...questionData,
      grades
    };
    setQuestionData(newQuestionData);
  };

  const createUniqGrades = (grades, alignmentIndex) => {
    const uniqGrades = _.uniq([...grades, ...selectedGrades]);
    setSelectGrade(uniqGrades);
    editAlignment(alignmentIndex, { grades: uniqGrades });
  };

  const createUniqSubjects = (subject, alignmentIndex) => {
    const uniqSubjects = _.uniq([subject, ...selectedSubjects]).filter(item => !!item);
    setSelectSubject(uniqSubjects);
    editAlignment(alignmentIndex, { subject });
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
                onCreateUniqSubjects={createUniqSubjects}
                onCreateUniqGrades={createUniqGrades}
              />
            ))}
          </ShowAlignmentRowsContainer>

          <AddButtonContainer autoheight={true}>
            <Button htmlType="button" type="primary" onClick={handleAdd}>
              <span>{t("component.options.newAligment")}</span>
            </Button>
            <CustomSelect
              mode="multiple"
              placeholder="Select Grades"
              key="grade"
              defaultValue={[]}
              value={selectedGrades}
              onChange={handleGradesChange}
            >
              {selectsData.allGrades.map(grade => (
                <Select.Option key={grade.value} value={grade.value}>
                  {grade.text}
                </Select.Option>
              ))}
            </CustomSelect>
            <CustomSelect
              mode="multiple"
              placeholder="Select Subjects"
              key="subject"
              defaultValue={[]}
              value={selectedSubjects}
              onChange={handleSubjectsChange}
            >
              {selectsData.allSubjects.map(
                subject =>
                  subject.value && (
                    <Select.Option key={subject.value} value={subject.value}>
                      {subject.text}
                    </Select.Option>
                  )
              )}
            </CustomSelect>
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
