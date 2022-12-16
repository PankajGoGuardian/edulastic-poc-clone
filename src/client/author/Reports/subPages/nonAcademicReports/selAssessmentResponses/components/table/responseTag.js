import React, { Component } from 'react'
import next from 'immer'
import { Tag } from 'antd'

import { themeColorLighter, greyLight1, darkRed } from '@edulastic/colors'
import { StyledResponseTagContainer, StyledSpan } from '../styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'

export class ResponseTag extends Component {
  getPrintableTag = (exisitingStyle, name, value) => {
    const { data, incorrectFrequencyThreshold } = this.props
    const modifiedStyle = next(exisitingStyle, (styleDraft) => {
      if (data.isCorrect) {
        styleDraft.color = themeColorLighter
        styleDraft.backgroundColor = 'transparent'
      } else if (value > incorrectFrequencyThreshold) {
        styleDraft.backgroundColor = greyLight1
      }
    })

    return (
      <Tag style={modifiedStyle}>
        {name} - {value}%
      </Tag>
    )
  }

  getCellContents = () => {
    const { data, idx, arr } = this.props
    const value = arr.filter((e) => e.key === data.letter)[0]?.value || '0'
    const iconUrl = data?.emojiUrl

    return (
      <div>
        <div>
          <img src={iconUrl} alt="" width={30} height={30} />
        </div>
        <StyledSpan font="9px">{data?.label}</StyledSpan>
        <br />
        <StyledSpan color={idx > 2 ? darkRed : 'green'} font="15px">
          {value}%
        </StyledSpan>
      </div>
    )
  }

  render() {
    return (
      <StyledResponseTagContainer>
        <this.getCellContents />
      </StyledResponseTagContainer>
    )
  }
}
