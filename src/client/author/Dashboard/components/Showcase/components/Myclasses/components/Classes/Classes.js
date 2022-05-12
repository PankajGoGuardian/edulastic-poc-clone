import { title } from '@edulastic/colors'
import { FlexContainer, SelectInputStyled } from '@edulastic/common'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { TextWrapper } from '../../../../../styledComponents'
import Card from '../Card'
import CreateClassCard from '../CreateClassCard/CreateClassCard'
import { CardContainer } from './styled'
import { getUserDetails } from '../../../../../../../../student/Login/ducks'
import { receiveTeacherDashboardAction } from '../../../../../../ducks'
import { Tooltip } from '../../../../../../../../common/utils/helpers'
import { getUserOrgId } from '../../../../../../../src/selectors/user'
import CreateAssignmentCard from '../CreateClassCard/CreateAssignmentCard'

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
  hideGetStartedSection,
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
    (classData.length === 0 || (hideGetStartedSection && classData.length < 5))

  const isPremiumUser = user?.features?.premium

  return (
    <>
      <TextWrapper
        data-cy="classSectionTitle"
        data-testid="classSectionTitle"
        fw="bold"
        size="16px"
        color={title}
        mt={showBannerSlide ? '1.5rem' : ''}
        mb="1rem"
      >
        {hideGetStartedSection ? 'My Classes' : 'Get Started with Edulastic'}
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
          />
        )}
        {!hideGetStartedSection && (
          <CreateAssignmentCard
            newCreateClassCard={classData.length < 1}
            history={history}
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
  }
)(Classes)
