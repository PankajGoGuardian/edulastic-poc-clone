import { find } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import { Col, Divider } from 'antd'
import React, { useEffect } from 'react'
import { EduButton, EduIf } from '@edulastic/common'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import defaultImage from '../../../src/assets/manageclass/abstract.jpg'
import selectsData from '../../../TestPage/components/common/selectsData'
import {
  ClassInfoContainer,
  FieldValue,
  FlexDiv,
  Image,
  ImageContainer,
  MainContainer,
  MidWrapper,
  StyledDivider,
  ViewAssignmentsContainer,
} from './styled'
import SubHeader from './SubHeader'

const { allGrades, allSubjects } = selectsData

const MainInfo = ({
  entity = {},
  fetchClassList,
  viewAssessmentHandler,
  isUserGoogleLoggedIn,
  allowGoogleLogin,
  syncGCModal,
  archiveClass,
  allowCanvasLogin,
  syncCanvasModal,
  setCreateClassTypeDetails,
  onViewAssignmentsClick,
}) => {
  // eslint-disable-next-line max-len
  const {
    type,
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
    canvasCourseName = '',
    canvasCourseSectionName = '',
    active,
  } = entity
  const _grade =
    allGrades
      .filter((item) => grades.includes(item.value))
      .map((item) => ` ${item.text}`) || grades
  const _subject = find(allSubjects, (item) => item.value === subject) || {
    text: subject,
  }

  useEffect(() => {
    // to set the createClassType value as empty object
    return () => {
      setCreateClassTypeDetails({})
    }
  }, [])

  return (
    <div>
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
              selectedClass={entity}
            />
          </FlexDiv>
          <FlexDiv direction="column" style={{ marginTop: '10px' }}>
            <MidWrapper>
              <Col lg={6} md={12}>
                <FieldValue data-cy="classGrades">
                  <div>Grade</div>
                  <span>{`${_grade}`}</span>
                </FieldValue>
              </Col>
              <Col lg={6} md={12}>
                <FieldValue data-cy="classSubject">
                  <div>Subject</div>
                  <span>{_subject.text}</span>
                </FieldValue>
              </Col>
              <Col lg={6} md={12}>
                {type === 'class' && (
                  <FieldValue data-cy="classStandard">
                    <div>Standard</div>
                    {standardSets && standardSets.length ? (
                      <span>
                        {standardSets.map(({ name }) => name).join(', ')}
                      </span>
                    ) : (
                      <span>Other</span>
                    )}
                  </FieldValue>
                )}
              </Col>
              <Col lg={6} md={12}>
                {course && course.name && (
                  <FeaturesSwitch
                    inputFeatures="selectCourse"
                    actionOnInaccessible="hidden"
                    key="selectCourse"
                  >
                    <FieldValue data-cy="classCourse">
                      <div>Course</div>
                      <span>{course && course.name}</span>
                    </FieldValue>
                  </FeaturesSwitch>
                )}
              </Col>
            </MidWrapper>
            <MidWrapper>
              {type === 'class' && (
                <>
                  <Col lg={6} md={12}>
                    <FieldValue data-cy="classStartDate">
                      <div>Start Date</div>
                      <span>{moment(startDate).format('MMM DD, YYYY')}</span>
                    </FieldValue>
                  </Col>
                  <Col lg={6} md={12}>
                    <FieldValue data-cy="classEndDate">
                      <div>End Date</div>
                      <span>{moment(endDate).format('MMM DD, YYYY')}</span>
                    </FieldValue>
                  </Col>
                </>
              )}
            </MidWrapper>
            <MidWrapper>
              <Col lg={12}>
                {type === 'class' && (
                  <>
                    {!!googleId && (
                      <FieldValue>
                        <div>G. Class-code</div>
                        <span>
                          {(googleCode || '').split('.deactivated')[0]}
                        </span>
                      </FieldValue>
                    )}
                  </>
                )}
              </Col>
              <Col lg={12}>
                {!!lastSyncDate && (
                  <FieldValue data-cy="lastSync">
                    <div>Last Sync</div>
                    <span>{moment(lastSyncDate).format('MMM DD, YYYY')}</span>
                  </FieldValue>
                )}
              </Col>
            </MidWrapper>
            <MidWrapper>
              <Col lg={12}>
                {!!canvasCourseSectionName && (
                  <FieldValue data-cy="canvasSection">
                    <div>Canvas Section</div>
                    <span>{canvasCourseSectionName}</span>
                  </FieldValue>
                )}
              </Col>
              <Col lg={12}>
                {type === 'class' && (
                  <FieldValue data-cy="canvasCourse">
                    {!!canvasCourseName && (
                      <>
                        <div>Canvas Course</div>
                        <span>{canvasCourseName}</span>
                      </>
                    )}
                  </FieldValue>
                )}
              </Col>
            </MidWrapper>
          </FlexDiv>
        </ClassInfoContainer>
        <EduIf condition={active}>
          <>
            <Divider type="vertical" style={{ height: 'auto' }} />
            <ViewAssignmentsContainer>
              <EduButton
                type="primary"
                height="30px"
                style={{ marginBottom: '8px' }}
                onClick={onViewAssignmentsClick}
              >
                View Assignments
              </EduButton>
            </ViewAssignmentsContainer>
          </>
        </EduIf>
      </MainContainer>
      <StyledDivider orientation="left" />
    </div>
  )
}

MainInfo.propTypes = {
  entity: PropTypes.object.isRequired,
}

export default MainInfo
