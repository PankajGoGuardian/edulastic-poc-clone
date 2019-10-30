import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select } from "antd";
import { pick as _pick, uniq as _uniq, get } from "lodash";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";
import {
  getFormattedCurriculumsSelector,
  getRecentStandardsListSelector
} from "../../../author/src/selectors/dictionaries";
import BrowseButton from "./styled/BrowseButton";
import { ItemBody } from "./styled/ItemBody";
import selectsData from "../../../author/TestPage/components/common/selectsData";
import CustomTreeSelect from "./CustomTreeSelect";
import StandardsModal from "./StandardsModal";
import { alignmentStandardsFromUIToMongo } from "../../utils/helpers";
import { storeInLocalStorage, removeFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../../student/Login/ducks";
import { getDefaultGradesSelector, getDefaultSubjectSelector } from "../../../author/src/selectors/user";
import { updateDefaultCurriculumAction } from "../../../author/src/actions/dictionaries";
import RecentStandardsList from "./RecentStandardsList";

const AlignmentRow = ({
  t,
  curriculums,
  getCurriculumStandards,
  curriculumStandardsELO,
  curriculumStandardsTLO,
  alignment,
  alignmentIndex,
  qId,
  onDelete,
  handleUpdateQuestionAlignment,
  curriculumStandardsLoading,
  editAlignment,
  createUniqGradeAndSubjects,
  formattedCuriculums,
  defaultGrades,
  updateDefaultCurriculum,
  defaultSubject,
  defaultCurriculumId,
  defaultCurriculumName,
  updateDefaultGrades,
  updateDefaultSubject,
  interestedCurriculums,
  recentStandardsList = [],
  isDocBased = false
}) => {
  let {
    subject = "Mathematics",
    curriculumId = "d6ec0d994eaf3f4c805c8011",
    curriculum = "Math - Common Core",
    grades = ["7"],
    standards = []
  } = alignment;
  const [showModal, setShowModal] = useState(false);
  const setSubject = val => {
    updateDefaultSubject(val);
    storeInLocalStorage("defaultSubject", val);
    removeFromLocalStorage("defaultCurriculumId");
    removeFromLocalStorage("defaultCurriculumName");
    updateDefaultCurriculum({ defaultCurriculumId: "", defaultCurriculumName: "" });
    editAlignment(alignmentIndex, { subject: val, curriculum: "" });
  };

  const setGrades = val => {
    updateDefaultGrades(val);
    storeInLocalStorage("defaultGrades", val);
    editAlignment(alignmentIndex, { grades: val });
  };

  const handleChangeStandard = (curriculum, event) => {
    const curriculumId = event.key;
    storeInLocalStorage("defaultCurriculumId", curriculumId);
    storeInLocalStorage("defaultCurriculumName", curriculum);
    updateDefaultCurriculum({ defaultCurriculumId: curriculumId, defaultCurriculumName: curriculum });
    editAlignment(alignmentIndex, { curriculumId, curriculum });
  };

  const standardsArr = standards.map(el => el.identifier);

  const handleSearchStandard = searchStr => {
    getCurriculumStandards({ id: curriculumId, grades, searchStr });
  };

  const handleStandardSelect = (chosenStandardsArr, option) => {
    const newStandard = _pick(option.props.obj, [
      "_id",
      "level",
      "grades",
      "identifier",
      "tloIdentifier",
      "tloId",
      "tloDescription",
      "eloId",
      "subEloId",
      "description"
    ]);

    handleAddStandard(newStandard);
  };

  const handleStandardDeselect = removedElement => {
    const newStandards = standards.filter(el => el.identifier !== removedElement);
    editAlignment(alignmentIndex, { standards: newStandards });
  };

  const handleApply = data => {
    const gradesFromElo = data.eloStandards.flatMap(elo => elo.grades);
    let { subject } = data;
    if (!subject) {
      const curriculumFromStandard = data.standard.id
        ? formattedCuriculums.find(curriculum => curriculum.value === data.standard.id)
        : {};
      subject = curriculumFromStandard.subject;
    }
    createUniqGradeAndSubjects([...data.grades, ...gradesFromElo], subject);
    editAlignment(alignmentIndex, {
      subject: data.subject,
      curriculum: data.standard.curriculum,
      curriculumId: data.standard.id,
      grades: data.grades,
      standards: data.eloStandards
    });

    setShowModal(false);
  };

  const handleAddStandard = newStandard => {
    let newStandards = standards.some(standard => {
      return standard._id === newStandard._id;
    });
    if (newStandards) {
      newStandards = standards.filter(standard => standard._id !== newStandard._id);
    } else {
      newStandards = [...standards, newStandard];
    }
    const standardsGrades = newStandards.flatMap(standard => standard.grades);
    createUniqGradeAndSubjects([...grades, ...standardsGrades], subject);
    editAlignment(alignmentIndex, {
      standards: newStandards
    });
  };

  const handleStandardFocus = () => {
    getCurriculumStandards({ id: curriculumId, grades, searchStr: "" });
  };

  const handleShowBrowseModal = () => {
    handleStandardFocus();
    setShowModal(true);
  };

  useEffect(() => {
    handleUpdateQuestionAlignment(alignmentIndex, {
      curriculum,
      curriculumId,
      subject,
      grades,
      domains: alignmentStandardsFromUIToMongo([...standards])
    });
  }, [alignment]);

  useEffect(() => {
    const { grades: alGrades, subject: alSubject, curriculum: alCurriculum, curriculumId: alCurriculumId } = alignment;
    if (!alCurriculumId) {
      if (defaultSubject && defaultCurriculumId) {
        editAlignment(alignmentIndex, {
          subject: defaultSubject,
          curriculum: defaultCurriculumName,
          curriculumId: defaultCurriculumId,
          grades: defaultGrades || []
        });
      } else if (interestedCurriculums && interestedCurriculums.length > 0) {
        editAlignment(alignmentIndex, {
          subject: interestedCurriculums[0].subject,
          curriculum: interestedCurriculums[0].name,
          curriculumId: interestedCurriculums[0]._id,
          grades: interestedCurriculums[0].grades || []
        });
      } else {
        editAlignment(alignmentIndex, {
          subject: "Mathematics",
          curriculumId: "d6ec0d994eaf3f4c805c8011",
          curriculum: "Math - Common Core",
          grades: ["7"],
          standards: []
        });
      }
    }
  }, [qId]);
  return (
    <Fragment>
      {showModal && (
        <StandardsModal
          t={t}
          subject={subject}
          grades={grades}
          standards={standards}
          standard={{ curriculum, id: curriculumId }}
          visible={showModal}
          curriculums={curriculums}
          onApply={handleApply}
          setSubject={setSubject}
          onCancel={() => setShowModal(false)}
          curriculumStandardsELO={curriculumStandardsELO}
          curriculumStandardsTLO={curriculumStandardsTLO}
          getCurriculumStandards={getCurriculumStandards}
          curriculumStandardsLoading={curriculumStandardsLoading}
          editAlignment={editAlignment}
          alignmentIndex={alignmentIndex}
        />
      )}
      <Row gutter={isDocBased ? 0 : 36}>
        <Col md={20}>
          <Row gutter={1}>
            <Col md={7}>
              <CustomTreeSelect
                data-cy="subjectStandardSet"
                title={`${curriculum}${curriculum && grades.length ? " - " : ""}${grades.length ? "Grade - " : ""}${
                  grades.length ? grades : ""
                }`}
                style={{ marginTop: 11 }}
              >
                <Fragment>
                  <ItemBody data-cy="subjectItem">
                    <div className="select-label">{t("component.options.subject")}</div>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      data-cy="subjectSelect"
                      style={{ width: "100%" }}
                      value={subject}
                      onChange={setSubject}
                    >
                      {selectsData.allSubjects.map(({ text, value }) =>
                        value ? (
                          <Select.Option key={value} value={value}>
                            {text}
                          </Select.Option>
                        ) : (
                          ""
                        )
                      )}
                    </Select>
                  </ItemBody>
                  <ItemBody data-cy="standardItem">
                    <div className="select-label">{t("component.options.standardSet")}</div>
                    <Select
                      data-cy="standardSetSelect"
                      style={{ width: "100%" }}
                      showSearch
                      filterOption
                      value={curriculum}
                      onChange={handleChangeStandard}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {formattedCuriculums.map(({ value, text, disabled }) => (
                        <Select.Option key={value} value={text} disabled={disabled}>
                          {text}
                        </Select.Option>
                      ))}
                    </Select>
                  </ItemBody>
                  <ItemBody data-cy="gradeItem">
                    <div className="select-label">{t("component.options.grade")}</div>
                    <Select
                      data-cy="gradeSelect"
                      mode="multiple"
                      showSearch
                      style={{ width: "100%" }}
                      value={grades}
                      onChange={setGrades}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {selectsData.allGrades.map(({ text, value }) => (
                        <Select.Option key={text} value={value}>
                          {text}
                        </Select.Option>
                      ))}
                    </Select>
                  </ItemBody>
                </Fragment>
              </CustomTreeSelect>
            </Col>
            <Col md={17}>
              <ItemBody data-cy="searchStandardSelectItem">
                <Select
                  data-cy="searchStandardSelect"
                  mode="multiple"
                  style={{ width: "90%", margin: "auto", display: "block" }}
                  placeholder={t("component.options.searchStandards")}
                  filterOption={false}
                  value={standardsArr}
                  optionLabelProp="title"
                  onFocus={handleStandardFocus}
                  onSearch={handleSearchStandard}
                  onSelect={handleStandardSelect}
                  onDeselect={handleStandardDeselect}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  {!curriculumStandardsLoading &&
                    curriculumStandardsELO &&
                    curriculumStandardsELO.length > 0 &&
                    curriculumStandardsELO.map(el => (
                      <Select.Option
                        title={el.identifier}
                        key={el._id}
                        value={el.identifier}
                        obj={el}
                        style={{ whiteSpace: "normal" }}
                      >
                        <div>
                          <div>
                            <b>{el.identifier}</b>
                          </div>
                          <div
                            className="selected-item-desctiption"
                            dangerouslySetInnerHTML={{ __html: el.description }}
                          />
                        </div>
                      </Select.Option>
                    ))}
                </Select>
              </ItemBody>
              {recentStandardsList && recentStandardsList.length > 0 && !isDocBased && (
                <RecentStandardsList
                  recentStandardsList={recentStandardsList}
                  standardsArr={standardsArr}
                  handleAddStandard={handleAddStandard}
                />
              )}
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <ItemBody>
            <FlexContainer>
              <BrowseButton onClick={handleShowBrowseModal}>{t("component.options.browse")}</BrowseButton>
            </FlexContainer>
          </ItemBody>
        </Col>
        {recentStandardsList && recentStandardsList.length > 0 && isDocBased && (
          <Col xs={24}>
            <RecentStandardsList
              isDocBased
              recentStandardsList={recentStandardsList}
              standardsArr={standardsArr}
              handleAddStandard={handleAddStandard}
            />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};

AlignmentRow.propTypes = {
  t: PropTypes.func.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  curriculums: PropTypes.array.isRequired,
  curriculumStandardsELO: PropTypes.array.isRequired,
  curriculumStandardsTLO: PropTypes.array.isRequired,
  alignment: PropTypes.object.isRequired,
  editAlignment: PropTypes.func.isRequired
};

export default connect(
  (state, props) => ({
    defaultCurriculumId: get(state, "dictionaries.defaultCurriculumId"),
    defaultCurriculumName: get(state, "dictionaries.defaultCurriculumName"),
    formattedCuriculums: getFormattedCurriculumsSelector(state, props.alignment),
    defaultGrades: getDefaultGradesSelector(state),
    defaultSubject: getDefaultSubjectSelector(state),
    recentStandardsList: getRecentStandardsListSelector(state)
  }),
  {
    updateDefaultCurriculum: updateDefaultCurriculumAction,
    updateDefaultSubject: updateDefaultSubjectAction,
    updateDefaultGrades: updateDefaultGradesAction
  }
)(AlignmentRow);
