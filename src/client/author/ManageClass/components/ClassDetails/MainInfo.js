import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import * as moment from "moment";
import {
  MainContainer,
  LeftWrapper,
  MidWrapper,
  RightWrapper,
  Image,
  FieldValue,
  FieldLabel,
  StyledDivider,
  ImageContainer,
  ClassInfoContainer,
  FlexDiv
} from "./styled";
import defaultImage from "../../../src/assets/manageclass/abstract.jpg";
import selectsData from "../../../TestPage/components/common/selectsData";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import SubHeader from "./SubHeader";
import { Tag, Row, Col } from "antd";
import { themeColor, white } from "@edulastic/colors";
import { fetchClassListAction } from "../../ducks";

const { allGrades, allSubjects } = selectsData;

const MainInfo = ({
  entity = {},
  fetchClassList,
  viewAssessmentHandler,
  isUserGoogleLoggedIn,
  allowGoogleLogin,
  syncGCModal,
  archiveClass
}) => {
  // eslint-disable-next-line max-len
  const {
    thumbnail,
    tags = [],
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
    parent
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
            syncGCModal={() => setOpenGCModal(true)}
            archiveClass={archiveClass}
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
