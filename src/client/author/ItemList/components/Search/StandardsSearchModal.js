import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Row, Col, Select, Checkbox, Modal } from "antd";
import styled from "styled-components";
import { Paper, FlexContainer } from "@edulastic/common";

import { getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { ELOList } from "../../../../assessment/containers/QuestionMetadata/styled/ELOList";
import { TLOList, TLOListItem } from "../../../../assessment/containers/QuestionMetadata/styled/TLOList";

const StandardsSearchModal = ({ standardsList, showModal, setShowModal, standardIds = [], handleApply }) => {
  const { elo: curriculumStandardsELO, tlo: curriculumStandardsTLO } = standardsList;
  const [eloStandards, setEloStandards] = useState(standardIds);
  const [selectedTLO, setSelectedTLO] = useState(curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : "");
  useEffect(() => {
    if (curriculumStandardsTLO[0]) setSelectedTLO(curriculumStandardsTLO[0]._id);
  }, [curriculumStandardsTLO]);
  const filteredELO = curriculumStandardsELO.filter(c => c.tloId === selectedTLO);
  const handleCheckELO = c => {
    if (!eloStandards.some(item => item === c._id)) setEloStandards([...eloStandards, c._id]);
    else setEloStandards(eloStandards.filter(elo => elo !== c._id));
  };
  const footer = (
    <div>
      <Button onClick={() => setShowModal(false)}>Cancel</Button>
      <Button type="primary" onClick={() => handleApply(eloStandards)}>
        Apply
      </Button>
    </div>
  );
  return (
    <Modal
      title="Select Standards for This Question"
      visible={showModal}
      onCancel={() => setShowModal(false)}
      footer={footer}
      width={"80%"}
    >
      <Row type="flex" gutter={24}>
        <StandardsWrapper md={8}>
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
        </StandardsWrapper>
        <StandardsWrapper md={16}>
          <ELOList>
            <Container>
              {filteredELO.map(c => (
                <FlexContainer key={c._id} alignItems="flex-start" justifyContent="flex-start" marginBottom={"15px"}>
                  <Checkbox onChange={() => handleCheckELO(c)} checked={eloStandards.some(item => item === c._id)} />
                  <div>
                    <b>{c.identifier}</b>
                    <div dangerouslySetInnerHTML={{ __html: c.description }} />
                  </div>
                </FlexContainer>
              ))}
            </Container>
          </ELOList>
        </StandardsWrapper>
      </Row>
    </Modal>
  );
};

export default connect(
  state => ({ standardsList: getStandardsListSelector(state) }),
  null
)(StandardsSearchModal);

const Container = styled(Paper)`
  width: 100%;
  margin-bottom: 20px;
  box-shadow: none;
`;

const StandardsWrapper = styled(Col)`
  overflow: hidden;
`;
