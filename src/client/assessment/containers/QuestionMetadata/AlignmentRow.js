import React, { useState, useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select } from "antd";
import { pick as _pick } from "lodash";
import { FlexContainer } from "@edulastic/common";

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
  alignment: { subject, curriculumId, curriculum, grades, standards },
  alignment,
  alignmentIndex,
  onDelete,
  handleUpdateQuestionAlignment,
  curriculumStandardsLoading,
  editAlignment
}) => {
  const [showModal, setShowModal] = useState(false);

  const setSubject = val => {
    editAlignment(alignmentIndex, { subject: val, standards: [] });
  };

  const setGrades = val => {
    editAlignment(alignmentIndex, { grades: val, standards: [] });
  };

  const handleChangeStandard = id => {
    const curriculum = curriculums.find(({ _id }) => id === _id);
    editAlignment(alignmentIndex, { curriculumId: id, curriculum: curriculum.curriculum, standards: [] });
  };

  const standardsArr = standards.map(el => el.identifier);

  const filteredStandards = curriculums.filter(c => {
    if (!subject) {
      return curriculums;
    }
    return c.subject === subject;
  });

  const handleSearchStandard = searchStr => {
    getCurriculumStandards({ id: curriculumId, grades: grades, searchStr });
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
    editAlignment(alignmentIndex, { standards: newStandards });
  };

  const handleStandardDeselect = removedElement => {
    const newStandards = standards.filter(el => el.identifier !== removedElement);
    editAlignment(alignmentIndex, { standards: newStandards });
  };

  const handleApply = data => {
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
    getCurriculumStandards({ id: curriculumId, grades: grades, searchStr: "" });
  };

  const handleShowBrowseModal = () => {
    handleStandardFocus();
    setShowModal(true);
  };

  useMemo(() => {
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
          standard={{ curriculum: curriculum, id: curriculumId }}
          visible={showModal}
          curriculums={curriculums}
          onApply={handleApply}
          setSubject={setSubject}
          onCancel={() => setShowModal(false)}
          curriculumStandardsELO={curriculumStandardsELO}
          curriculumStandardsTLO={curriculumStandardsTLO}
          getCurriculumStandards={getCurriculumStandards}
          curriculumStandardsLoading={curriculumStandardsLoading}
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
                    <div className="select-label">{t("component.options.standard")}</div>
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      filterOption
                      value={curriculumId}
                      onChange={handleChangeStandard}
                    >
                      {filteredStandards.map(({ curriculum, _id }) => (
                        <Select.Option key={_id} value={_id}>
                          {curriculum}
                        </Select.Option>
                      ))}
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
                        title
                        key={el.identifier}
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
  addAlignment: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  curriculums: PropTypes.array.isRequired,
  curriculumStandardsELO: PropTypes.array.isRequired,
  curriculumStandardsTLO: PropTypes.array.isRequired,
  alignment: PropTypes.object.isRequired,
  editAlignment: PropTypes.func.isRequired
};

export default AlignmentRow;
