import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import * as moment from "moment";
import { MainContainer, LeftWrapper, MidWrapper, RightWrapper, Image, FieldValue } from "./styled";
import defaultImage from "../../../src/assets/manageclass/abstract.jpg";
import selectsData from "../../../TestPage/components/common/selectsData";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

const { allGrades, allSubjects } = selectsData;

const MainInfo = ({ entity = {} }) => {
  // eslint-disable-next-line max-len
  const {
    thumbnail,
    tags = [],
    grade,
    subject,
    googleId,
    lastSyncDate,
    standardSets = [],
    course = {},
    startDate,
    endDate,
    googleCode,
    owners = [],
    parent
  } = entity;
  const _grade = find(allGrades, item => item.value === grade) || { text: grade };
  const _subject = find(allSubjects, item => item.value === subject) || { text: subject };
  const coTeachers =
    owners &&
    owners
      .filter(owner => owner.id !== parent.id)
      .map(owner => owner.name)
      .join(",");
  const gradeSubject = { grades: grade, subjects: subject };
  return (
    <MainContainer>
      <LeftWrapper>
        <Image src={thumbnail || defaultImage} alt="Class" />
        <FieldValue>
          <label>Tags :</label>
          {tags && tags.map((tag, index) => <span key={index}>{tag}</span>)}
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
          {standardSets && standardSets.length ? (
            standardSets.map(({ name, _id }) => <span key={_id}>{name}</span>)
          ) : (
            <span>Other</span>
          )}
        </FieldValue>
        <FeaturesSwitch inputFeatures="selectCourse" actionOnInaccessible="hidden" key="selectCourse">
          <FieldValue>
            <div>Course :</div>
            <span>{course && course.name}</span>
          </FieldValue>
        </FeaturesSwitch>
        <FeaturesSwitch
          inputFeatures="addCoTeacher"
          actionOnInaccessible="hidden"
          key="addCoTeacher"
          gradeSubject={gradeSubject}
        >
          <FieldValue>
            <div>Co-Teachers :</div>
            <span>{coTeachers}</span>
          </FieldValue>
        </FeaturesSwitch>
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
        {!!googleId && (
          <>
            <FieldValue>
              <div>Google Class-code :</div>
              <span>{googleCode}</span>
            </FieldValue>
            <FieldValue>
              <div>Last Sync :</div>
              <span>{moment(lastSyncDate).format("MMM DD, YYYY")}</span>
            </FieldValue>
          </>
        )}
      </RightWrapper>
    </MainContainer>
  );
};

MainInfo.propTypes = {
  entity: PropTypes.object.isRequired
};

export default MainInfo;
