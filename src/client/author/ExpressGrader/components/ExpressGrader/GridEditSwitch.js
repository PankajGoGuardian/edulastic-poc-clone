import React, { useEffect } from 'react'
import { EduSwitchStyled } from '@edulastic/common'
import { connect } from 'react-redux'
import { SwitchBox, SwitchLabel } from './styled'
import { getIsGridEditEnabledSelector } from '../../../src/selectors/user'

const GridEditSwitch = ({
  isGridEditOn,
  toggleGridEdit,
  scoreMode,
  isGridEditEnabled,
}) => {
  useEffect(() => {
    if (!scoreMode && isGridEditOn) {
      toggleGridEdit()
    }
  }, [scoreMode, isGridEditOn])
  if (!isGridEditEnabled) return null
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

export default connect((state) => ({
  isGridEditEnabled: getIsGridEditEnabledSelector(state),
}))(GridEditSwitch)
