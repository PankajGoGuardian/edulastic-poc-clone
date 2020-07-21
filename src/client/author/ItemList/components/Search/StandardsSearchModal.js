import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Modal } from "antd";
import styled from "styled-components";
import { Paper, FlexContainer, MathFormulaDisplay, CheckboxLabel, EduButton } from "@edulastic/common";

import { getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { ELOList, EloText } from "../../../../assessment/containers/QuestionMetadata/styled/ELOList";
import { TLOList, TLOListItem } from "../../../../assessment/containers/QuestionMetadata/styled/TLOList";
import StandardSearchModalHeader from "./StandardSearchModalHeader";

const StandardsSearchModal = ({
  standardsList,
  showModal,
  setShowModal,
  standardIds = [],
  handleApply,
  itemCount,
  selectedCurriculam
}) => {
  const { elo: curriculumStandardsELO, tlo: curriculumStandardsTLO } = standardsList;
  const [eloStandards, setEloStandards] = useState([]);
  const [selectedTLO, setSelectedTLO] = useState(curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : "");

  useEffect(() => {
    if (curriculumStandardsTLO[0]) setSelectedTLO(curriculumStandardsTLO[0]._id);
  }, [curriculumStandardsTLO]);

  const filteredELO = curriculumStandardsELO
    .filter(c => c.tloId === selectedTLO)
    .sort((a, b) => {
      // if tloIdentifier dont match fallback to ascending order sort
      if (a.tloIdentifier !== b.tloIdentifier) return a.identifier - b.identifier;

      // extract numeric substring from identifier
      const aSubIdentifier = a.identifier.substring(a.tloIdentifier.length + 1);
      const bSubIdentifier = b.identifier.substring(b.tloIdentifier.length + 1);

      return parseInt(aSubIdentifier, 10) - parseInt(bSubIdentifier, 10);
    });
  const currentEloIds = filteredELO.map(item => item._id) || [];
  const numberOfSelected = standardIds.filter(std => currentEloIds.includes(std))?.length || 0;
  const isSelectAll = numberOfSelected === filteredELO.length;
  const isIndeterminate = numberOfSelected > 0 && !isSelectAll;

  const handleCheckELO = c => {
    let standards = [];
    if (!standardIds.some(item => item === c._id)) {
      standards = [...standardIds, c._id];
      setEloStandards([...eloStandards, c._id]);
    } else {
      standards = standardIds.filter(elo => elo !== c._id);
      setEloStandards(eloStandards.filter(elo => elo !== c._id));
    }
    handleApply(standards);
  };

  const handleCancel = () => {
    const prevStandards = standardIds.filter(id => !eloStandards.includes(id));
    handleApply(prevStandards);
    setShowModal(false);
  };

  const toggleSelectAll = () => {
    const selectItems = [];
    const unSelectItems = [];
    for (const elo of filteredELO) {
      if (standardIds.includes(elo._id)) {
        unSelectItems.push(elo._id);
      } else {
        selectItems.push(elo._id);
      }
    }
    let standards = [];
    if (unSelectItems.length === filteredELO.length) {
      standards = standardIds.filter(item => !unSelectItems.includes(item));
    } else {
      standards = [...standardIds, ...selectItems];
    }
    setEloStandards(standards);
    handleApply(standards);
  };
  const footer = (
    <>
      <StyledCounterWrapper>
        <span>{itemCount}</span>&nbsp;Items found matching your criteria
      </StyledCounterWrapper>
      <FlexContainer>
        <EduButton isGhost onClick={handleCancel}>
          Cancel
        </EduButton>
        <EduButton type="primary" onClick={() => setShowModal(false)}>
          Apply
        </EduButton>
      </FlexContainer>
    </>
  );
  const selectedStandards = curriculumStandardsELO.filter(f => standardIds.includes(f._id));

  const title = <StandardSearchModalHeader standards={selectedStandards} selectedCurriculam={selectedCurriculam} />;
  const selectedTLOData = curriculumStandardsTLO.find(item => item._id === selectedTLO);
  return (
    <StyledModal title={title} visible={showModal} onCancel={() => setShowModal(false)} footer={footer} width="80%">
      <Row type="flex" gutter={24}>
        <Col md={8} />
        <Col md={16} style={{ paddingLeft: "28px" }}>
          <FlexContainer alignItems="flex-start" justifyContent="flex-start" marginBottom="15px" padding="0px ">
            <CheckboxLabel onChange={toggleSelectAll} checked={isSelectAll} indeterminate={isIndeterminate} />
            <EloText>All {selectedTLOData.identifier} Standards</EloText>
          </FlexContainer>
        </Col>
      </Row>
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
                <FlexContainer key={c._id} alignItems="flex-start" justifyContent="flex-start" marginBottom="15px">
                  <CheckboxLabel
                    onChange={() => handleCheckELO(c)}
                    checked={standardIds.some(item => item === c._id)}
                  />
                  <EloText>
                    <b>{c.identifier}</b>
                    <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: c.description }} />
                  </EloText>
                </FlexContainer>
              ))}
            </Container>
          </ELOList>
        </StandardsWrapper>
      </Row>
    </StyledModal>
  );
};

export default connect(
  state => ({ standardsList: getStandardsListSelector(state) }),
  null
)(StandardsSearchModal);

const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: flex;
    justify-content: space-between;
    padding: 15px 25px;
    border: none;
  }
  .ant-modal-header {
    border: none;
    padding: 25px;
  }
  .ant-modal-body {
    padding: 0px 24px 24px 24px;
  }
  .ant-modal-header {
    padding: 25px 25px 15px 25px;
  }
`;

const StyledCounterWrapper = styled.div`
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  color: black;
  span {
    font-weight: bold;
  }
`;

const Container = styled(Paper)`
  width: 100%;
  margin-bottom: 20px;
  box-shadow: none;
`;

const StandardsWrapper = styled(Col)`
  overflow: hidden;
`;
