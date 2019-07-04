import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Row, Col, Checkbox, Spin } from "antd";
import { Paper, FlexContainer } from "@edulastic/common";
import { StyledModal } from "./styled/StyledModal";
import { Container } from "./styled/Container";
import { TLOList, TLOListItem } from "./styled/TLOList";
import { ELOList } from "./styled/ELOList";
import PopupRowSelect from "./PopupRowSelect";

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
  curriculumStandardsLoading
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
        <PopupRowSelect
          handleChangeStandard={handleChangeStandard}
          handleChangeGrades={handleChangeGrades}
          handleChangeSubject={handleChangeSubject}
          standard={state.standard}
          subject={state.subject}
          grades={state.grades}
          t={t}
        />
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
                    <FlexContainer
                      key={c._id}
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      style={{ marginBottom: 15 }}
                    >
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
  grades: PropTypes.array
};

StandardsModal.defaultProps = {
  subject: "",
  curriculumStandardsELO: [],
  curriculumStandardsTLO: [],
  grades: []
};

export default StandardsModal;
