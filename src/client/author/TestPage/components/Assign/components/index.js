// TODO: remove this component as it is no longer used anywhere
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Paper, FlexContainer, notification } from '@edulastic/common'
import { message } from 'antd'
import {
  fetchAssignmentsAction,
  deleteAssignmentAction,
  setCurrentAssignmentAction,
  getAssignmentsSelector,
} from '../ducks'
import AssignmentColumns from './AssignmentColumns'
import AddAssignmentButton from './AddAssignmentButton'
import { Container } from '../../../../src/components/common'
import Breadcrumb from '../../../../src/components/Breadcrumb'
import { StyledTable } from './styled'
import {
  fetchGroupsAction,
  getGroupsSelector,
  fetchMultipleGroupMembersAction,
} from '../../../../sharedDucks/groups'

// Todo from  where we got localeCompare ?

class Assign extends Component {
  state = {
    showModal: false,
  }

  componentDidMount() {
    const { fetchGroups, fetchAssignments } = this.props
    fetchGroups()
    fetchAssignments()
  }

  handleRemoveAssignment = (id) => {
    const { deleteAssignment } = this.props
    deleteAssignment(id)
  }

  openAssignmentModal = (id) => {
    const { test } = this.props
    if (test.status !== 'draft') {
      this.props.setCurrentAssignment(id)
      this.setState({ showModal: true })
    } else {
      notification({ type: 'warn', messageKey: 'pleaseSaveAndPublish' })
    }
  }

  openBlankModal = () => this.openAssignmentModal('new')

  hideModal = () => {
    this.setState({
      showModal: false,
    })
  }

  openEditModal = (item) => {
    this.openAssignmentModal(item._id)
    this.props.fetchMultipleGroupMembers(item.class)
  }

  render() {
    const { group, current, assignments } = this.props
    const { showModal } = this.state

    const tableData = assignments.map((item, i) => ({
      key: i,
      _id: item._id,
      class: item.class,
      students: item.students,
      openPolicy: item.openPolicy || '',
      closePolicy: item.closePolicy || '',
      openDate: item.startDate,
      closeDate: item.endDate,
      buttons: {
        remove: () => this.handleRemoveAssignment(item._id),
        edit: () => this.openEditModal(item),
      },
    }))

    const breadcrumbData = [
      {
        title: 'TESTS',
        to: '/author/tests',
      },
      {
        title: current,
        to: '',
      },
    ]

    const columns = AssignmentColumns(group)

    return (
      <Container>
        {/* {showModal && (
          <EditModal
            visible={showModal}
            title={true ? "New Assignment" : "Edit Assignment"}
            onCancel={this.hideModal}
            group={group}
          />
        )} */}
        <FlexContainer
          justifyContent="space-between"
          style={{ marginBottom: 20 }}
        >
          <div>
            <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
          </div>

          <AddAssignmentButton onClick={this.openBlankModal} />
        </FlexContainer>
        <Paper style={{ padding: '18px' }}>
          <StyledTable columns={columns} dataSource={tableData} />
        </Paper>
      </Container>
    )
  }
}

export default connect(
  (state) => ({
    assignments: getAssignmentsSelector(state), // TODO: project required fields in BE before start using this component
    group: getGroupsSelector(state),
  }),
  {
    fetchGroups: fetchGroupsAction,
    fetchMultipleGroupMembers: fetchMultipleGroupMembersAction,
    fetchAssignments: fetchAssignmentsAction,
    deleteAssignment: deleteAssignmentAction,
    setCurrentAssignment: setCurrentAssignmentAction,
  }
)(Assign)

Assign.propTypes = {
  assignments: PropTypes.array.isRequired,
  test: PropTypes.object.isRequired,
  current: PropTypes.string.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  fetchAssignments: PropTypes.func.isRequired,
  deleteAssignment: PropTypes.func.isRequired,
  group: PropTypes.array.isRequired,
}
