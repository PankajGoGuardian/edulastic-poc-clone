import React from 'react'
import styled from 'styled-components'

const Modal = ({
  title = 'Broadcasted Question',
  handleSkip,
  handleSubmit,
  visible,
  children,
  width,
  height,
}) => (
  <div className={`modal ${visible ? 'display-block' : 'display-none'}`}>
    <Section
      style={{
        width: width || 'auto',
        height: height || 'auto',
      }}
    >
      <Header>
        <Title>{title}</Title>
      </Header>

      <Body>{children}</Body>

      <Footer>
        <Button isGhost onClick={handleSkip}>
          Skip
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </Footer>
    </Section>
  </div>
)

export default Modal

const Section = styled.section`
  position: fixed;
  background: white;
  width: 80%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 700px;
  min-height: 700px;
  border-radius: 10px;
  padding: 0 30px;
`

const Header = styled.header`
  min-height: 50px;
  padding: 10px 0 0 0;
  border-bottom: 0.5px solid lightgray;
`

const Title = styled.h3`
  min-height: 50px;
  text-transform: uppercase;
  font-family: sans-serif;
  margin-bottom: 0;
  color: #222;
  display: flex;
  align-items: center;
  font-weight: 600;
`

const Body = styled.div`
  width: 100%;
  height: 100%;
  height: 600px;
  overflow: auto;
  padding: 10px;
`

const Footer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`

const Button = styled.button`
  outline: none;
  width: 150px;
  height: 40px;
  background: ${({ isGhost }) => (!isGhost ? '#00796b' : 'white')};
  color: ${({ isGhost }) => (isGhost ? '#00796b' : 'white')};
  border: ${({ isGhost }) =>
    isGhost ? '1px solid #00796b' : '1px solid white'};
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  margin: 0 10px;
  text-transform: uppercase;
  font-family: sans-serif;
  cursor: pointer;
`
