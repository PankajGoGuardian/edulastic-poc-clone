import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { IconInfoCircle } from '@edulastic/icons'
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
import { NewTag } from '../../../../../common/components/NewTag'

const TestCard = ({
  testKey,
  icon,
  heading,
  description,
  onClick,
  access,
  quickTour,
  isNew,
}) => {
  return (
    <StyledCardWrapper onClick={onClick} data-cy={`${testKey}CreateTest`}>
      <Row gutter={16}>
        <Col span={6} style={{ textAlign: 'center' }}>
          {icon}
        </Col>
        <Col span={18}>
          <HeadingWrapper strong data-cy={`${testKey}Title`}>
            {heading}
            <EduIf condition={isNew}>
              {' '}
              <NewTag top="-2px">NEW</NewTag>
            </EduIf>
          </HeadingWrapper>
          <DescriptionWrapper data-cy={`${testKey}Description`}>
            {description}
          </DescriptionWrapper>
        </Col>
      </Row>
      <EduIf condition={access?.features?.[0]?.icon}>
        <EduThen>
          <Popover content={access?.features?.[0]?.infoMessage} placement="top">
            <StyledIconWrapper data-cy={`${testKey}AccessMark`}>
              {access?.features?.[0]?.icon}
            </StyledIconWrapper>
          </Popover>
        </EduThen>
        <EduElse>
          <EduIf condition={quickTour}>
            <StyledIconWrapper background="#EEEEEE" onClick={stopPropagation}>
              <QuickTour {...quickTour}>
                <Popover content={quickTour?.infoMessage} placement="top">
                  <IconInfoCircle
                    data-cy={`${testKey}QuickTourLink`}
                    height={14}
                    width={14}
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
