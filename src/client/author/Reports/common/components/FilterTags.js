import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { Tag, Popover } from 'antd'

const FilterTags = ({ tagsData, tagTypes = [], handleCloseTag }) => {
  const containerRef = useRef(null)

  const closableTypes = tagTypes.filter((t) => t.closable).map((t) => t.key)

  const getWidthOfTag = (tagTitle) => tagTitle.length * 7 + 41

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
    const widthOfTag = getWidthOfTag(data.title)
    if (widthOfTag <= containerWidthObj.remainingWidth) {
      containerWidthObj.remainingWidth -= widthOfTag
      bodyArray.push(
        <Tag
          closable={closableTypes.includes(type)}
          onClose={(e) => handleOnClose(e, type, data)}
        >
          {subType ? `${data.title} (${subType})` : data.title}
        </Tag>
      )
    } else {
      popOverArray.push(
        <StyledPopupTag
          closable={closableTypes.includes(type)}
          onClose={(e) => handleOnClose(e, type, data)}
        >
          {subType ? `${data.title} (${subType})` : data.title}
        </StyledPopupTag>
      )
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
    <TagsContainer ref={containerRef}>
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
          <Tag>{`+${popOverArray.length}`}</Tag>
        </Popover>
      )}
    </TagsContainer>
  )
}

export default FilterTags

const TagsStyle = css`
  color: #686f75;
  background: #bac3ca;
  padding: 2px 10px;
  border: none;
  font-weight: bold;
  border-radius: 6px;
  margin-bottom: 5px;
`

const TagsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-self: center;
  margin-right: auto;
  margin-left: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
  .ant-tag {
    ${TagsStyle};
    margin-top: 7px;
  }
`

const StyledPopupTag = styled(Tag)`
  ${TagsStyle};
`

const PopoverContentWrapper = styled.div`
  max-width: 250px;
`
