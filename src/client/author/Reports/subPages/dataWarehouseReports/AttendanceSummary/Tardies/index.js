import React from 'react'
import { EduThen, EduIf, SpinLoader, EduElse } from '@edulastic/common'
import { Col } from 'antd'
import { TardiesWrapper } from '../styled-component'
import TardiesGraph from './TardiesGraph'
import TardiesHeader from './TardiesHeader'

const Tardies = ({ attendanceData, loading, groupBy, setGroupBy }) => {
  return (
    <Col span={14}>
      <TardiesWrapper>
        <EduIf condition={loading || attendanceData.length}>
          <TardiesHeader groupBy={groupBy} setGroupBy={setGroupBy} />
        </EduIf>
        <EduIf condition={loading}>
          <EduThen>
            <SpinLoader />
          </EduThen>
          <EduElse>
            <TardiesGraph attendanceData={attendanceData} groupBy={groupBy} />
          </EduElse>
        </EduIf>
      </TardiesWrapper>
    </Col>
  )
}

export default Tardies
