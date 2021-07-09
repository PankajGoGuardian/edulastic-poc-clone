import { EduButton } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import IconWrapper from '../../../AssignmentCreate/common/IconWrapper'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { SnapQuiz } from '../OptionPDF/styled'

const descriptionBottom = `
  Test that changes its level of difficulty based on responses provided
`

const OptionAdaptiveTest = () => (
  <CardComponent ml="25px">
    <IconWrapper>
      <SnapQuiz>
        <span>Snap</span>Adapt
      </SnapQuiz>
    </IconWrapper>
    <TitleWrapper>Adaptive test</TitleWrapper>

    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to="/author/tests/create">
      <EduButton data-cy="uploadPdf" isGhost width="234px">
        Create Test
      </EduButton>
    </Link>
  </CardComponent>
)

export default OptionAdaptiveTest
