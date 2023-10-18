import { Typography } from 'antd'
import React from 'react'
import { EduIf } from '@edulastic/common'
import {
  DashedLine,
  SectionLabelWrapper,
  StyledButton,
  StyledIconQuestionCircle,
  StyledTextSpan,
} from '../styled'

/**
 * @type {React.FC<{
 *   showHelp?: boolean
 *   url: string | null
 *   sectionLabelFilters?: React.ReactElement
 *   separator?: React.ReactElement | null
 *   wrapperStyle?: React.CSSProperties
 * } & React.HTMLAttributes>}
 */
const SectionLabel = (props) => {
  const {
    children,
    style,
    showHelp,
    url = null,
    sectionLabelFilters,
    separator = <DashedLine />,
    wrapperStyle,
    ...restProps
  } = props
  return (
    <SectionLabelWrapper {...restProps} style={wrapperStyle}>
      <Typography.Title style={{ margin: 0, ...style }} level={3}>
        {children}
      </Typography.Title>
      <EduIf condition={showHelp && url}>
        <StyledButton
          type="small"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIconQuestionCircle />
          <StyledTextSpan>Help</StyledTextSpan>
        </StyledButton>
      </EduIf>
      {separator}
      <EduIf condition={sectionLabelFilters}>{sectionLabelFilters}</EduIf>
    </SectionLabelWrapper>
  )
}

export default SectionLabel
