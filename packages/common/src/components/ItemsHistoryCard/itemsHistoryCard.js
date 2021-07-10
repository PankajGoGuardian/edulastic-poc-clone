import React from 'react'
import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'
import { IconHistoryPin, IconBoard, IconPlaylist2 } from '@edulastic/icons'

const ItemsHistoryCard = () => {
  const text = (
    <StyledMenu>
      <Menu.Item>
        <HeaderText>Auto pinned</HeaderText>
        <StyledMenuItemText>
          <div>
            <IconPlaylist2 />
          </div>
          <div>
            <span>TEST</span>
            <StyledParagraph>
              LEAP 2025 GRADE 5 MATH PRACTICE TEST LEAP 2025 GRADE 5 MATH
              PRACTICE TEST LEAP 2025 GRADE 5 MATH PRACTICE TEST LEAP 2025 GRADE
              5 MATH PRACTICE TEST
            </StyledParagraph>
            <SubInfoText>
              {' '}
              <p> time 4:45</p>
              <p> extra info</p>
              <p style={{ alignSelf: 'flex-end' }}>
                {' '}
                <IconHistoryPin style={{ fontSize: '15px' }} />
              </p>
            </SubInfoText>
          </div>
        </StyledMenuItemText>
      </Menu.Item>
      <Menu.Item>
        <HeaderText>Pinned</HeaderText>
        <StyledMenuItemText>
          <div>
            <IconBoard />
          </div>
          <div>
            <span>PLAYLIST</span>
            <StyledParagraph>
              LEAP 2025 GRADE 5 MATH PRACTICE TEST
            </StyledParagraph>
            <SubInfoText>
              {' '}
              <p> time 4:45</p>
              <p>extra info</p>{' '}
              <p style={{ alignSelf: 'flex-end' }}>
                <IconHistoryPin style={{ fontSize: '15px' }} />
              </p>
            </SubInfoText>
          </div>
        </StyledMenuItemText>
      </Menu.Item>
    </StyledMenu>
  )
  return (
    <StyledDiv>
      <StyledDropdown
        overlayStyle={{ zIndex: 2000 }}
        overlay={text}
        placement="bottomCenter"
        trigger={['click']}
      >
        <IconHistoryPin style={{ fontSize: '24px' }} />
      </StyledDropdown>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  align-self: center;
  position: relative;
  left: -5px;
`

const StyledDropdown = styled(Dropdown)``

const StyledMenu = styled(Menu)`
  width: 400px;
  max-height: 250px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px #a0a0a0;
  padding-bottom: 10px;
  overflow-x: hidden;
  position: relative;
  top: 20px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #fff;
  }

  ::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 5px;
  }
  & > li {
    margin: auto;
    width: 95%;
    border-radius: 5px;
    margin-top: 5px;
    &:hover {
      background-color: #fff;
    }
  }
`

const HeaderText = styled.h3`
  font-weight: bold;
  color: #1ab394;
`

const StyledMenuItemText = styled.div`
  display: flex;
  & > div:nth-child(2) {
    margin-left: 5px;
    span {
      font-weight: 550;
      color: #2f4151;
    }
    p {
      line-height: 1.5;
      font-size: 12px;
      text-transform: lowercase;
    }
  }
`
const StyledParagraph = styled.p`
  white-space: nowrap;
  width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
`
const SubInfoText = styled.div`
  display: flex;
  justify-content: space-between;
`

export default ItemsHistoryCard
