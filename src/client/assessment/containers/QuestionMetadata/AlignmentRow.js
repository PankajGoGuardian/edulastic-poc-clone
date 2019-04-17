import React, { useState, useEffect, Fragment } from "react";
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
  alignment,
  alignmentIndex,
  onDelete,
  handleUpdateQuestionAlignment,
  curriculumStandardsLoading
}) => {
  const standardsIdentificators = [];
  alignment.domains.forEach(domain => domain.standards.forEach(c => standardsIdentificators.push(c.name)));
  const standardsFromProps = curriculumStandardsELO.filter(c => standardsIdentificators.includes(c.identifier));
  const [subject, setSubject] = useState(alignment.subject);
  const [standards, setStandards] = useState(standardsFromProps);
  const [showModal, setShowModal] = useState(false);
  const [standard, setStandard] = useState({
    curriculum: alignment.curriculum,
    id: alignment.curriculumId
  });
  const [grades, setGrades] = useState(alignment.grades);

  const standardsArr = standards.map(el => el.identifier);

  const filteredStandards = curriculums.filter(c => {
    if (!subject) {
      return curriculums;
    }
    return c.subject === subject;
  });

  const handleSearchStandard = searchStr => {
    getCurriculumStandards({ id: standard.id, grades, searchStr });
  };

  const handleStandardSelect = (chosenStandardsArr, option) => {
    const newStandard = _pick(option.props.obj, [
      "id",
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
    setStandards(newStandards);
  };

  const handleStandardDeselect = removedElement => {
    const newStandards = standards.filter(el => el.identifier !== removedElement);
    setStandards(newStandards);
  };

  const handleApply = data => {
    setSubject(data.subject);
    setStandard(data.standard);
    setGrades(data.grades);
    setStandards(data.eloStandards);

    handleUpdateQuestionAlignment(alignmentIndex, {
      curriculum: data.standard.curriculum,
      curriculumId: data.standard.id,
      subject: data.subject,
      grades: data.grades,
      domains: alignmentStandardsFromUIToMongo([...standards, ...data.eloStandards])
    });

    setShowModal(false);
  };

  const handleChangeStandard = id => {
    const curriculum = curriculums.find(({ _id }) => id === _id);
    setStandard({ id, curriculum: curriculum.curriculum });
    setStandards([]);
  };

  const handleStandardFocus = () => {
    getCurriculumStandards({ id: standard.id, grades, searchStr: "" });
  };

  const handleShowBrowseModal = () => {
    handleStandardFocus();
    setShowModal(true);
  };

  useEffect(() => {
    handleUpdateQuestionAlignment(alignmentIndex, {
      curriculum: standard.curriculum,
      curriculumId: standard.id,
      subject,
      grades,
      domains: alignmentStandardsFromUIToMongo([...standards])
    });
  }, [standard, grades, subject, standards]);

  return (
    <Fragment>
      {showModal && (
        <StandardsModal
          t={t}
          subject={subject}
          grades={grades}
          standards={standards}
          standard={standard}
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
              <CustomTreeSelect
                title={`${subject}-${standard.curriculum}-${grades.toString()}`}
                style={{ marginTop: 11 }}
              >
                <Fragment>
                  <ItemBody>
                    <div className="select-label">{t("component.options.subject")}</div>
                    <Select
                      style={{ width: "100%" }}
                      value={subject}
                      onChange={val => {
                        setSubject(val);
                        setStandards([]);
                      }}
                    >
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
                      value={standard.id}
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
                    <Select
                      mode="multiple"
                      showSearch
                      style={{ width: "100%" }}
                      value={grades}
                      onChange={val => {
                        setGrades(val);
                        setStandards([]);
                      }}
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
                disabled={!standard.id || curriculumStandardsELO.length === 0}
                onClick={handleShowBrowseModal}
              >
                {t("component.options.browse")}
              </BrowseButton>
              <IconTrash onClick={onDelete(alignment.curriculumId)} />
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
  alignment: PropTypes.object.isRequired
};

export default AlignmentRow;
