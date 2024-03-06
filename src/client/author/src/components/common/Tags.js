import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Tag, Popover, Tooltip } from 'antd'

import {
  darkBlue,
  lightBlue,
  greenDark,
  lightGreen,
  white,
  grey,
  lightGreen6,
  extraDesktopWidthMax,
} from '@edulastic/colors'

const Tags = ({
  tags = [],
  labelStyle,
  type,
  show,
  isStandards,
  isPlaylist = false,
  completed = false,
  margin,
  showTitle = false,
  isGrayTags,
  isCustomTags,
  flexWrap,
  isTestCard,
  testId = '',
  placement = 'bottomLeft',
  dataKey = 'tagName',
  titleKey = null,
}) => {
  if (!tags.length) return null

  const visibleTags = tags.slice(0, show)
  const hiddenTags = tags.slice(show)
  const className = isGrayTags ? 'gray-tags' : isCustomTags ? 'custom-tags' : ''

  const popup = (
    <PopupContainer className="tag-wrapper">
      {hiddenTags.map((tag, i) => (
        <Tooltip title={titleKey ? tag[titleKey] : ''}>
          <Label
            data-cy="standards"
            className={className}
            popupContainer
            style={labelStyle}
            key={tag?._id || i}
            type={type}
          >
            {isStandards || typeof tag === 'string' ? tag : tag[dataKey]}
          </Label>
        </Tooltip>
      ))}
    </PopupContainer>
  )

  return (
    <Labels
      completed={completed}
      isPlaylist={isPlaylist}
      margin={margin}
      flexWrap={flexWrap}
    >
      {visibleTags.map((tag, i) => (
        <Tooltip
          overlayClassName="custom-table-tooltip"
          title={titleKey ? tag[titleKey] : ''}
        >
          <Label
            data-cy="standards"
            className={className}
            style={labelStyle}
            key={i}
            type={type}
            {...(showTitle ? { title: tag?.tagName || tag } : {})}
          >
            {isStandards || typeof tag === 'string' ? tag : tag[dataKey]}
          </Label>
        </Tooltip>
      ))}
      {hiddenTags && !!hiddenTags.length && (
        <Popover
          placement={placement}
          getPopupContainer={(triggerNode) =>
            isTestCard ? document.body : triggerNode.parentNode
          }
          content={popup}
          onClick={(e) => e.stopPropagation()}
          overlayClassName={`testCard${testId}`}
        >
          <Label
            className={`${className} hidden-tags`}
            style={labelStyle}
            type={type}
          >
            <span>{hiddenTags.length} +</span>
          </Label>
        </Popover>
      )}
    </Labels>
  )
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  labelStyle: PropTypes.object,
  type: PropTypes.string,
  show: PropTypes.number,
}

Tags.defaultProps = {
  labelStyle: {},
  type: 'primary', // primary, secondary
  show: 2,
}

export default Tags

const getLabelStyle = (type) => {
  switch (type) {
    case 'secondary':
      return `
        color: ${greenDark};
        background: ${lightGreen};
      `
    case 'primary':
      return `
      color: ${greenDark};
      background: ${lightGreen6};
    `
    default:
      return `
      color: ${darkBlue};
      background: ${lightBlue};
    `
  }
}

const Labels = styled.div`
  display: flex;
  flex-wrap: ${({ flexWrap }) => flexWrap || 'wrap'};
  align-items: ${({ isPlaylist }) => isPlaylist && 'flex-start'};
  justify-content: ${({ isPlaylist }) => isPlaylist && 'flex-start'};
  width: ${({ isPlaylist }) => isPlaylist && 'auto'};
  margin: ${({ margin, completed, isPlaylist }) =>
    margin || `4px 0px 4px ${isPlaylist ? (completed ? '8px' : '56px') : 0}`};
  max-width: 100%;
`

const PopupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: ${white};
  padding: 10px;
  border: 1px solid ${grey};
  border-radius: 5px;
  max-width: 350px;
  max-height: 200px;
  overflow: auto;

  &.tag-wrapper {
    .custom-tags {
      max-width: 100%;
    }
  }
`

export const Label = styled(Tag)`
  position: relative;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 2px 12px;
  font-size: 8px;
  font-weight: 700;
  ${(props) => getLabelStyle(props.type)};
  border: none;
  line-height: 16px;
  margin: 0 3px ${({ popupContainer }) => (popupContainer ? '6px' : '3px')} 0;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;

  &.hidden-tags {
    &:hover {
      cursor: pointer;
    }
  }

  &.gray-tags {
    display: inline-block;
    background: #b3bcc4;
    color: #676e74;
    font-size: 10px;
    &:hover {
      opacity: 1;
    }
  }

  &.custom-tags {
    font-size: 10px;
    max-width: 40%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
    height: 24px;
    padding: 4px 12px;
  }
`
