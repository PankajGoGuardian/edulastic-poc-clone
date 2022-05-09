import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { HeaderTabs } from '@edulastic/common'
import { HeaderMidContainer } from '@edulastic/common/src/components/MainHeader'
import { StyledTabs } from '@edulastic/common/src/components/HeaderTabs'
import { playlistPageNavButtons } from './navButtonsList'

const PlaylistPageNav = ({
  onChange,
  current,
  showDifferentiationTab,
  showInsightTab,
  role,
}) => {
  const isAdmin = role === 'district-admin' || role === 'school-admin'

  return (
    <HeaderMidContainer>
      <StyledTabs>
        {playlistPageNavButtons.map(({ value, text }) => {
          if (
            value === 'differentiation' &&
            (!showDifferentiationTab || isAdmin)
          ) {
            return null
          }
          if (value === 'insights' && !showInsightTab) {
            return null
          }
          return (
            <HeaderTabs
              style={
                current === value
                  ? { cursor: 'not-allowed' }
                  : { cursor: 'pointer' }
              }
              dataCy={value}
              isActive={current === value}
              linkLabel={text}
              key={value}
              onClickHandler={onChange(value)}
              isPlaylist
            />
          )
        })}
      </StyledTabs>
    </HeaderMidContainer>
  )
}

PlaylistPageNav.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
}

export default memo(PlaylistPageNav)
