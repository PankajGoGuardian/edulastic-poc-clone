import React from 'react'
import styled, { keyframes } from 'styled-components'

const listeningAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(5px);
  }

  100% {
    transform: translateY(0px);
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
`

const Dot = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 50%;
  margin: 4px;
  animation: ${listeningAnimation} 1s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || 0}s; /* Set animation delay */

  &.blue {
    background-color: #10089f;
  }

  &.green {
    background-color: #01b388;
  }

  &.lightBlue {
    background-color: #5bc2e7;
  }

  &.yellow {
    background-color: #ffbf40;
  }
`

const VoiceRecognitionAnimation = () => {
  return (
    <Container>
      <Dot className="blue" delay={0} />
      <Dot className="green" delay={0.2} />
      <Dot className="lightBlue" delay={0.4} />
      <Dot className="yellow" delay={0.6} />
    </Container>
  )
}

export default VoiceRecognitionAnimation
