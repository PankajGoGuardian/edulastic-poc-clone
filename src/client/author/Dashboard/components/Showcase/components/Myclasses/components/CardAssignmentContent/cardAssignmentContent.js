import React from 'react'
import { withRouter } from 'react-router-dom'
import { Tooltip, Icon } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
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
  const { totalAssignment, _id } = data

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
                <Icon
                  type="plus"
                  width={36}
                  height={36}
                  data-cy="addNewAssignmentIcon"
                />
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
