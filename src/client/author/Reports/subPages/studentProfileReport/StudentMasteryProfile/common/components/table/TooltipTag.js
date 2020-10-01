import React from 'react'
import { themeColorLight, greyThemeDark1 } from '@edulastic/colors'
import TableTooltipRow from '../../../../../../common/components/tooltip/TableTooltipRow'
import { CustomTableTooltip } from '../../../../../../common/components/customTableTooltip'
import { StyledTag } from '../../../../../../common/styled'

export const TooltipTag = ({ standard }) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title="Domain : " value={standard.domain} />
      <TableTooltipRow
        title="Domain Description : "
        value={standard.domainName}
      />
      <TableTooltipRow title="Standard : " value={standard.standard} />
      <TableTooltipRow
        title="Standard Description : "
        value={standard.standardName}
      />
      <TableTooltipRow title="Mastery Status : " value={standard.masteryName} />
    </div>
  )

  const { color = '#cccccc' } = standard.scale

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText()}
      getCellContents={() => (
        <StyledTag
          bgColor={color}
          textColor={greyThemeDark1}
          padding="0px 10px"
          margin="3px"
          fontWeight="Bold"
        >
          {standard.standard}
        </StyledTag>
      )}
    />
  )
}

export const TooltipTagContainer = ({ standards }) => {
  const toolTipText = (standardsList) => (
    <div>
      {standardsList.map((standard) => (
        <TooltipTag standard={standard} />
      ))}
    </div>
  )

  return standards.length ? (
    <CustomTableTooltip
      placement="top"
      title={toolTipText(standards)}
      getCellContents={() => (
        <StyledTag
          bgColor={themeColorLight}
          textColor={greyThemeDark1}
          padding="0px 10px"
          margin="3px"
          fontWeight="Bold"
        >
          {standards.length}+
        </StyledTag>
      )}
    />
  ) : null
}
