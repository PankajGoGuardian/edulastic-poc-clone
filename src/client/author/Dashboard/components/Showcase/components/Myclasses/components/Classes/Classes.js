import { FlexContainer, SelectInputStyled } from '@edulastic/common'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { TextWrapper } from '../../../../../styledComponents'
import Card from '../Card'
import CreateClassCard from '../CreateClassCard/CreateClassCard'
import { CardContainer } from './styled'
import { getUserDetails } from '../../../../../../../../student/Login/ducks'
import {
  receiveTeacherDashboardAction,
  setShowAssignmentCreationModalAction,
  setShowClassCreationModalAction,
} from '../../../../../../ducks'
import { Tooltip } from '../../../../../../../../common/utils/helpers'
import { getUserOrgId } from '../../../../../../../src/selectors/user'
import CreateAssignmentCard from '../CreateClassCard/CreateAssignmentCard'
import { setCreateClassTypeDetailsAction } from '../../../../../../../ManageClass/ducks'

const myClassFilters = {
  ALL_CLASSES: 'All Classes',
  MY_FAVORITES: 'My Favorites',
}

const { Option } = SelectInputStyled

const getOrderedClasses = (groups, type) => {
  if (groups.length > 5 || type !== 'All Classes') return groups
  groups.sort((a, b) => {
    if (a.isFavourite && b.isFavourite) {
      return 0
    }

    return b.isFavourite ? 1 : -1
  })
  return groups
}

const Classes = ({
  activeClasses,
  userId,
  user,
  getTeacherDashboard,
  districtId,
  classData,
  history,
  showBannerSlide,
  hideGetStartedHeader,
  hasAssignment,
  setShowClassCreationModal,
  setShowAssignmentCreationModal,
  setCreateClassTypeDetails,
}) => {
  const [classType, setClassType] = useState(
    myClassFilters[
      localStorage.getItem(
        `author:dashboard:classFilter:${userId}:${districtId}`
      ) || 'ALL_CLASSES'
    ]
  )

  const showCreateClassCard =
    classType !== 'My Favorites' &&
    (classData.length === 0 || (hasAssignment && classData.length < 5))

  const isPremiumUser = user?.features?.premium

  return (
    <>
      <TextWrapper
        data-cy="classSectionTitle"
        size="16px"
        mt={showBannerSlide ? '1.5rem' : ''}
        mb="1rem"
        rfs="20px"
        fw="700"
        lh="27px"
        color="#000000"
      >
        {hideGetStartedHeader ? 'Classes' : 'Get Started with Edulastic'}
      </TextWrapper>
      {isPremiumUser && (
        <SelectInputStyled
          data-cy="favouritesDropdown"
          defaultValue={myClassFilters.ALL_CLASSES}
          value={classType}
          onChange={(value = '') => {
            const key = value.split(' ').join('_').toUpperCase()
            localStorage.setItem(
              `author:dashboard:classFilter:${userId}:${districtId}`,
              key
            )
            getTeacherDashboard({
              background: true,
              setClassType: () => setClassType(value),
            })
          }}
          width="150px"
          height="25px"
          margin="0px 10px"
        >
          {Object.keys(myClassFilters).map((key) => (
            <Option
              data-cy={key}
              key={key}
              value={myClassFilters[key]}
              disabled={
                key === 'MY_FAVORITES' &&
                !activeClasses.some((x) => x.isFavourite)
              }
            >
              {key === 'MY_FAVORITES' &&
              !activeClasses.some((x) => x.isFavourite) ? (
                <Tooltip title="No class marked as favorite" placement="right">
                  {myClassFilters[key]}
                </Tooltip>
              ) : (
                myClassFilters[key]
              )}
            </Option>
          ))}
        </SelectInputStyled>
      )}
      <FlexContainer
        data-cy="myclasses-list"
        justifyContent="flex-start"
        flexWrap="wrap"
      >
        {getOrderedClasses(activeClasses, classType).map((item) => (
          <CardContainer key={item._id}>
            <Card
              data={item}
              userId={userId}
              setClassType={setClassType}
              activeClasses={activeClasses}
            />
          </CardContainer>
        ))}
        {showCreateClassCard && (
          <CreateClassCard
            newCreateClassCard={classData.length < 1}
            history={history}
            setShowClassCreationModal={setShowClassCreationModal}
            setCreateClassTypeDetails={setCreateClassTypeDetails}
          />
        )}
        {!hasAssignment && (
          <CreateAssignmentCard
            newCreateClassCard={classData.length < 1}
            history={history}
            setShowAssignmentCreationModal={setShowAssignmentCreationModal}
          />
        )}
      </FlexContainer>
    </>
  )
}

export default connect(
  (state) => ({
    user: getUserDetails(state),
    districtId: getUserOrgId(state),
  }),
  {
    getTeacherDashboard: receiveTeacherDashboardAction,
    setShowClassCreationModal: setShowClassCreationModalAction,
    setShowAssignmentCreationModal: setShowAssignmentCreationModalAction,
    setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
  }
)(Classes)
