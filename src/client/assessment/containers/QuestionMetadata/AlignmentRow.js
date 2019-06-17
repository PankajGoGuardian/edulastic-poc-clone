import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select } from "antd";
import { pick as _pick, uniq as _uniq } from "lodash";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";
import {
  getFormattedCurriculumsSelector,
  getRecentStandardsListSelector
} from "../../../author/src/selectors/dictionaries";
import { clearDictStandardsAction, updateRecentStandardsAction } from "../../../author/src/actions/dictionaries";
import BrowseButton from "./styled/BrowseButton";
import { ItemBody } from "./styled/ItemBody";
import selectsData from "../../../author/TestPage/components/common/selectsData";
import CustomTreeSelect from "./CustomTreeSelect";
import StandardsModal from "./StandardsModal";
import { alignmentStandardsFromUIToMongo } from "../../utils/helpers";
import StandardTags from "./styled/StandardTags";
import StandardsWrapper from "./styled/StandardsWrapper";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";

const AlignmentRow = ({
  t,
  curriculums,
  getCurriculumStandards,
  curriculumStandardsELO,
  curriculumStandardsTLO,
  alignment,
  alignmentIndex,
  onDelete,
  handleUpdateQuestionAlignment,
  curriculumStandardsLoading,
  editAlignment,
  createUniqGradeAndSubjects,
  formattedCuriculums,
  updateRecentStandardsList,
  recentStandardsList = [],
  clearStandards
}) => {
  const { subject, curriculumId, curriculum, grades, standards = [] } = alignment;
  const [showModal, setShowModal] = useState(false);
  const setSubject = val => {
    storeInLocalStorage("defaultSubject", val);
    editAlignment(alignmentIndex, { subject: val, standards: [], curriculum: "" });
    clearStandards();
  };

  const setGrades = val => {
    storeInLocalStorage("defaultGrades", val);
    editAlignment(alignmentIndex, { grades: val, standards: [] });
  };

  const handleChangeStandard = (curriculum, event) => {
    const curriculumId = event.key;
    editAlignment(alignmentIndex, { curriculumId, curriculum, standards: [] });
  };

  const standardsArr = standards.map(el => el.identifier);

  const handleSearchStandard = searchStr => {
    getCurriculumStandards({ id: curriculumId, grades, searchStr });
  };

  const updateRecentStandards = newStandard => {
    recentStandardsList = recentStandardsList.filter(recentStandard => recentStandard._id !== newStandard._id);
    recentStandardsList.unshift(newStandard);
    if (recentStandardsList.length > 10) {
      recentStandardsList.splice(0, 10);
    }
    updateRecentStandardsList({ recentStandards: recentStandardsList });
    storeInLocalStorage("recentStandards", JSON.stringify(recentStandardsList));
  };

  const handleStandardSelect = (chosenStandardsArr, option) => {
    const newStandard = _pick(option.props.obj, [
      "_id",
      "level",
      "grades",
      "identifier",
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

    data.eloStandards &&
      data.eloStandards.forEach(elo => {
        updateRecentStandards(elo);
      });
    setShowModal(false);
  };

  const handleAddStandard = newStandard => {
    let newStandards = standards.filter(standard => {
      return standard._id !== newStandard._id;
    });
    newStandards = [...newStandards, newStandard];
    let { subject } = alignment;
    if (!subject) {
      const curriculumFromStandard = (option.props.obj || {}).curriculumId
        ? formattedCuriculums.find(curriculum => curriculum.value === option.props.obj.curriculumId)
        : {};
      subject = curriculumFromStandard.subject;
    }
    const alignmentGrades = alignment.grades;
    const standardsGrades = newStandards.flatMap(standard => standard.grades);
    createUniqGradeAndSubjects([...alignmentGrades, ...standardsGrades], subject);
    editAlignment(alignmentIndex, {
      standards: newStandards
    });
    updateRecentStandards(newStandard);
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
      <Row gutter={36}>
        <Col md={20}>
          <Row gutter={1}>
            <Col md={7}>
              <CustomTreeSelect
                data-cy="subjectStandardSet"
                title={`${subject}-${curriculum}-${grades}`}
                style={{ marginTop: 11 }}
              >
                <Fragment>
                  <ItemBody data-cy="subjectItem">
                    <div className="select-label">{t("component.options.subject")}</div>
                    <Select data-cy="subjectSelect" style={{ width: "100%" }} value={subject} onChange={setSubject}>
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
                  style={{ width: "100%" }}
                  placeholder={t("component.options.searchStandards")}
                  filterOption={false}
                  value={standardsArr}
                  onFocus={handleStandardFocus}
                  onSearch={handleSearchStandard}
                  onSelect={handleStandardSelect}
                  onDeselect={handleStandardDeselect}
                >
                  {!curriculumStandardsLoading &&
                    curriculumStandardsELO &&
                    curriculumStandardsELO.length > 0 &&
                    curriculumStandardsELO.map(el => (
                      <Select.Option
                        title="true"
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
              <StandardsWrapper>
                Recently Used:
                {recentStandardsList &&
                  recentStandardsList.map(recentStandard => (
                    <StandardTags
                      onClick={() => {
                        handleAddStandard(recentStandard);
                      }}
                    >
                      {recentStandard.identifier}
                    </StandardTags>
                  ))}
              </StandardsWrapper>
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
    formattedCuriculums: getFormattedCurriculumsSelector(state, props.alignment),
    recentStandardsList: getRecentStandardsListSelector(state)
  }),
  {
    updateRecentStandardsList: updateRecentStandardsAction,
    clearStandards: clearDictStandardsAction
  }
)(AlignmentRow);
