import { darkOrange1 } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { SnapQuiz, Tag } from './styled'

const descriptionBottom = `
  Provide your video link and proceed to create an Edulastic Assessment
`

const OptionVideo = () => (
  <CardComponent>
    <Tag style={{ backgroundColor: darkOrange1 }}>New</Tag>
    <SnapQuiz>
      <span>Snap</span>Quiz (Video)
    </SnapQuiz>
    <TitleWrapper>Create from Video</TitleWrapper>

    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to="/author/tests/snapquizvideo">
      <EduButton data-cy="createTest" isGhost width="180px">
        Create test
      </EduButton>
    </Link>
  </CardComponent>
)

export default OptionVideo
