import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { lightGreen3, lightGrey3, white, themeColor } from "@edulastic/colors";
import { sum } from "lodash";

const PreviewRubricTable = ({ data, handleChange, rubricFeedback }) => {
  const [selectedRatings, setSelectedRatings] = useState({});

  useEffect(() => {
    if (rubricFeedback) {
      setSelectedRatings(rubricFeedback);
      calculateScore(rubricFeedback);
      handleChange({ score: calculateScore(rubricFeedback), rubricFeedback });
    }
  }, [rubricFeedback]);

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
          onClick={() => handleRatingSelection(criteria.id, rating.id)}
          selected={selectedRatings[criteria.id] == rating.id ? true : false}
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
        <CriteriaWrapper>
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
    <PerfectScrollbar style={{ maxHeight: "500px", padding: "0px 16px", width: "100%" }}>
      <Container>{getContent()}</Container>
    </PerfectScrollbar>
  );
};

export default PreviewRubricTable;

const CriteriaSection = styled.div`
  white-space: normal;
  text-align: left;
  color: #aaafb5;
  > div:first-child {
    margin-bottom: 15px;
    font-weight: ${props => props.theme.bold};
    text-transform: uppercase;
    font-size: 15px;
    padding-left: 15px;
  }
`;

const RatingSection = styled.div`
  max-width: 190px;
  width: 130px;
  min-height: 100px;
  margin-right: 10px;
  display: inline-block;
  padding: 5px 10px;
  white-space: normal;
  vertical-align: top;
  cursor: pointer;
  box-shadow: 0px 2px 5px #00000029;
  border-radius: 2px;
  background: ${({ selected }) => (selected ? lightGreen3 : "inherit")};
  > div:first-child {
    font-weight: ${props => props.theme.semiBold};
    margin-bottom: 5px;
    font-size: 13px;
    text-transform: uppercase;
  }
  .points {
    text-transform: uppercase;
    color: ${themeColor};
    font-size: 16px;
    font-weight: ${props => props.theme.bold};
    margin-bottom: 5px;
  }
`;

const Container = styled.div``;

const CriteriaWrapper = styled.div``;

const RatingScrollContainer = styled(PerfectScrollbar)`
  padding: 2px 3px 23px 3px;
  white-space: nowrap;
`;
