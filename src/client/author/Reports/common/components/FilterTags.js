import React, { useRef } from 'react'
import styled from 'styled-components'
import { Popover, Tooltip } from 'antd'
import { FilterTag } from '../styled'

const FilterTags = ({
  visible,
  isPrinting,
  tagsData = {},
  tagTypes = [],
  handleCloseTag,
  handleTagClick,
}) => {
  const containerRef = useRef(null)

  const closableTypes = tagTypes.filter((t) => t.closable).map((t) => t.key)

  const getWidthOfTag = (tagTitle) => Math.min(250, tagTitle.length * 7 + 41)

  const handleOnClose = (e, type, data) => {
    e.preventDefault()
    handleCloseTag(type, data)
  }

  const getTag = (
    type,
    subType,
    data,
    bodyArray,
    popOverArray,
    containerWidthObj
  ) => {
    const _title = subType ? `${data.title} (${subType})` : data.title
    const widthOfTag = getWidthOfTag(_title)
    const tag = (
      <StyledPopupTag
        closable={closableTypes.includes(type)}
        onClick={() => handleTagClick(type)}
        onClose={(e) => handleOnClose(e, type, data)}
      >
        <Tooltip title={_title} placement="topLeft">
          {_title}
        </Tooltip>
      </StyledPopupTag>
    )
    if (isPrinting || widthOfTag <= containerWidthObj.remainingWidth) {
      containerWidthObj.remainingWidth -= widthOfTag
      bodyArray.push(tag)
    } else {
      popOverArray.push(tag)
    }
  }

  const getTags = (
    type,
    subType,
    tagData,
    bodyArray,
    popOverArray,
    containerWidthObj
  ) => {
    if (Array.isArray(tagData) && tagData.length) {
      tagData.forEach((d) =>
        getTags(type, subType, d, bodyArray, popOverArray, containerWidthObj)
      )
    }
    if (
      typeof tagData === 'object' &&
      tagData.key &&
      tagData.title &&
      tagData.key.toLowerCase() !== 'all'
    ) {
      getTag(type, subType, tagData, bodyArray, popOverArray, containerWidthObj)
    }
  }

  const bodyArray = []
  const popOverArray = []

  const containerWidth =
    containerRef?.current?.offsetWidth - getWidthOfTag('+12')
  const containerWidthObj = {
    totalWidth: containerWidth,
    remainingWidth: containerWidth,
  }

  // TODO - find a better way to do this
  tagTypes.forEach((t) => {
    if (tagsData[t.key]) {
      getTags(
        t.key,
        t.subType,
        tagsData[t.key],
        bodyArray,
        popOverArray,
        containerWidthObj
      )
    }
  })

  return (
    <TagsContainer ref={containerRef} visible={visible}>
      {bodyArray?.length > 0 && bodyArray.map((e) => e)}
      {popOverArray?.length > 0 && (
        <Popover
          placement="bottom"
          content={
            <PopoverContentWrapper>
              {popOverArray.map((e) => e)}
            </PopoverContentWrapper>
          }
        >
          <FilterTag>{`+${popOverArray.length}`}</FilterTag>
        </Popover>
      )}
    </TagsContainer>
  )
}

export default FilterTags

const TagsContainer = styled.div`
  width: 100%;
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  justify-self: center;
  margin-right: auto;
  margin-left: 10px;
  justify-content: flex-end;
  flex-wrap: nowrap;
  @media print {
    margin-left: 0px;
    flex-wrap: wrap;
    .ant-tag {
      i {
        display: none;
      }
    }
  }
`

const StyledPopupTag = styled(FilterTag)`
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const PopoverContentWrapper = styled.div`
  max-width: 250px;
`
