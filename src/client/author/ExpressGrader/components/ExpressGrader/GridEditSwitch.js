import React, { useEffect } from 'react'
import { EduSwitchStyled } from '@edulastic/common'
import { SwitchBox, SwitchLabel } from './styled'

const GridEditSwitch = ({ isGridEditOn, toggleGridEdit, scoreMode }) => {
  useEffect(() => {
    if (!scoreMode && isGridEditOn) {
      toggleGridEdit()
    }
  }, [scoreMode, isGridEditOn])

  return (
    <SwitchBox>
      <SwitchLabel>Grid Edit</SwitchLabel>
      <EduSwitchStyled
        data-cy="grid-edit-toggle"
        checked={isGridEditOn}
        onChange={toggleGridEdit}
        disabled={!scoreMode}
      />
    </SwitchBox>
  )
}

export default GridEditSwitch
