import React, { useState } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// hoc
import { withNamespaces } from '@edulastic/localization'

// components
import { Button, Col, Input, Modal, Row, Spin } from 'antd'
import {
  MainHeader,
  EduButton,
  MainContentWrapper,
  notification,
  EduIf,
} from '@edulastic/common'
import { IconPlus, IconManage } from '@edulastic/icons'
import {
  smallDesktopWidth,
  themeColor,
  white,
  themeColorBlue,
} from '@edulastic/colors'
import ShowActiveClass from '../../sharedComponents/ShowActiveClasses'
import { StudentSlectCommon } from '../../sharedComponents/ClassSelector'
import { NoDataBox } from '../../styled'
import ClassCard from './CardContainer'
import NoDataIcon from '../../assets/nodata.svg'

// constants

const ClassCards = ({ classList, t }) => {
  const cards = classList.map((classItem) => (
    <ClassCard key={classItem._id} classItem={classItem} t={t} />
  ))
  return cards
}

const ManageClassContainer = ({
  t,
  classList,
  loading,
  showClass,
  joinClass,
  studentData,
  showActiveClass,
  allClassList,
  setClassList,
  setShowClass,
  userRole,
  proxyUserRole,
  districtPolicies,
}) => {
  const isManualEnrollmentAllowed = districtPolicies.some(
    ({ manualEnrollmentAllowed }) => manualEnrollmentAllowed
  )
  const activeClasses = classList.filter((c) => c.active === 1)
  const [isJoinClassModalVisible, setJoinClassModal] = useState(false)
  const [classCode, setClassCode] = useState(null)
  const code = classList.map((_code) => _code.code)
  const joinClassHandler = () => {
    if (code.includes(classCode)) {
      notification({ messageKey: 'classAlreadyExist' })
      return
    }
    const { email, firstName, lastName, middleName, role } = studentData
    if (classCode && classCode.trim().length) {
      joinClass({ classCode, email, firstName, role, lastName, middleName })
    } else {
      setClassCode('')
    }
  }
  const closeModalHandler = () => {
    setJoinClassModal(false)
    setClassCode(null)
  }
  const isParentRoleProxy = proxyUserRole === 'parent'

  const isJoinClassBtnVisible = !isParentRoleProxy && isManualEnrollmentAllowed
  if (loading) return <Spin />
  return (
    <>
      <MainHeader
        Icon={IconManage}
        headingText={t('header:common.myClassTitle')}
      >
        {userRole === 'parent' ? (
          <StudentSlectCommon />
        ) : (
          <EduIf condition={isJoinClassBtnVisible}>
            <JoinClassBtn
              isGhost
              isBlue
              data-cy="joinclass"
              onClick={() => setJoinClassModal(true)}
            >
              <IconPlus width={12} height={12} color="white" stroke="white" />
              <span>{t('common.joinClass')}</span>
            </JoinClassBtn>
          </EduIf>
        )}
        {isJoinClassModalVisible && (
          <JoinClassModal
            visible={isJoinClassModalVisible}
            onCancel={closeModalHandler}
            title={t('common.enterClassCode')}
            footer={
              <ButtonWrapper>
                <EduButton
                  data-cy="cancelbutton"
                  height="36px"
                  isGhost
                  onClick={closeModalHandler}
                >
                  {t('common.cancel')}
                </EduButton>
                <EduButton
                  data-cy="joinbutton"
                  height="36px"
                  onClick={joinClassHandler}
                  type="primary"
                >
                  {t('common.join')}
                </EduButton>
              </ButtonWrapper>
            }
          >
            <StyledInput
              data-cy="classcodeinput"
              placeholder={t('common.enterClassCode').toLowerCase()}
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              classCode
            />
            {classCode !== null && !classCode.length ? (
              <ErrorMessage data-cy="errormessage">
                enter class code
              </ErrorMessage>
            ) : null}
          </JoinClassModal>
        )}
      </MainHeader>
      <MainContentWrapper>
        <SubHeaderWrapper>
          <Col span={12}>
            {showActiveClass && (
              <ShowActiveClass
                t={t}
                classList={allClassList}
                setClassList={setClassList}
                setShowClass={setShowClass}
                showClass={showClass}
              />
            )}
          </Col>
        </SubHeaderWrapper>

        {classList.length ? (
          <ClassCardWrapper>
            <ClassCards
              classList={showClass ? activeClasses : classList}
              t={t}
            />
          </ClassCardWrapper>
        ) : (
          <NoDataBoxWrapper>
            <NoDataBox>
              <img src={NoDataIcon} alt="noData" />
              <h4>
                {showClass
                  ? t('common.noActiveClassesTitle')
                  : t('common.noClassesTitle')}
              </h4>
              <p>
                {showClass
                  ? t('common.noActiveClassesSubTitle')
                  : t('common.noClassesSubTitle')}
              </p>
            </NoDataBox>
          </NoDataBoxWrapper>
        )}
      </MainContentWrapper>
    </>
  )
}

const enhance = compose(withNamespaces(['manageClass', 'header']), React.memo)

export default enhance(ManageClassContainer)

ManageClassContainer.propTypes = {
  t: PropTypes.func.isRequired,
  classList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  showClass: PropTypes.string.isRequired,
}

const NoDataBoxWrapper = styled.div`
  height: calc(100vh - 150px);
`

const ClassCardWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  margin-top: 20px;
  &:after {
    content: '';
    flex: auto;
  }
`

const SubHeaderWrapper = styled(Row)`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-end;
`
const JoinClassBtn = styled(EduButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px 0px 10px;
  svg {
    margin-right: 20px;
    height: 17px;
    width: 17px;
    background: ${themeColorBlue};
    border-radius: 50%;
    padding: 4px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 10px;
    height: 32px;
  }
`

export const JoinClassModal = styled(Modal)`
  top: 35%;
  border-radius: 7px;
  .ant-modal-header {
    border: none;
    padding: 20px 24px;
    .ant-modal-title {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .ant-modal-body {
    padding: 10px 24px;
  }

  .ant-modal-footer {
    border: none;
    padding: 20px 24px;
  }
`
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const StyledButton = styled(Button)`
  border-radius: 4px;
  width: 114px;
  height: 36px;
  font-size: 11px;
  font-family: Open Sans, Semibold;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => (props.type === 'primary' ? themeColor : white)};
  color: ${(props) => (props.type === 'primary' ? white : themeColor)};
  border-color: ${themeColor};
  &:hover,
  :focus {
    background: ${(props) => (props.type === 'primary' ? themeColor : white)};
    color: ${(props) => (props.type === 'primary' ? white : themeColor)};
  }
`

export const StyledInput = styled(Input)`
  border: ${(props) =>
    props.classCode && !props.classCode.length
      ? `1px solid ${themeColor}`
      : '1px solid red'};
`
export const ErrorMessage = styled.div`
  color: red;
  text-align: start;
  padding-top: 5px;
`
