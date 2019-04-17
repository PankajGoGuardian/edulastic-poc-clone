import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Row, Col, Select, Checkbox, Spin } from "antd";
import { Paper, FlexContainer } from "@edulastic/common";

import { StyledModal } from "./styled/StyledModal";
import selectsData from "../../../author/TestPage/components/common/selectsData";
import { ItemBody } from "./styled/ItemBody";
import { Container } from "./styled/Container";
import { TLOList, TLOListItem } from "./styled/TLOList";
import { ELOList } from "./styled/ELOList";

const StandardsModal = ({
  visible,
  onApply,
  onCancel,
  t,
  standard,
  standards,
  subject,
  grades,
  curriculums,
  curriculumStandardsELO,
  curriculumStandardsTLO,
  getCurriculumStandards,
  curriculumStandardsLoading
}) => {
  const [state, setState] = useState({
    standard,
    eloStandards: standards,
    subject,
    grades
  });
  const [selectedTLO, setSelectedTLO] = useState(curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : "");
  const [filteredStandards, setFilteredStandards] = useState(
    curriculums.filter(c => {
      if (!subject) return curriculums;
      return c.subject === subject;
    })
  );

  useEffect(() => {
    if (curriculumStandardsTLO[0]) setSelectedTLO(curriculumStandardsTLO[0]._id);
  }, [curriculumStandardsTLO]);

  const filteredELO = curriculumStandardsELO.filter(c => c.tloId === selectedTLO);

  const footer = (
    <div>
      <Button onClick={onCancel}>Cancel</Button>
      <Button type="primary" onClick={() => onApply(state)}>
        Apply
      </Button>
    </div>
  );

  const handleChangeStandard = id => {
    const curriculum = curriculums.find(({ _id }) => id === _id);
    setState({ ...state, standard: { id, curriculum: curriculum.curriculum }, eloStandards: [] });
    getCurriculumStandards({ id, grades: state.grades, searchStr: "" });
  };

  const handleChangeGrades = val => {
    setState({ ...state, grades: val, eloStandards: [] });
    getCurriculumStandards({ id: state.standard.id, grades: val, searchStr: "" });
  };

  const handleCheckELO = c => e => {
    if (!state.eloStandards.some(item => item.id === c.id))
      setState({ ...state, eloStandards: [...state.eloStandards, c] });
    else setState({ ...state, eloStandards: [...state.eloStandards].filter(elo => elo.id !== c.id) });
  };

  return (
    <StyledModal title="Select Standards for This Question" visible={visible} onCancel={onCancel} footer={footer}>
      <Paper>
        <Row gutter={24}>
          <Col md={8}>
            <ItemBody>
              <div className="select-label">{t("component.options.subject")}</div>
              <Select
                style={{ width: "100%" }}
                value={state.subject}
                onChange={val => {
                  setState({ ...state, subject: val, eloStandards: [] });
                  setFilteredStandards(curriculums.filter(c => c.subject === val));
                }}
              >
                {selectsData.allSubjects.map(({ text, value }) => (
                  <Select.Option key={value} value={value}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
            </ItemBody>
          </Col>
          <Col md={8}>
            <ItemBody>
              <div className="select-label">{t("component.options.standard")}</div>
              <Select
                style={{ width: "100%" }}
                showSearch
                filterOption
                value={state.standard.id}
                onChange={handleChangeStandard}
              >
                {filteredStandards.map(({ curriculum, _id }) => (
                  <Select.Option key={_id} value={_id}>
                    {curriculum}
                  </Select.Option>
                ))}
              </Select>
            </ItemBody>
          </Col>
          <Col md={8}>
            <ItemBody>
              <div className="select-label">{t("component.options.grade")}</div>
              <Select
                mode="multiple"
                showSearch
                style={{ width: "100%" }}
                value={state.grades}
                onChange={handleChangeGrades}
              >
                {selectsData.allGrades.map(({ text, value }) => (
                  <Select.Option key={text} value={value}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
            </ItemBody>
          </Col>
        </Row>
        <br />
        <Row type="flex" gutter={24}>
          <Spin spinning={curriculumStandardsLoading} size="large">
            <Col md={8} style={{ overflow: "hidden" }}>
              <TLOList>
                {curriculumStandardsTLO.map(({ identifier, description, _id }) => (
                  <TLOListItem
                    title={identifier}
                    description={description}
                    active={_id === selectedTLO}
                    key={_id}
                    onClick={() => setSelectedTLO(_id)}
                  />
                ))}
              </TLOList>
            </Col>
            <Col md={16} style={{ overflow: "hidden" }}>
              <ELOList>
                <Container>
                  {filteredELO.map(c => (
                    <FlexContainer key={c.id} alignItems="flex-start" style={{ marginBottom: 15 }}>
                      <Checkbox
                        onChange={handleCheckELO(c)}
                        checked={state.eloStandards.some(item => item.id === c.id)}
                      />
                      <div>
                        <b>{c.identifier}</b>
                        <div>{c.description}</div>
                      </div>
                    </FlexContainer>
                  ))}
                </Container>
              </ELOList>
            </Col>
          </Spin>
        </Row>
      </Paper>
    </StyledModal>
  );
};

StandardsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onApply: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  curriculums: PropTypes.array.isRequired,
  standard: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  subject: PropTypes.string,
  curriculumStandardsELO: PropTypes.array,
  curriculumStandardsTLO: PropTypes.array,
  grades: PropTypes.array
};

StandardsModal.defaultProps = {
  subject: "",
  curriculumStandardsELO: [],
  curriculumStandardsTLO: [],
  grades: []
};

export default StandardsModal;
