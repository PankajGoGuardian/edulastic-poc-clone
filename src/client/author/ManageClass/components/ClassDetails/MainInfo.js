import { find } from "lodash";
import * as moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import defaultImage from "../../../src/assets/manageclass/abstract.jpg";
import selectsData from "../../../TestPage/components/common/selectsData";
import {
  ClassInfoContainer,
  FieldValue,
  FlexDiv,
  Image,
  ImageContainer,
  MainContainer,
  MidWrapper,
  RightWrapper,
  StyledDivider
} from "./styled";
import SubHeader from "./SubHeader";

const { allGrades, allSubjects } = selectsData;

const MainInfo = ({
  entity = {},
  fetchClassList,
  viewAssessmentHandler,
  isUserGoogleLoggedIn,
  allowGoogleLogin,
  syncGCModal,
  archiveClass,
  allowCanvasLogin,
  syncCanvasModal
}) => {
  // eslint-disable-next-line max-len
  const {
    thumbnail,
    grades = [],
    subject,
    googleId,
    lastSyncDate,
    standardSets = [],
    course = {},
    startDate,
    endDate,
    googleCode,
    owners = [],
    parent,
    canvasCourseName = "",
    canvasCourseSectionName = ""
  } = entity;
  const _grade = allGrades.filter(item => grades.includes(item.value)).map(item => ` ${item.text}`) || grades;
  const _subject = find(allSubjects, item => item.value === subject) || { text: subject };
  const coTeachers =
    owners &&
    owners
      .filter(owner => owner.id !== parent.id)
      .map(owner => owner.name)
      .join(",");
  const gradeSubject = { grades, subjects: subject };
  return (
    <MainContainer>
      <ImageContainer>
        <Image src={thumbnail || defaultImage} alt="Class" />
      </ImageContainer>
      <ClassInfoContainer>
        <FlexDiv>
          <SubHeader
            {...entity}
            fetchClassList={fetchClassList}
            viewAssessmentHandler={viewAssessmentHandler}
            isUserGoogleLoggedIn={isUserGoogleLoggedIn}
            allowGoogleLogin={allowGoogleLogin}
            syncGCModal={syncGCModal}
            archiveClass={archiveClass}
            allowCanvasLogin={allowCanvasLogin}
            syncCanvasModal={syncCanvasModal}
          />
        </FlexDiv>
        <StyledDivider orientation="left" />
        <FlexDiv>
          <MidWrapper>
            <FieldValue>
              <div>Grade</div>
              <span>{`${_grade}`}</span>
            </FieldValue>
            <FieldValue>
              <div>Subject</div>
              <span>{_subject.text}</span>
            </FieldValue>
            <FieldValue>
              <div>Standard</div>
              {standardSets && standardSets.length ? (
                <span>{standardSets.map(({ name }) => name).join(", ")}</span>
              ) : (
                <span>Other</span>
              )}
            </FieldValue>
            <FeaturesSwitch inputFeatures="selectCourse" actionOnInaccessible="hidden" key="selectCourse">
              <FieldValue>
                <div>Course</div>
                <span>{course && course.name}</span>
              </FieldValue>
            </FeaturesSwitch>
            {coTeachers && coTeachers.length ? (
              <FeaturesSwitch
                inputFeatures="addCoTeacher"
                actionOnInaccessible="hidden"
                key="addCoTeacher"
                gradeSubject={gradeSubject}
              >
                <FieldValue>
                  <div>Co-Teachers</div>
                  <span>{coTeachers}</span>
                </FieldValue>
              </FeaturesSwitch>
            ) : (
              ""
            )}
          </MidWrapper>
          <RightWrapper>
            <FieldValue>
              <div>Start Date</div>
              <span>{moment(startDate).format("MMM DD, YYYY")}</span>
            </FieldValue>
            <FieldValue>
              <div>End Date</div>
              <span>{moment(endDate).format("MMM DD, YYYY")}</span>
            </FieldValue>
            {!!googleId && (
              <>
                <FieldValue>
                  <div>G. Class-code</div>
                  <span>{googleCode}</span>
                </FieldValue>
                <FieldValue>
                  <div>Last Sync</div>
                  <span>{moment(lastSyncDate).format("MMM DD, YYYY")}</span>
                </FieldValue>
              </>
            )}

            {!!canvasCourseName && (
              <FieldValue>
                <div>Canvas Course</div>
                <span>{canvasCourseName}</span>
              </FieldValue>
            )}
            {!!canvasCourseSectionName && (
              <FieldValue>
                <div>Canvas Section</div>
                <span>{canvasCourseSectionName}</span>
              </FieldValue>
            )}
            {!!lastSyncDate && (
              <FieldValue>
                <div>Last Sync</div>
                <span>{moment(lastSyncDate).format("MMM DD, YYYY")}</span>
              </FieldValue>
            )}
          </RightWrapper>
        </FlexDiv>
      </ClassInfoContainer>
    </MainContainer>
  );
};

MainInfo.propTypes = {
  entity: PropTypes.object.isRequired
};

export default MainInfo;
