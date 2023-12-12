import React from 'react'
import moment from 'moment'
import { Tooltip, Row, Col } from 'antd'
import { groupBy, map, uniq } from 'lodash'
import Actions from './Actions'
import { InfoCell } from './InfoCell'
import { GreyText, DomainDetailsContainer } from './styled'

export const getTableData = (tutorMeData) => {
  return tutorMeData.map((data) => {
    const { interventionCriteria } = data
    const {
      tutorMeDetails: { subjectArea, subject },
      standardMasteryDetails,
    } = interventionCriteria
    return {
      ...data,
      subjectArea,
      subject,
      topics: uniq(map(standardMasteryDetails, 'domainDesc')).join(',') || '-',
    }
  })
}

export const tutoringColumns = [
  {
    title: 'Subject',
    key: 'subject',
    dataIndex: 'subject',
    width: 180,
    render: (_, { subjectArea, subject }) => `${subjectArea} - ${subject}`,
  },
  {
    title: 'Topics/Standards',
    dataIndex: 'topics',
    key: 'topics',
    render: (topics, record) => {
      const {
        interventionCriteria: { standardMasteryDetails },
      } = record
      const groupedDomainsDetails = Object.values(
        groupBy(standardMasteryDetails, 'domainId')
      )
      const totalDomains = groupedDomainsDetails.length
      const getTooltipTitle = () =>
        groupedDomainsDetails.map((domain, index) => {
          const domainDesc = domain[0].domainDesc
          return (
            <DomainDetailsContainer
              $addMarginBottom={index !== totalDomains - 1}
            >
              <Row type="flex" justify="start">
                <Col>
                  <GreyText>{domainDesc}</GreyText>
                </Col>
              </Row>
              {domain.map(({ standardDesc, standardIdentifier }) => (
                <Row type="flex" justify="start">
                  <Col>
                    {standardIdentifier} - {standardDesc}
                  </Col>
                </Row>
              ))}
            </DomainDetailsContainer>
          )
        })
      return <InfoCell title={topics} tooltipContent={getTooltipTitle} />
    },
  },
  {
    title: 'No. of Sessions',
    dataIndex: 'tutorMeSessions',
    key: 'tutorMeSessions',
    width: 150,
    align: 'center',
    render: (tutorMeSessions) => {
      const filteredSessions = tutorMeSessions.filter(
        ({ sessionCompleteTime }) => !!sessionCompleteTime
      )
      const getTooltipTitle = () =>
        filteredSessions.map(({ sessionCompleteTime }, index) => {
          return (
            <Row type="flex" justify="start">
              <Col>
                <p>
                  <GreyText>Session {index + 1}</GreyText> :{' '}
                  {moment(sessionCompleteTime).format('DD-MMM-YYYY')}
                </p>
              </Col>
            </Row>
          )
        })
      return (
        <InfoCell
          title={tutorMeSessions.length}
          tooltipContent={getTooltipTitle}
          justifyCenter
        />
      )
    },
  },
  {
    title: 'Date Assigned',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150,
    align: 'center',
    render: (createdAt, record) => {
      const {
        createdBy: { name = '-' },
      } = record
      return (
        <Tooltip title={name}>
          {moment(createdAt).format('DD-MMM-YYYY')}
        </Tooltip>
      )
    },
  },
  {
    title: 'Last Session',
    dataIndex: 'tutorMeSessions',
    key: 'tutorMeSessions',
    width: 150,
    align: 'center',
    render: (tutorMeSessions) => {
      const filteredTutorMeSessions = tutorMeSessions.filter(
        ({ sessionCompleteTime }) => !!sessionCompleteTime
      )
      const { sessionCompleteTime } = filteredTutorMeSessions.slice(-1)[0] || {}
      return sessionCompleteTime
        ? moment(sessionCompleteTime).format('DD-MMM-YYYY')
        : '-'
    },
  },
  {
    visibleOn: ['browser'],
    key: 'actions',
    width: 250,
    title: () => {
      const tooltipContent =
        'Click on view progress to see change in standards mastery, pre and post tutoring. Copy link to share tutoring with students.'
      return (
        <InfoCell isHeader title="Actions" tooltipContent={tooltipContent} />
      )
    },
    render: (actions, record) => <Actions data={record} />,
  },
]
