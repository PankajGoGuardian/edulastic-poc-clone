import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import * as moment from "moment";
import { MainContainer, LeftWrapper, MidWrapper, RightWrapper, Image, FieldValue } from "./styled";
import defaultImage from "../../../src/assets/manageclass/abstract.jpg";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const MainInfo = ({ entity = {} }) => {
  // eslint-disable-next-line max-len
  const {
    thumbnail,
    tags,
    grade,
    subject,
    standardSets = [],
    course = {},
    startDate,
    endDate,
    owners,
    primaryTeacherId
  } = entity;
  const _grade = find(allGrades, item => item.value === grade) || { text: grade };
  const _subject = find(allSubjects, item => item.value === subject) || { text: subject };
  const coTeachers = owners
    .map(owner => {
      if (owner.id !== primaryTeacherId) {
        return owner.name;
      }
    })
    .join(",");

  return (
    <MainContainer>
      <LeftWrapper>
        <Image src={thumbnail || defaultImage} alt="Class" />
        <FieldValue>
          <label>Tags :</label>
          {tags !== undefined && tags.map((tag, index) => <span key={index}>{tag}</span>)}
        </FieldValue>
      </LeftWrapper>
      <MidWrapper>
        <FieldValue>
          <div>Grade :</div>
          <span>{_grade.text}</span>
        </FieldValue>
        <FieldValue>
          <div>Subject :</div>
          <span>{_subject.text}</span>
        </FieldValue>
        <FieldValue>
          <div>Standard :</div>
          {standardSets.map(({ name, _id }) => (
            <span key={_id}>{name}</span>
          ))}
        </FieldValue>
        <FieldValue>
          <div>Course :</div>
          <span>{course.name}</span>
        </FieldValue>
        <FieldValue>
          <div>Co-Teachers :</div>
          <span>{coTeachers}</span>
        </FieldValue>
      </MidWrapper>
      <RightWrapper>
        <FieldValue>
          <div>Start Date :</div>
          <span>{moment(startDate).format("MMM DD, YYYY")}</span>
        </FieldValue>
        <FieldValue>
          <div>End Date :</div>
          <span>{moment(endDate).format("MMM DD, YYYY")}</span>
        </FieldValue>
      </RightWrapper>
    </MainContainer>
  );
};

MainInfo.propTypes = {
  entity: PropTypes.object.isRequired
};

export default MainInfo;
