import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { Tag, Popover } from 'antd'

const FilterTags = ({ tagsData }) => {
  const containerRef = useRef(null)

  const getWidthOfTag = (tagTitle) => tagTitle.length * 7 + 41

  const handleCloseTag = (e, { onClose }) => {
    e.preventDefault()
    if (onClose) {
      onClose()
    } else {
      // notify
    }
  }

  const getTag = (type, data, bodyArray, popOverArray, containerWidthObj) => {
    const widthOfTag = getWidthOfTag(data.title)
    if (widthOfTag <= containerWidthObj.remainingWidth) {
      containerWidthObj.remainingWidth -= widthOfTag
      bodyArray.push(
        <Tag closable onClose={(e) => handleCloseTag(e, data)}>
          {data.title}
        </Tag>
      )
    } else {
      popOverArray.push(
        <StyledPopupTag closable onClose={(e) => handleCloseTag(e, data)}>
          {data.title}
        </StyledPopupTag>
      )
    }
  }

  const getTags = (
    type,
    tagData,
    bodyArray,
    popOverArray,
    containerWidthObj
  ) => {
    if (Array.isArray(tagData) && tagData.length) {
      tagData.forEach((d) =>
        getTag(type, d, bodyArray, popOverArray, containerWidthObj)
      )
    }
    if (typeof tagData === 'object' && tagData.key && tagData.key !== 'All') {
      getTag(type, tagData, bodyArray, popOverArray, containerWidthObj)
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

  const filterKeys = Object.keys(tagsData)
  filterKeys.forEach((k) =>
    getTags(k, tagsData[k], bodyArray, popOverArray, containerWidthObj)
  )

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
