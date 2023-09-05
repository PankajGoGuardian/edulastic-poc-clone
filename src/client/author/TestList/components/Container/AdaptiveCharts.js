import { Tabs } from 'antd'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import currentStudentEmotionsOnMultipleAssessment from './currentStudentEmotionsOnMultipleAssessment.png'
import currentStudentScoreOnMultipleAssessment from './currentStudentScoreOnMultipleAssessment.png'
import currentStudentScoreOnSingleAssessment from './currentStudentScoreOnSingleAssessment.png'
import multipleStudentEmotionOnMultipleAssessment from './multipleStudentEmotionOnMultipleAssessment.png'
import multipleStudentScoreOnMultipleAssessment from './multipleStudentScoreOnMultipleAssessment.png'
import multipleStudentScoreOnSingleAssessment from './multipleStudentScoreOnSingleAssessment.png'

const { TabPane } = Tabs

const AdaptiveCharts = ({ setShowPerformance }) => {
  useEffect(() => {
    return () => setShowPerformance(false)
  }, [])

  return (
    <Container>
      <Tabs defaultActiveKey="1" onChange={() => {}} tabPosition="left">
        <TabPane tab="Current Student Score on Single Assessment" key="1">
          <ImageContainer>
            <Image src={currentStudentScoreOnSingleAssessment} />
          </ImageContainer>
          <InfoContainer>
            Current Student Score on Single Assessment
          </InfoContainer>
        </TabPane>
        <TabPane tab="Current Student Score on Multiple Assessment" key="2">
          <ImageContainer>
            <Image src={currentStudentScoreOnMultipleAssessment} />
          </ImageContainer>
          <InfoContainer>
            Current Student Score on Multiple Assessment
          </InfoContainer>
        </TabPane>
        <TabPane tab="Current Student Emotion on Multiple Assessment" key="3">
          <ImageContainer>
            <Image src={currentStudentEmotionsOnMultipleAssessment} />
          </ImageContainer>
          <InfoContainer>
            Current Student Emotion on Multiple Assessment
          </InfoContainer>
        </TabPane>
        <TabPane tab="Multiple Student Score on Single Assessment" key="4">
          <ImageContainer>
            <Image src={multipleStudentScoreOnSingleAssessment} />
          </ImageContainer>
          <InfoContainer>
            Multiple Student Score on Single Assessment
          </InfoContainer>
        </TabPane>
        <TabPane tab="Multiple Student Score on Multiple Assessment" key="5">
          <ImageContainer>
            <Image src={multipleStudentScoreOnMultipleAssessment} />
          </ImageContainer>
          <InfoContainer>
            Multiple Student Score on Multiple Assessment
          </InfoContainer>
        </TabPane>
        <TabPane tab="Multiple Student Emotion on Multiple Assessment" key="6">
          <ImageContainer>
            <Image src={multipleStudentEmotionOnMultipleAssessment} />
          </ImageContainer>
          <InfoContainer>
            Multiple Student Emotion on Multiple Assessment
          </InfoContainer>
        </TabPane>
      </Tabs>
    </Container>
  )
}

export default AdaptiveCharts

const Container = styled.div`
  margin-top: 90px;
  height: 100%;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`
const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  width: 100%;
`
const Image = styled.img`
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  max-height: 650px;
  max-width: 850px;
  margin: auto;
`
