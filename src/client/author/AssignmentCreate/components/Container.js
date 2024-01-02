import { CustomModalStyled, EduButton } from '@edulastic/common'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Col, Row } from 'antd'
import { connect } from 'react-redux'
import { lightGreen11 } from '@edulastic/colors'
import { setShowAssignmentCreationModalAction } from '../../Dashboard/ducks'
import AppConfig from '../../../../app-config'
import { TitleHeader, TitleParagraph } from '../../Welcome/styled/styled'
import {
  DottedLine,
  Img,
  InfoText,
  PartitionDiv,
  StyledDiv1,
  StyledDiv2,
  Title,
} from './styled'
import { isPearDomain, showPearContent } from '../../../../utils/pear'

const CreateAssignmentModal = ({
  visible,
  setShowAssignmentCreationModal,
  history,
}) => {
  const FOLDER_IMAGE_PATH = `${AppConfig.cdnURI}/Folder.png`
  const PENCIL_IMAGE_PATH = `${AppConfig.cdnURI}/Pencil.png`

  const closeModal = () => {
    setShowAssignmentCreationModal(false)
  }

  const navigateToTestPage = () => {
    setShowAssignmentCreationModal(false)
    history.push('/author/tests')
  }

  const createTestPage = () => {
    setShowAssignmentCreationModal(false)
    history.push('/author/tests/select')
  }

  const modalTitle = (
    <>
      <TitleHeader>Create assignment </TitleHeader>
      <TitleParagraph>
        Tell us how you&apos;d like to make your assignment
      </TitleParagraph>
    </>
  )

  const pearOrEdulasticText = showPearContent ? 'Pear Assessment' : 'Edulastic'

  return (
    <CustomModalStyled
      title={modalTitle}
      visible={visible}
      modalWidth="620px"
      footer={null}
      data-cy="createAssignmentModal"
      onCancel={closeModal}
      centered
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
      zIndex={5001}
    >
      <StyledDiv1>
        <Row gutter={24}>
          <Col span={12}>
            <Title>Pre-built assessment </Title>
            <DottedLine margin="0px 0px 30px 0px" />
            <InfoText>
              Select a pre-built assessment from <b>100k+ assesments</b> in the{' '}
              {pearOrEdulasticText} Library.
            </InfoText>
          </Col>
          <Col span={12}>
            <Img
              src={FOLDER_IMAGE_PATH}
              width="80px"
              height="96px"
              mL="75px"
              mB="30px"
            />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <EduButton
                width="189px"
                height="42px"
                onClick={navigateToTestPage}
                data-cy="browseAll"
              >
                Choose from library
              </EduButton>
            </div>
          </Col>
        </Row>
      </StyledDiv1>
      <PartitionDiv>
        <DottedLine
          border="1px dashed #e0dfdf"
          margin="auto 30px"
          width="94px"
        />
        OR
        <DottedLine
          border="1px dashed #e0dfdf"
          margin="auto 30px"
          width="94px"
        />
      </PartitionDiv>
      <StyledDiv2>
        <Row gutter={24}>
          <Col span={12}>
            <Title fs="16px" mB="10px">
              Create your own test
            </Title>
            <DottedLine
              border={`1px solid ${lightGreen11}`}
              width="7%"
              margin="0px 0px 10px 0px"
            />
            <InfoText>
              Create and curate your own test using questions from the library
              or author your own.
            </InfoText>
          </Col>
          <Col span={12}>
            <Img
              src={PENCIL_IMAGE_PATH}
              width="45px"
              height="56px"
              mL="125px"
              mB="15px"
            />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <EduButton
                width="136px"
                height="42px"
                isGhost
                onClick={createTestPage}
                data-cy="createNewTest"
              >
                Author a test
              </EduButton>
            </div>
          </Col>
        </Row>
      </StyledDiv2>
    </CustomModalStyled>
  )
}

const enhance = compose(
  withRouter,
  connect(null, {
    setShowAssignmentCreationModal: setShowAssignmentCreationModalAction,
  })
)
export default enhance(CreateAssignmentModal)
