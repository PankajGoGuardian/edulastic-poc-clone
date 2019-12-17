import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { lightGreen3, themeColor, greyScoreCardTitleColor, boxShadowColor3, fadedRed, red } from "@edulastic/colors";
import { sum } from "lodash";

const PreviewRubricTable = ({
  data,
  handleChange,
  rubricFeedback,
  isDisabled = false,
  validateRubricResponse = false
}) => {
  const [selectedRatings, setSelectedRatings] = useState({});

  useEffect(() => {
    if (rubricFeedback) {
      setSelectedRatings(rubricFeedback);
      if (!isDisabled) handleChange({ score: calculateScore(rubricFeedback), rubricFeedback });
    }
  }, [rubricFeedback, isDisabled]);

  const getCriteria = criteria => (
    <CriteriaSection>
      <div>{criteria.name}</div>
    </CriteriaSection>
  );

  const getRatings = criteria => (
    <RatingScrollContainer
      option={{
        suppressScrollY: true,
        useBothWheelAxes: true
      }}
    >
      {criteria.ratings.map(rating => (
        <RatingSection
          onClick={() => !isDisabled && handleRatingSelection(criteria.id, rating.id)}
          selected={selectedRatings[criteria.id] == rating.id ? true : false}
          isDisabled={isDisabled}
        >
          <div>{rating.name}</div>
          <div className="points">{`${rating.points} pts`}</div>
          <div>{rating.desc}</div>
        </RatingSection>
      ))}
    </RatingScrollContainer>
  );

  const getContent = () => {
    return data.criteria.map(c => {
      return (
        <CriteriaWrapper key={c.id} showError={!Object.keys(selectedRatings).includes(c.id) && validateRubricResponse}>
          {getCriteria(c)}
          {getRatings(c)}
        </CriteriaWrapper>
      );
    });
  };

  const handleRatingSelection = (criteriaId, ratingId) => {
    let selectedData = { ...selectedRatings };
    selectedData[criteriaId] = ratingId;
    setSelectedRatings(selectedData);

    handleChange({ score: calculateScore(selectedData), rubricFeedback: selectedData });
  };

  const calculateScore = selectedData => {
    const seletecdPointsArray = Object.keys(selectedData).map(cId => {
      const rId = selectedData[cId];
      return data.criteria.find(({ id }) => id === cId).ratings.find(({ id }) => id === rId).points;
    });

    return sum(seletecdPointsArray);
  };

  return (
    <PerfectScrollbar
      option={{
        suppressScrollX: true
      }}
      style={{ maxHeight: "600px", padding: "0px 16px", width: "100%" }}
    >
      <Container>{getContent()}</Container>
    </PerfectScrollbar>
  );
};

export default PreviewRubricTable;

const CriteriaSection = styled.div`
  white-space: normal;
  text-align: left;
  color: ${greyScoreCardTitleColor};
  > div:first-child {
    margin-bottom: 15px;
    font-weight: ${props => props.theme.bold};
    text-transform: uppercase;
    font-size: ${props => props.theme.questionTextlargeFontSize};
    padding-left: 15px;
  }
`;

const RatingSection = styled.div`
  max-width: 190px;
  min-width: 130px;
  min-height: 100px;
  margin-right: 10px;
  display: inline-block;
  padding: 5px 10px;
  white-space: normal;
  vertical-align: top;
  cursor: ${({ isDisabled }) => (isDisabled ? "default" : "pointer")};
  box-shadow: 0px 2px 5px ${boxShadowColor3};
  border-radius: 2px;
  background: ${({ selected }) => (selected ? lightGreen3 : "inherit")};
  > div:first-child {
    font-weight: ${props => props.theme.semiBold};
    margin-bottom: 5px;
    font-size: ${props => props.theme.questionTextsmallFontSize};
    text-transform: uppercase;
  }
  .points {
    text-transform: uppercase;
    color: ${themeColor};
    font-size: ${props => props.theme.keyboardFontSize};
    font-weight: ${props => props.theme.bold};
    margin-bottom: 5px;
  }
`;

const Container = styled.div`
  padding: 5px 0px;
`;

const CriteriaWrapper = styled.div`
  box-shadow: ${({ showError }) => (showError ? `0px 0px 2px 2px ${fadedRed}` : "none")};
  border: ${({ showError }) => (showError ? `1px solid ${red}` : "none")};
  margin-bottom: 10px;
  border-radius: 8px;
`;

const RatingScrollContainer = styled(PerfectScrollbar)`
  padding: 2px 3px 18px 3px;
  white-space: nowrap;
`;
