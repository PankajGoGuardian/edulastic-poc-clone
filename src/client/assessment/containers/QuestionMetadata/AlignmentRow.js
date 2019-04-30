import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select } from "antd";
import { pick as _pick, uniq as _uniq } from "lodash";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";
import { getAvailableCurriculumsSelector } from "../../../author/src/selectors/dictionaries";
import { clearDictStandardsAction } from "../../../author/src/actions/dictionaries";
import BrowseButton from "./styled/BrowseButton";
import { ItemBody } from "./styled/ItemBody";
import selectsData from "../../../author/TestPage/components/common/selectsData";
import CustomTreeSelect from "./CustomTreeSelect";
import { IconTrash } from "./styled/IconTrash";
import StandardsModal from "./StandardsModal";
import { alignmentStandardsFromUIToMongo } from "../../utils/helpers";

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
  filteredCurriculums,
  clearStandards
}) => {
  const { subject, curriculumId, curriculum, grades, standards = [] } = alignment;
  const [showModal, setShowModal] = useState(false);

  const setSubject = val => {
    editAlignment(alignmentIndex, { subject: val, standards: [], curriculum: "" });
    clearStandards();
  };

  const setGrades = val => {
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

    const newStandards = [...standards, newStandard];
    let { subject } = alignment;
    if (!subject) {
      const curriculumFromStandard = (option.props.obj || {}).curriculumId
        ? filteredCurriculums.find(curriculum => curriculum._id === option.props.obj.curriculumId)
        : {};
      subject = curriculumFromStandard.subject;
    }
    const alignmentGrades = alignment.grades;
    const standardsGrades = newStandards.flatMap(standard => standard.grades);
    createUniqGradeAndSubjects([...alignmentGrades, ...standardsGrades], subject);
    editAlignment(alignmentIndex, {
      standards: newStandards
    });
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
        ? filteredCurriculums.find(curriculum => curriculum._id === data.standard.id)
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
        <Col md={21}>
          <Row gutter={1}>
            <Col md={6}>
              <CustomTreeSelect title={`${subject}-${curriculum}-${grades}`} style={{ marginTop: 11 }}>
                <Fragment>
                  <ItemBody>
                    <div className="select-label">{t("component.options.subject")}</div>
                    <Select style={{ width: "100%" }} value={subject} onChange={setSubject}>
                      {selectsData.allSubjects.map(({ text, value }) => (
                        <Select.Option key={value} value={value}>
                          {text}
                        </Select.Option>
                      ))}
                    </Select>
                  </ItemBody>
                  <ItemBody>
                    <div className="select-label">{t("component.options.curriculum")}</div>
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      filterOption
                      value={curriculum}
                      onChange={handleChangeStandard}
                    >
                      {filteredCurriculums.map(({ curriculum, name, _id }) =>
                        name ? (
                          <Select.Option key={_id} value={name}>
                            {name}
                          </Select.Option>
                        ) : (
                          <Select.Option key={_id} value={curriculum}>
                            {curriculum}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </ItemBody>
                  <ItemBody>
                    <div className="select-label">{t("component.options.grade")}</div>
                    <Select mode="multiple" showSearch style={{ width: "100%" }} value={grades} onChange={setGrades}>
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
            <Col md={18}>
              <ItemBody>
                <Select
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
            </Col>
          </Row>
        </Col>
        <Col md={3}>
          <ItemBody>
            <FlexContainer>
              <BrowseButton
                disabled={!curriculumId || curriculumStandardsELO.length === 0}
                onClick={handleShowBrowseModal}
              >
                {t("component.options.browse")}
              </BrowseButton>
              <IconTrash onClick={onDelete(curriculumId)} />
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
    filteredCurriculums: getAvailableCurriculumsSelector(state, props.alignment)
  }),
  {
    clearStandards: clearDictStandardsAction
  }
)(AlignmentRow);
