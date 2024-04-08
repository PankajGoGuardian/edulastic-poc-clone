import React from 'react'
import { IconInfo } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { CustomWhiteBackgroundTooltip } from '../customTableTooltip'

export const GradeTooltipContent = ({ grades }) => (
  <div>
    The student is also enrolled in Grade {grades} classes in this term.
  </div>
)

export const SchoolTooltipContent = ({ schools }) => (
  <div>
    The student is also enrolled in school <b>{schools}</b> in this term.
  </div>
)

export const IconInfoWithTooltip = ({ title }) => (
  <CustomWhiteBackgroundTooltip
    data={title}
    str={<IconInfo fill={themeColor} />}
  />
)
