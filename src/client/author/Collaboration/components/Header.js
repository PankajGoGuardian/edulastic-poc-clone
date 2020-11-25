import React from 'react'
import { MainHeader, HeaderTabs } from '@edulastic/common'
import { StyledTabs } from '@edulastic/common/src/components/HeaderTabs'
import { UsersIcon, EditIcon, EditIconWrapper } from './styles'

const navButtons = [
  {
    icon: '',
    value: 'members',
    text: 'Members',
  },
  {
    icon: '',
    value: 'addReports',
    text: 'Add Reports',
  },
]

const Header = ({
  currentTab,
  onClickHandler,
  headingText,
  onTitleClick,
  isAdmin,
}) => {
  return (
    <MainHeader
      Icon={headingText ? UsersIcon : ''}
      titleText={headingText || 'loading...'}
      headingText={
        <>
          <span>{headingText || 'loading...'}</span>
          {isAdmin && (
            <EditIconWrapper onClick={onTitleClick}>
              <EditIcon />
            </EditIconWrapper>
          )}
        </>
      }
    >
      {/* <StyledTabs>
        {navButtons.map(({ value, text, icon }) => (
          <HeaderTabs
            style={
              currentTab === value
                ? { cursor: 'not-allowed' }
                : { cursor: 'pointer' }
            }
            isActive={currentTab === value}
            linkLabel={text}
            key={value}
            icon={icon}
            onClickHandler={() => onClickHandler(value)}
          />
        ))}
      </StyledTabs> */}
      <div />
    </MainHeader>
  )
}

export default Header
