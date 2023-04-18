import React from 'react'
import { Row, Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'
import SectionDescription from '../../../common/components/SectionDescription'
import { DashedLine } from '../../../common/styled'
import {
  StyledButton,
  StyledIconQuestionCircle,
  StyledTextSpan,
} from './styled-component'

const SummaryTitle = () => {
  return (
    <>
      <Row type="flex" justify="space-between" margin="20px" align="middle">
        <Typography.Title style={{ margin: 0, fontSize: '20px' }} level={3}>
          Attendance Summary
        </Typography.Title>
        <StyledButton type="small">
          <StyledIconQuestionCircle />
          <StyledTextSpan>Help</StyledTextSpan>
        </StyledButton>
        <DashedLine margin="15px 0" dashColor={darkGrey} />
      </Row>
      <SectionDescription $margin="0px 0px 30px 0px">
        Monitor attendance and tardies, identify the students at risk of chronic
        absenteeism, and intervene.
      </SectionDescription>
    </>
  )
}
export default SummaryTitle
