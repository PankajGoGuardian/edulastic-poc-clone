import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon } from "antd";
import { v4 } from "uuid";
import produce from "immer";
import {
  CriteriaContainer,
  CriteriaDetails,
  AddRatingSection,
  RatingSection,
  DuplicateCriteria,
  DeleteCriteria,
  CiteriaActionsContainer,
  CriteriaHeader,
  RatingWrapper
} from "../styled";
import Rating from "./Rating";
import TextInput from "./common/TextInput";
import { updateRubricDataAction, getCurrentRubricDataSelector } from "../ducks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CustomStyleBtn } from "../../../assessment/styled/ButtonStyles";

const Criteria = ({ data, id, currentRubricData, updateRubricData, isEditable, className }) => {
  let scrollBarRef;
  let intervalId = null;
  const generateRatingData = index => ({
    name: `Rating ${index}`,
    desc: "",
    id: v4(),
    points: index - 1
  });

  const getRatings = () =>
    data.ratings.map((rating, index, arr) => (
      <Rating
        key={rating.id}
        id={rating.id}
        parentId={id}
        data={rating}
        isEditable={isEditable}
        className={index + 1 === arr.length ? "last-rating" : ""}
      />
    ));

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    scrollToRight();
  }, [data.ratings.length]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  });

  const scrollToRight = () => {
    let diff =
      scrollBarRef._container.scrollWidth - scrollBarRef._container.clientWidth - scrollBarRef._container.scrollLeft;
    if (diff) {
      let incrementValue = diff / 40;
      intervalId = setInterval(() => {
        if (diff > 0 && scrollBarRef) {
          diff = diff - incrementValue;
          if (diff <= 0)
            scrollBarRef._container.scrollLeft =
              scrollBarRef._container.scrollWidth - scrollBarRef._container.clientWidth;
          else scrollBarRef._container.scrollLeft = scrollBarRef._container.scrollLeft + incrementValue;
        } else clearInterval(intervalId);
      }, 20);
    }
  };

  const handleAddRating = () => {
    const clonedRubricData = produce(currentRubricData, draft => {
      draft.criteria.find(c => c.id === id).ratings.push(generateRatingData(data.ratings.length + 1));
    });
    updateRubricData(clonedRubricData);
  };

  const handleDuplicate = () => {
    const copyData = {
      ...data,
      id: v4(),
      ratings: data.ratings.map(rating => ({
        ...rating,
        id: v4()
      }))
    };

    const updatedRubricData = produce(currentRubricData, draft => {
      draft.criteria.push(copyData);
    });
    updateRubricData(updatedRubricData);
  };

  const handleDelete = () => {
    const updatedRubricData = produce(currentRubricData, draft => {
      const criteria = draft.criteria.filter(c => c.id !== id);
      draft.criteria = criteria;
    });
    updateRubricData(updatedRubricData);
  };

  return (
    <CriteriaContainer isEditable={isEditable}>
      <CriteriaHeader>
        <CriteriaDetails>
          <div>
            <TextInput
              id={id}
              isEditable={isEditable}
              textType="text"
              componentFor="Criteria"
              value={data.name}
              width="100%"
            />
          </div>
        </CriteriaDetails>
        <CiteriaActionsContainer>
          {isEditable && (
            <CustomStyleBtn margin="0px" title="Clone" onClick={handleDuplicate}>
              <FontAwesomeIcon icon={faClone} aria-hidden="true" />
              Clone Criteria
            </CustomStyleBtn>
          )}
          {currentRubricData.criteria.length > 1 && isEditable && (
            <DeleteCriteria className="delete-critera-button" title="Delete" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
            </DeleteCriteria>
          )}
        </CiteriaActionsContainer>
      </CriteriaHeader>
      <RatingWrapper>
        <RatingSection
          isEditable={isEditable}
          ref={ref => {
            scrollBarRef = ref;
          }}
          option={{
            suppressScrollY: true,
            useBothWheelAxes: true
          }}
        >
          {getRatings()}
        </RatingSection>
        {isEditable && (
          <AddRatingSection>
            <div className="add-rating-button" onClick={handleAddRating}>
              <span>
                <Icon type="plus" />
              </span>
              <span>Add Rating</span>
            </div>
          </AddRatingSection>
        )}
      </RatingWrapper>
    </CriteriaContainer>
  );
};

export default connect(
  state => ({
    currentRubricData: getCurrentRubricDataSelector(state)
  }),
  {
    updateRubricData: updateRubricDataAction
  }
)(Criteria);
