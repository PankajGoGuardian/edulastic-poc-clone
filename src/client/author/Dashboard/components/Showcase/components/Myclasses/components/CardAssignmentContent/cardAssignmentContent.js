import React from 'react'
import { withRouter } from 'react-router-dom'
import { Tooltip } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { IconPlusCircle } from '@edulastic/icons'
import {
  CardText,
  RowWrapper,
  LeftCol,
  CenterCol,
  AssignmentCount,
  ButtonHolder,
} from './styled'
import { getUserOrgId } from '../../../../../../../src/selectors/user'
import { setFilterInSession } from '../../../../../../../../common/utils/helpers'
import { setShowAssignmentCreationModalAction } from '../../../../../../ducks'

export const CardAssignmentContent = ({
  data,
  history,
  userId,
  districtId,
  setShowAssignmentCreationModal,
}) => {
  const { totalAssignment, _id, termId } = data

  const applyClassFilter = () => {
    const filter = {
      classId: _id,
      testType: '',
      termId,
    }
    setFilterInSession({
      key: 'assignments_filter',
      userId,
      districtId,
      filter,
    })
  }

  const navigateToAssignments = () => {
    applyClassFilter()
    history.push('/author/assignments')
  }

  const openAssignmentPopup = () => {
    setShowAssignmentCreationModal(true)
  }

  return (
    <ButtonHolder>
      <CardText
        hasAssignment={totalAssignment}
        onClick={
          totalAssignment >= 1 ? navigateToAssignments : openAssignmentPopup
        }
      >
        <RowWrapper>
          <LeftCol span={4} width="auto">
            {!!totalAssignment && (
              <AssignmentCount data-cy="totalAssignment">
                {totalAssignment}
              </AssignmentCount>
            )}
            {(!totalAssignment || totalAssignment === 0) && (
              <Tooltip title="Create New Assignment" placement="topLeft">
                <IconPlusCircle data-cy="addNewAssignmentIcon" />{' '}
              </Tooltip>
            )}
          </LeftCol>

          <CenterCol span={20}>
            <AssignmentCount data-cy="assignmentContent">
              {totalAssignment > 1
                ? 'Assignments'
                : totalAssignment === 1
                ? 'Assignment'
                : 'Add Assignments'}
            </AssignmentCount>
          </CenterCol>
        </RowWrapper>
      </CardText>
    </ButtonHolder>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      districtId: getUserOrgId(state),
    }),
    {
      setShowAssignmentCreationModal: setShowAssignmentCreationModalAction,
    }
  )
)
export default enhance(CardAssignmentContent)
