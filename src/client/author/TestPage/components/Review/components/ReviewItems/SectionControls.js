import React from 'react'
import { EduButton } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'

const BetaTag = () => {
  return <span style={{ color: '#F2717F' }}>(Beta)</span>
}

const SectionControls = ({ handleAddSections }) => {
  return (
    <div>
      <EduButton
        height="20px"
        fontSize="9px"
        isGhost
        data-cy="addNewSections"
        onClick={handleAddSections}
        color="primary"
      >
        <IconPlusCircle color={themeColor} width={9} height={9} />
        <span style={{ margin: '0 2px' }}>Add New Sections</span>
        <BetaTag />
      </EduButton>
    </div>
  )
}

export default SectionControls
