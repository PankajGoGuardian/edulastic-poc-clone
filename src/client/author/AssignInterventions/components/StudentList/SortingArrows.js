import React from 'react'
import { IconCaretDown } from '@edulastic/icons'
import { grey, greyThemeDark1 } from '@edulastic/colors'

const SortingArrows = ({ sortDirection, changeSortDirection }) => {
  return (
    <div>
      <div style={{ fontSize: '0px', margin: '6px 0', cursor: 'pointer' }}>
        <IconCaretDown
          style={{
            transform: 'rotate(180deg)',
            height: '6px',
          }}
          onClick={() => changeSortDirection(sortDirection === 1 ? 0 : 1)}
          color={sortDirection === 1 ? greyThemeDark1 : grey}
        />
      </div>
      <div style={{ fontSize: '0px', margin: '6px 0', cursor: 'pointer' }}>
        <IconCaretDown
          style={{ height: '6px' }}
          onClick={() => changeSortDirection(sortDirection === -1 ? 0 : -1)}
          color={sortDirection === -1 ? greyThemeDark1 : grey}
        />
      </div>
    </div>
  )
}

export default SortingArrows
