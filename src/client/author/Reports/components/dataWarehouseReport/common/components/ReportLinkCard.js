import React from 'react'
import styled from 'styled-components'
import { Card, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { greyThemeDark3, themeColor } from '@edulastic/colors'

const ReportLinkCard = ({
  IconThumbnail,
  title,
  description,
  url,
  loc,
  history,
}) => {
  const navigateToReport = () => {
    history.push({ pathname: url, state: { source: loc } })
  }

  return (
    <StyledCard onClick={navigateToReport}>
      <h2>{title}</h2>
      <Description>
        <Content>
          <p>{description}</p>
          <IconWrapper>
            <Icon
              type="right"
              theme="outlined"
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: themeColor,
              }}
            />
          </IconWrapper>
        </Content>
        <ImageContainer>
          <IconThumbnail />
        </ImageContainer>
      </Description>
    </StyledCard>
  )
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
`
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 5px;
  width: 20px;
  height: 20px;
`

const Description = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledCard = styled(Card)`
  cursor: pointer;
  border-radius: 20px;
  h2 {
    margin-bottom: 10px;
    font-weight: bold;
    color: ${greyThemeDark3};
  }
`

export default withRouter(ReportLinkCard)
