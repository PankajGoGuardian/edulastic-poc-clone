import React from 'react'
import { Row, Col, Tooltip, Icon } from 'antd'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import { IconAssignment, IconManage } from '@edulastic/icons'
import { themeColor, white } from '@edulastic/colors'
import { connect } from 'react-redux'
import { notification } from '@edulastic/common'
import { getUserDetails } from '../../../../../../../../student/Login/ducks'
import { TextWrapper } from '../../../../../styledComponents'
import {
  receiveTeacherDashboardAction,
  togglefavoriteClassAction,
} from '../../../../../../ducks'

import {
  Image,
  OverlayText,
  IconWrapper,
  TextDiv,
  SpanLeftMargin,
  RowWrapperGrade,
  StyledRow,
  CircleBtn,
  MetaText,
  FavCircleBtn,
} from './styled'
import cardImg from '../../../../../../assets/images/cardImg.png'
import { getUserOrgId } from '../../../../../../../src/selectors/user'
import { setFilterInSession } from '../../../../../../../../common/utils/helpers'

const CardImage = ({
  data,
  history,
  userId,
  districtId,
  toggleFavoriteClass,
  user,
  activeClasses = [],
  getTeacherDashboard,
  setClassType,
}) => {
  const {
    name,
    grades = [],
    studentCount,
    subject,
    thumbnail,
    _id,
    isFavourite,
  } = data

  const isPremiumUser = user?.features?.premium

  const gotoManageClass = (classId = '') => () => {
    history.push(`/author/manageClass/${classId}`)
  }

  const applyClassFilter = () => {
    const filter = {
      classId: _id,
      testType: '',
      termId: '',
    }
    setFilterInSession({
      key: 'assignments_filter',
      userId,
      districtId,
      filter,
    })
  }

  const metaInfo = (
    <>
      {(grades || []).length ? (
        <>
          <span data-cy="grades">Grades</span>{' '}
          {grades.join(', ').replace(/O/i, ' Other ')}
        </>
      ) : (
        ''
      )}
      {subject ? (
        <>
          {grades.length ? <SpanLeftMargin>|</SpanLeftMargin> : ''}
          <SpanLeftMargin data-cy="subjectInClassCard">
            {subject}
          </SpanLeftMargin>
        </>
      ) : (
        ''
      )}
    </>
  )

  const handleToggle = (payload) => {
    const currentFilter = localStorage.getItem(
      `author:dashboard:classFilter:${userId}:${districtId}`
    )
    if (!payload.toggleValue && currentFilter === 'MY_FAVORITES') {
      // If no favourites and the current filter is MY_FAVORITES then change to default filter
      const noFavouriteClasses = !activeClasses.some(
        (x) => x.isFavourite && x._id !== payload.groupId
      )
      if (noFavouriteClasses) {
        toggleFavoriteClass(payload)
        localStorage.setItem(
          `author:dashboard:classFilter:${userId}:${districtId}`,
          'ALL_CLASSES'
        )
        getTeacherDashboard({
          background: true,
          setClassType: () => setClassType('All Classes'),
        })
        return notification({
          type: 'info',
          msg: `Switching to 'All Classes', since no favorite classes found.`,
          duration: 3,
        })
      }
    }
    toggleFavoriteClass({
      ...payload,
      removeClassFromList:
        !payload.toggleValue && currentFilter === 'MY_FAVORITES',
    })
  }

  return (
    <>
      <Image src={thumbnail || cardImg} data-testid="thumbnailImage" />
      <OverlayText>
        <Row>
          <Col span={24}>
            <StyledRow>
              <Col span={17}>
                <Tooltip title={name} placement="bottomLeft">
                  <TextDiv data-cy="name" data-testid="className">
                    {name}
                  </TextDiv>
                </Tooltip>
              </Col>
              <Col span={6} offset={1}>
                <IconWrapper>
                  <CircleBtn onClick={gotoManageClass(_id)}>
                    <IconManage color={themeColor} width={13} height={13} />
                  </CircleBtn>
                  <Link to="/author/assignments" onClick={applyClassFilter}>
                    <CircleBtn bg={themeColor} style={{ marginLeft: '5px' }}>
                      <IconAssignment color={white} width={11} height={14} />
                    </CircleBtn>
                  </Link>
                </IconWrapper>
              </Col>
            </StyledRow>
            <RowWrapperGrade>
              <Tooltip title={metaInfo} placement="bottomLeft">
                <MetaText color={white} rfs="12px" size="13px" fw="600">
                  {metaInfo}
                </MetaText>
              </Tooltip>
            </RowWrapperGrade>
            <RowWrapperGrade>
              <TextWrapper
                data-testid="studentCount"
                data-cy="studentCount"
                color={white}
                rfs="11px"
                size="12px"
                fw="600"
              >
                {studentCount || 0} {studentCount > 1 ? 'Students' : 'Student'}
              </TextWrapper>
            </RowWrapperGrade>
          </Col>
        </Row>
        {isPremiumUser && (
          <Tooltip
            title="Mark class as Favorite to organize your classes"
            placement="bottom"
          >
            <FavCircleBtn
              isFavorite={isFavourite}
              onClick={() =>
                handleToggle({
                  groupId: _id,
                  toggleValue: !isFavourite,
                })
              }
            >
              <Icon
                data-cy="classFavourite"
                data-testid="classFavourite"
                type="heart"
                theme={isFavourite ? 'filled' : undefined}
              />
            </FavCircleBtn>
          </Tooltip>
        )}
      </OverlayText>
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: getUserDetails(state),
      districtId: getUserOrgId(state),
    }),
    {
      toggleFavoriteClass: togglefavoriteClassAction,
      getTeacherDashboard: receiveTeacherDashboardAction,
    }
  )
)
export default enhance(CardImage)
