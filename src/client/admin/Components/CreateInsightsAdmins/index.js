import React, { useState } from 'react'
import { Col, Radio } from 'antd'

import { withNamespaces } from '@edulastic/localization'
import moment from 'moment'

import {
  HeadingSpan,
  ValueSpan,
} from '../../Common/StyledComponents/upgradePlan'
import CreateInsightsAdminsForm from './CreateInsightAdminsForm'
import { Row, SecondDiv, ThirdDiv } from './styled'

const DISTRICT = 'District'
const SCHOOL = 'School'

const CreateInsightAdmins = (props) => {
  const [adminType, setAdminType] = useState(DISTRICT)
  const { districtData, t, clearDistrictData } = props
  const { _source = {}, _id: districtId, subscription = {} } = districtData
  const { location = {} } = _source
  const { subType = 'free', subStartDate, subEndDate } = subscription

  const handleOnChange = (event) => setAdminType(event.target.value)

  return (
    <>
      <SecondDiv>
        <Row>
          <HeadingSpan>District ID:</HeadingSpan>
          <ValueSpan>{districtId}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>V1 ID:</HeadingSpan>
          <ValueSpan>{_source.v1Id || '-'}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Clever ID:</HeadingSpan>
          <ValueSpan>{_source.cleverId || '-'}</ValueSpan>
        </Row>
        <Row>
          <Col span={5}>
            <HeadingSpan>Existing Plan:</HeadingSpan>
            <ValueSpan>{subType}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>Start Date:</HeadingSpan>
            <ValueSpan>
              {subStartDate ? moment(subStartDate).format('YYYY-MM-DD') : '-'}
            </ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>End Date:</HeadingSpan>
            <ValueSpan>
              {subEndDate ? moment(subEndDate).format('YYYY-MM-DD') : '-'}
            </ValueSpan>
          </Col>
        </Row>
        <Row>
          <HeadingSpan>District Name:</HeadingSpan>
          <ValueSpan>{_source.name}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Short Name:</HeadingSpan>
          <ValueSpan>{_source.name}</ValueSpan>
        </Row>
        <Row>
          <Col span={5}>
            <HeadingSpan>City:</HeadingSpan>
            <ValueSpan>{location?.city || '-'}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>State:</HeadingSpan>
            <ValueSpan>{location?.state || '-'}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>Zipcode:</HeadingSpan>
            <ValueSpan>{location?.zip || '-'}</ValueSpan>
          </Col>
        </Row>
      </SecondDiv>
      <ThirdDiv>
        <HeadingSpan>Create Admin for:</HeadingSpan>
        <ValueSpan>
          <Radio.Group value={adminType} onChange={handleOnChange}>
            {[DISTRICT, SCHOOL].map((v, i) => (
              <Radio key={i} value={v}>
                {v}
              </Radio>
            ))}
          </Radio.Group>
        </ValueSpan>
      </ThirdDiv>
      <ThirdDiv>
        <CreateInsightsAdminsForm
          onCancel={clearDistrictData}
          isCreatingSchoolAdmin={adminType === SCHOOL}
          isCreatingDistrictAdmin={adminType === DISTRICT}
          districtId={districtId}
          t={t}
        />
      </ThirdDiv>
    </>
  )
}

export default withNamespaces('manageDistrict')(CreateInsightAdmins)
