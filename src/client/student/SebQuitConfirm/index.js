import React, { useEffect } from 'react'
import { Button, Col } from 'antd'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { checkIsChromeOs } from '@edulastic/common/src/helpers'

const SebQuitConfirm = ({ history }) => {
  useEffect(() => {
    if (checkIsChromeOs()) {
      history.push('/home/grades')
    }
  }, [])

  return (
    <MainContainer>
      <Container>
        <p>Do you really want to quit SEB?</p>
        <Col md={24} sm={24}>
          {/* its completely fine hardcoding this url, since this is just an indication */}
          <StyledButton
            href="https://app.edulastic.com/home/grades"
            data-cy="submit"
            type="primary"
            btnType={2}
          >
            Quit SEB
          </StyledButton>
        </Col>
      </Container>
    </MainContainer>
  )
}

export default withRouter(SebQuitConfirm)

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 50px 50px;
  background: white;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const StyledButton = styled(Button)`
  height: 40px;
  padding: 8px 50px;
  @media screen and (max-width: 767px) {
    margin-top: 10px;
  }
`
