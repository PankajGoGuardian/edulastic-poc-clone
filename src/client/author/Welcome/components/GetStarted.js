import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { connect } from 'react-redux'
import { themeColor, white } from '@edulastic/colors'
import styled from 'styled-components'
import { Row } from 'antd'
import { IconHat, IconPeople, IconLesson } from '@edulastic/icons'
import {
  setShowGetStartedModalAction,
  setShowJoinSchoolModalAction,
} from '../../Dashboard/ducks'
import { Col } from '../../../assessment/styled/Grid'
import { TitleHeader, TitleParagraph } from '../styled/styled'

const row1 = [{ value: '1' }, {}, { value: '2' }, {}, { value: '3' }]
const row2 = [
  { src: <IconHat /> },
  { dashed: true },
  { src: <IconPeople /> },
  { dashed: true },
  { src: <IconLesson /> },
]
const row3 = [
  { text: 'Join your school' },
  {},
  { text: 'Add your students' },
  {},
  { text: 'Assign an assignment' },
]

const DisplayElement = ({ value, src, text, dashed }) => (
  <Col span={5}>
    {value && <StyledDiv>{value}</StyledDiv>}
    {src && <IconWrapper>{src}</IconWrapper>}
    {text && <DisplayText>{text}</DisplayText>}
    {dashed && <DashedLine />}
  </Col>
)

const GetStartedModal = ({
  isVisible,
  isCliUser,
  setShowGetStartedModal,
  setShowJoinSchoolModal,
}) => {
  const handleClick = () => {
    setShowGetStartedModal(false)
    setShowJoinSchoolModal(true)
  }

  const closeModal = () => {
    setShowGetStartedModal(false)
  }

  const modalTitle = (
    <>
      <TitleHeader>Let&apos;s get started...</TitleHeader>
      <TitleParagraph>In 3 easy steps</TitleParagraph>
    </>
  )

  return (
    <CustomModalStyled
      title={modalTitle}
      visible={isVisible}
      onCancel={closeModal}
      footer={null}
      maskClosable={false}
      closable={!isCliUser}
      centered
      modalWidth="565px"
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
    >
      <StyledRow>
        {row1.map((data, index) => (
          <DisplayElement key={index} {...data} />
        ))}
      </StyledRow>
      <StyledRow>
        {row2.map((data, index) => (
          <DisplayElement key={index} {...data} />
        ))}
      </StyledRow>
      <StyledRow mB="35px">
        {row3.map((data, index) => (
          <DisplayElement key={index} {...data} />
        ))}
      </StyledRow>
      <StyledRow mB="5px">
        <EduButton
          data-cy="GetStartedNextButton"
          height="42px"
          width="120px"
          onClick={handleClick}
        >
          Next
        </EduButton>
      </StyledRow>
    </CustomModalStyled>
  )
}

export default connect(null, {
  setShowGetStartedModal: setShowGetStartedModalAction,
  setShowJoinSchoolModal: setShowJoinSchoolModalAction,
})(GetStartedModal)

const StyledRow = styled(Row)`
  margin-top: 25px;
  margin-bottom: ${(props) => props.mB || '25px'};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0px 30px;
`

const StyledDiv = styled.div`
  background-color: ${themeColor};
  color: ${white};
  border-radius: 50%;
  width: 25%;
  margin: 15px auto;
  font-weight: 800;
  font-size: 12px;
  line-height: 22px;
`
const DashedLine = styled.div`
  border: 1px dashed black;
  margin: 10px;
  width: 70px;
  height: 0px;
`

const DisplayText = styled.div`
  color: black;
  margin: 0px;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
`
const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
