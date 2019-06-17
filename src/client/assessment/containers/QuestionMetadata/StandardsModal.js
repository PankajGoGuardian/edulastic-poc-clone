import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Row, Col, Select, Checkbox, Spin } from "antd";
import { Paper, FlexContainer } from "@edulastic/common";
import { connect } from "react-redux";
import { getFormattedCurriculumsSelector } from "../../../author/src/selectors/dictionaries";
import { clearDictStandardsAction } from "../../../author/src/actions/dictionaries";
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
  curriculumStandardsELO,
  curriculumStandardsTLO,
  getCurriculumStandards,
  curriculumStandardsLoading,
  formattedCuriculums,
  editAlignment,
  alignmentIndex,
  clearStandards
}) => {
  const [state, setState] = useState({
    standard,
    eloStandards: standards,
    subject,
    grades
  });
  const [selectedTLO, setSelectedTLO] = useState(curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : "");
  useMemo(() => {
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

  const handleChangeSubject = val => {
    setState(prevState => ({
      ...prevState,
      subject: val,
      eloStandards: [],
      standard: { ...prevState.standard, curriculum: "" }
    }));
    editAlignment(alignmentIndex, { subject: val });
    getCurriculumStandards({ id: "", grades: state.grades, searchStr: "" });
  };

  const handleChangeStandard = (curriculum, event) => {
    const id = event.key;
    setState({ ...state, standard: { id, curriculum }, eloStandards: [] });
    getCurriculumStandards({ id, grades: state.grades, searchStr: "" });
  };

  const handleChangeGrades = val => {
    setState({ ...state, grades: val });
    getCurriculumStandards({ id: state.standard.id, grades: val, searchStr: "" });
  };

  const handleCheckELO = c => {
    if (!state.eloStandards.some(item => item._id === c._id))
      setState({ ...state, eloStandards: [...state.eloStandards, c] });
    else setState({ ...state, eloStandards: [...state.eloStandards].filter(elo => elo._id !== c._id) });
  };

  return (
    <StyledModal title="Select Standards for This Question" visible={visible} onCancel={onCancel} footer={footer}>
      <Paper>
        <Row gutter={24}>
          <Col md={8}>
            <ItemBody>
              <div className="select-label">{t("component.options.subject")}</div>
              <Select style={{ width: "100%" }} value={state.subject} onChange={handleChangeSubject}>
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
          </Col>
          <Col md={8}>
            <ItemBody>
              <div className="select-label">{t("component.options.standardSet")}</div>
              <Select
                style={{ width: "100%" }}
                showSearch
                filterOption
                value={state.standard.curriculum}
                onChange={handleChangeStandard}
              >
                {formattedCuriculums.map(({ value, text, disabled }) => (
                  <Select.Option key={value} value={text} disabled={disabled}>
                    {text}
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
                    <FlexContainer key={c._id} alignItems="flex-start" style={{ marginBottom: 15 }}>
                      <Checkbox
                        onChange={() => handleCheckELO(c)}
                        checked={state.eloStandards.some(item => item._id === c._id)}
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
  grades: PropTypes.array,
  formattedCuriculums: PropTypes.array
};

StandardsModal.defaultProps = {
  subject: "",
  curriculumStandardsELO: [],
  curriculumStandardsTLO: [],
  grades: []
};

export default connect(
  (state, props) => ({
    formattedCuriculums: getFormattedCurriculumsSelector(state, props)
  }),
  {
    clearStandards: clearDictStandardsAction
  }
)(StandardsModal);
