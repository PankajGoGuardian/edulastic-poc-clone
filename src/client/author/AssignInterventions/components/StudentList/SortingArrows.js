import React from 'react'
import { IconCaretDown } from '@edulastic/icons'
import { grey, themeColor } from '@edulastic/colors'
import { SortingArrowContainer } from './style'

const SortingArrows = ({ sortDirection, changeSortDirection }) => {
  return (
    <SortingArrowContainer onClick={changeSortDirection}>
      <div style={{ margin: '6px 0' }}>
        <IconCaretDown
          style={{
            transform: 'rotate(180deg)',
            height: '6px',
          }}
          color={sortDirection === 1 ? themeColor : grey}
        />
      </div>
      <div style={{ margin: '6px 0' }}>
        <IconCaretDown
          style={{ height: '6px' }}
          color={sortDirection === -1 ? themeColor : grey}
        />
      </div>
    </SortingArrowContainer>
  )
}

export default SortingArrows
