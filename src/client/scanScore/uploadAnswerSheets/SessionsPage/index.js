import React from 'react'
import { Row, Card, Col } from 'antd'

import { omrUploadSessionStatus } from '../utils'

const SessionsPage = ({ sessions, onSessionClick }) => {
  return (
    <Row>
      {sessions.map((session) => (
        <Col span={8} onClick={() => onSessionClick(session._id)}>
          <Card title={session.source.name} bordered="false">
            {`${omrUploadSessionStatus[session.status]}`}
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default SessionsPage
