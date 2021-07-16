import React, { useEffect } from 'react'
import { Card, Col } from 'antd'

import { omrUploadSessionStatus } from '../utils'

export const UploadedSessions = ({
  uploadSessions,
  handleCardClick,
  getUploadSessions,
}) => {
  useEffect(() => getUploadSessions(), [])

  return (
    <>
      {uploadSessions.map((session) => (
        <Col span={8} onClick={() => handleCardClick(session._id)}>
          <Card title={session.source.name} bordered="false">
            {`${omrUploadSessionStatus[session.status]}`}
          </Card>
        </Col>
      ))}
    </>
  )
}

export default UploadedSessions
