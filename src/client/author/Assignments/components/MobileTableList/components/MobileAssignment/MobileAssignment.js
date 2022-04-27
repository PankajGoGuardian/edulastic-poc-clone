import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { TestTypeIcon } from '@edulastic/common'

import presentationIcon from '../../../../assets/presentation.svg'
import additemsIcon from '../../../../assets/add-items.svg'
import piechartIcon from '../../../../assets/pie-chart.svg'
import { Icon } from '../../../TableList/styled'
import AssignmentDetails from '../AssignmentDetails/AssignmentDetails'
import {
  AssignmentThumbnail,
  AssignmentBodyWrapper,
  AssignmentWrapper,
  AssignmentTitle,
  AssignmentDetailsWrapper,
  ExpandButton,
  AssignmentStatus,
  AssignmentNavigation,
} from './styled'

export default class MobileAssignment extends React.Component {
  static propTypes = {
    assignment: PropTypes.object.isRequired,
  }

  state = {
    expandItems: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { expandItems } = this.state
    const { assignment } = this.props
    return (
      nextProps.assignment !== assignment ||
      nextState.expandItems !== expandItems
    )
  }

  handleToggleExpandItems = () =>
    this.setState(({ expandItems }) => ({ expandItems: !expandItems }))

  static renderExpandRowIcons(item) {
    const itemLink = `${item._id}/${item.classId}`

    return (
      <AssignmentNavigation data-cy="PresentationIcon">
        <Link to={`/author/classboard/${itemLink}`}>
          <Icon src={presentationIcon} alt="Images" />
        </Link>
        <Link to="/author/expressgrader">
          <Icon src={additemsIcon} alt="Images" />
        </Link>
        <Link to={`/author/standardsBasedReport/${itemLink}`}>
          <Icon src={piechartIcon} alt="Images" />
        </Link>
      </AssignmentNavigation>
    )
  }

  renderTestType = (testType) => <TestTypeIcon testType={testType} />

  renderClass = (classes) => (item, key) => {
    const {
      assignedBy: { name },
      testType,
      className,
      totalNumber,
      submittedCount,
      status,
      gradedCount,
    } = item

    const type = this.renderTestType(testType)
    const itemStatus = (
      <AssignmentStatus type={status}>
        {status || 'NOT STARTED'}
      </AssignmentStatus>
    )
    const submitted = `${submittedCount} of ${totalNumber}`

    return (
      <AssignmentWrapper mb={key + 1 === classes ? '40px' : '5px'}>
        <AssignmentBodyWrapper key={`status-${key}`}>
          <AssignmentDetailsWrapper>
            <AssignmentDetails title="Class" value={className} />
            <AssignmentDetails title="Type" value={type} />
            <AssignmentDetails title="ASSIGNED BY" value={name} />
          </AssignmentDetailsWrapper>
          <AssignmentDetailsWrapper>
            <AssignmentDetails title="SUBMITTED" value={submitted} />
            <AssignmentDetails title="STATUS" value={itemStatus} />
            <AssignmentDetails title="GRADED" value={gradedCount} />
          </AssignmentDetailsWrapper>
        </AssignmentBodyWrapper>
      </AssignmentWrapper>
    )
  }

  render() {
    const { expandItems } = this.state
    const { assignment } = this.props
    const [defaultAssignment] = assignment
    const {
      title,
      thumbnail,
      submittedCount,
      gradedCount,
      testType,
    } = defaultAssignment

    const classes = (assignment || []).length
    const submittedValue = submittedCount || 0
    const type = this.renderTestType(testType)

    const notStarted = (assignment || []).filter(
      (ite) => ite.status === 'NOT OPEN'
    ).length
    const inProgress = (assignment || []).filter(
      (ite) => ite.status === 'IN PROGRESS'
    ).length

    return (
      <>
        <AssignmentWrapper>
          <AssignmentThumbnail thumbnail={thumbnail} />
          <AssignmentBodyWrapper>
            <AssignmentTitle>{title}</AssignmentTitle>
            <AssignmentDetailsWrapper>
              <AssignmentDetails title="Class" value={classes} />
              <AssignmentDetails title="Type" value={type} />
              <AssignmentDetails title="Not Started" value={notStarted} />
            </AssignmentDetailsWrapper>
            <AssignmentDetailsWrapper>
              <AssignmentDetails title="In Progress" value={inProgress} />
              <AssignmentDetails title="Submitted" value={submittedValue} />
              <AssignmentDetails title="Graded" value={gradedCount || 0} />
            </AssignmentDetailsWrapper>

            <AssignmentDetailsWrapper>
              <ExpandButton onClick={this.handleToggleExpandItems} isGhost>
                <span>
                  {expandItems ? 'HIDE ASSIGNMENTS' : 'SHOW ASSIGNMENTS'}
                </span>
              </ExpandButton>
            </AssignmentDetailsWrapper>
          </AssignmentBodyWrapper>
        </AssignmentWrapper>
        {expandItems && assignment.map(this.renderClass(classes))}
      </>
    )
  }
}
