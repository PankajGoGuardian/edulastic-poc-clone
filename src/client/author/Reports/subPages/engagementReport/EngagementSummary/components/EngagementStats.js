import React from 'react'
import styled from 'styled-components'

import { Row, Col } from 'antd'
import { greyish, title, themeColorLighter } from '@edulastic/colors'

const EngagementStatItem = ({ heading, value, dataCy }) => (
  <StyledCol xs={24} sm={24} md={8} lg={8} xl={8}>
    <div>
      <p className="stats-title">{heading}</p>
      <p className="stats-value">
        <span data-cy={dataCy} className="stats-value-big">
          {value}
        </span>
      </p>
    </div>
  </StyledCol>
)

const EngagementStats = ({ data }) => {
  return (
    <Row type="flex" gutter={[15, 15]}>
      <EngagementStatItem
        dataCy="activeTeachers"
        heading="Active Teachers"
        value={data.teacherCount || 0}
      />
      <EngagementStatItem
        dataCy="activeStudents"
        heading="Active Students"
        value={data.studentCount || 0}
      />
      <EngagementStatItem
        dataCy="assessmentsAssigned"
        heading="Assessments Assigned"
        value={data.testCount || 0}
      />
    </Row>
  )
}

export default EngagementStats

const StyledCol = styled(Col)`
  & > div {
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    align-items: center;
    padding: 30px;
    border-radius: 10px;
    background-color: ${greyish};
    @media print {
      background-color: ${greyish};
      -webkit-print-color-adjust: exact;
    }
  }
  .stats-title {
    display: block;
    font-size: '16px';
    font-weight: 600;
    color: ${title};
  }
  .stats-value {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: flex-end;

    .stats-value-big {
      font-size: 25px;
      font-weight: 900;
      color: ${themeColorLighter};
    }
    .stats-value-small {
      font-size: 17px;
    }
  }
`
