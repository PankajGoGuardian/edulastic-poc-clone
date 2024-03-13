import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { IconInfoBlack } from '@edulastic/icons'
import { Col, Popover, Row } from 'antd'
import React from 'react'
import { stopPropagation } from '../utils'
import QuickTour from './QuickTour'
import {
  DescriptionWrapper,
  HeadingWrapper,
  StyledCardWrapper,
  StyledIconWrapper,
} from './styled'

const TestCard = ({
  key,
  icon,
  heading,
  description,
  onClick,
  access,
  quickTour,
  dataCy,
}) => {
  return (
    <StyledCardWrapper onClick={onClick} data-cy={dataCy || `${key}CreateTest`}>
      <Row gutter={16}>
        <Col span={6} style={{ textAlign: 'center' }}>
          {icon}
        </Col>
        <Col span={18} key={key}>
          <HeadingWrapper strong>{heading}</HeadingWrapper>
          <DescriptionWrapper>{description}</DescriptionWrapper>
        </Col>
      </Row>
      <EduIf condition={access?.features?.[0]?.icon}>
        <EduThen>
          <Popover content={access?.features?.[0]?.infoMessage} placement="top">
            <StyledIconWrapper>{access?.features?.[0]?.icon}</StyledIconWrapper>
          </Popover>
        </EduThen>
        <EduElse>
          <EduIf condition={quickTour}>
            <StyledIconWrapper background="#EEEEEE" onClick={stopPropagation}>
              <QuickTour {...quickTour}>
                <Popover content={quickTour?.infoMessage} placement="top">
                  <IconInfoBlack
                    dataCy={quickTour?.dataCy || `${key}QuickTour`}
                    height={12}
                    width={12}
                    path={{ fill: 'black' }}
                  />
                </Popover>
              </QuickTour>
            </StyledIconWrapper>
          </EduIf>
        </EduElse>
      </EduIf>
    </StyledCardWrapper>
  )
}

export default TestCard
