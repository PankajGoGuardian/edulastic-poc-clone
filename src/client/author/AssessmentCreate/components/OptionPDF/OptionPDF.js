import { EduButton } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { SnapQuiz } from './styled'
import { isPearOrEdulasticAssessment } from '../../../../common/utils/helpers'

const descriptionBottom = `
  Upload your assessment in PDF format and proceed to create an ${isPearOrEdulasticAssessment}
`

const OptionPDF = () => (
  <CardComponent>
    <SnapQuiz>
      <span>Snap</span>Quiz
    </SnapQuiz>
    <TitleWrapper>Create from PDF</TitleWrapper>

    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to="/author/tests/snapquiz">
      <EduButton data-cy="uploadPdf" isGhost width="180px">
        UPLOAD PDF
      </EduButton>
    </Link>
  </CardComponent>
)

export default OptionPDF
