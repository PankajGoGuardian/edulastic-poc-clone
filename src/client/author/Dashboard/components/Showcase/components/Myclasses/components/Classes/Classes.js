import { title } from '@edulastic/colors'
import { FlexContainer, SelectInputStyled } from '@edulastic/common'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { TextWrapper } from '../../../../../styledComponents'
import Card from '../Card'
import CreateClassCard from '../CreateClassCard/CreateClassCard'
import { CardContainer, EmptyBoxes } from './styled'
import { getUserDetails } from '../../../../../../../../student/Login/ducks'
import { receiveTeacherDashboardAction } from '../../../../../../ducks'
import { Tooltip } from '../../../../../../../../common/utils/helpers'
import { getUserOrgId } from '../../../../../../../src/selectors/user'

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
  emptyBoxCount,
  userId,
  user,
  getTeacherDashboard,
  districtId,
  classData,
  history,
}) => {
  const showCreateClassCard = classData.length < 4
  const allowEmptyBoxes = classData.length > 3

  const [classType, setClassType] = useState(
    myClassFilters[
      localStorage.getItem(
        `author:dashboard:classFilter:${userId}:${districtId}`
      ) || 'ALL_CLASSES'
    ]
  )

  const isPremiumUser = user?.features?.premium

  if (activeClasses.length === 0) {
    return null
  }

  return (
    <>
      <TextWrapper fw="bold" size="16px" color={title} mt="1.5rem" mb="1rem">
        {classData.length < 1 ? 'Get Started with Edulastic' : ' My Classes '}
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
        {allowEmptyBoxes &&
          emptyBoxCount.map((index) => <EmptyBoxes key={index} />)}
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
