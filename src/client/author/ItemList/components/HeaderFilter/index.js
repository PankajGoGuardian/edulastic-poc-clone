import React, { useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { Tag, Popover } from 'antd'
import styled, { css } from 'styled-components'
import {
  test as testsConstants,
  questionType as questionTypes,
  libraryFilters,
} from '@edulastic/constants'
import { allDepthOfKnowledgeMap } from '@edulastic/constants/const/question'

import {
  curriculumsByIdSelector,
  standardsSelector,
} from '../../../src/selectors/dictionaries'
import { getCollectionsSelector } from '../../../src/selectors/user'
import { getKnownTagsSelector } from '../../../TestPage/ducks'
import selectsData from '../../../TestPage/components/common/selectsData'

// TK instead of PK for PreKindergarten is intentional
const gradeKeys = {
  O: 'Other',
  K: 'Kindergarten',
  TK: 'PreKindergarten',
  tk: 'PreKindergarten',
  o: 'Other',
  k: 'Kindergarten',
}

const allStatus = [...selectsData.allStatus, ...selectsData.extraStatus]

const gradeAndSubjectFilters = ['grades', 'subject']
const allFilters = [
  'grades',
  'subject',
  'curriculumId',
  'standardIds',
  'questionType',
  'depthOfKnowledge',
  'authorDifficulty',
  'collections',
  'status',
  'tags',
]
const HeaderFilter = ({
  handleCloseFilter,
  search,
  curriculumById,
  standardsList,
  collectionsList,
  allKnownTags,
}) => {
  const containerRef = useRef(null)
  const {
    curriculumId,
    standardIds = [],
    collections = [],
    tags = [],
    filter,
  } = search
  const isFolderSearch = filter === libraryFilters.SMART_FILTERS.FOLDERS
  const filtersTagToBeShown =
    filter === libraryFilters.SMART_FILTERS.FAVORITES
      ? gradeAndSubjectFilters
      : allFilters
  const curriculum = curriculumById[curriculumId]
  const selectedStandards = useMemo(
    () => standardsList.elo.filter((s) => standardIds.includes(s._id)),
    [standardsList, standardIds]
  )
  const selectedCollection = useMemo(
    () =>
      [
        ...testsConstants.collectionDefaultFilter.filter((c) => c.value),
        ...collectionsList.map((o) => ({ text: o.name, value: o._id })),
      ].filter((c) => collections.includes(c.value)),
    [collections, collectionsList]
  )
  const selectedTags = useMemo(
    () =>
      allKnownTags.filter(
        (t) => !!tags.find((tag) => tag === t._id || tag.key === t._id)
      ),
    [allKnownTags, tags]
  )

  const handleCloseTag = (e, type, value) => {
    e.preventDefault()
    if (value === undefined) {
      handleCloseFilter(type, '')
    }

    if (value) {
      const arr = search[type]
      handleCloseFilter(
        type,
        arr.filter((a) => a !== value)
      )
    }
  }

  const getWidthOfTag = (tagTitle) => tagTitle.length * 7 + 41

  const getTag = (
    type,
    d,
    tagTitle,
    bodyArr,
    popOverArray,
    containerWidthObj
  ) => {
    let text = tagTitle
    if (type === 'depthOfKnowledge') {
      text = allDepthOfKnowledgeMap[tagTitle]?.text
    }
    const widthOfTag = getWidthOfTag(text)
    if (widthOfTag <= containerWidthObj.remainingWidth) {
      containerWidthObj.remainingWidth -= widthOfTag
      bodyArr.push(
        <Tag closable onClose={(e) => handleCloseTag(e, type, d)}>
          {text}
        </Tag>
      )
    } else {
      popOverArray.push(
        <StyledPopupTag closable onClose={(e) => handleCloseTag(e, type, d)}>
          {text}
        </StyledPopupTag>
      )
    }
  }

  const getTags = (data, type, bodyArr, popOverArray, containerWidthObj) => {
    if (type === 'grades' && data.length) {
      data.forEach((d) => {
        const tagTitle = ['O', 'K', 'o', 'k', 'TK', 'tk'].includes(d)
          ? gradeKeys[d]
          : `Grade ${d}`
        getTag(type, d, tagTitle, bodyArr, popOverArray, containerWidthObj)
      })
    }
    if (type === 'subject' && data.length && Array.isArray(data)) {
      data.forEach((subj) => {
        getTag(type, subj, subj, bodyArr, popOverArray, containerWidthObj)
      })
    }
    if (type === 'standardIds' && selectedStandards.length) {
      selectedStandards.forEach((s) => {
        const tagTitle = s.identifier
        getTag(type, s.id, tagTitle, bodyArr, popOverArray, containerWidthObj)
      })
    }
    if (type === 'collections' && selectedCollection.length) {
      selectedCollection.forEach((c) => {
        const tagTitle = c.text
        getTag(
          type,
          c.value,
          tagTitle,
          bodyArr,
          popOverArray,
          containerWidthObj
        )
      })
    }
    if (type === 'tags' && selectedTags.length) {
      selectedTags.forEach((t) => {
        const tagTitle = t.tagName
        getTag(type, t._id, tagTitle, bodyArr, popOverArray, containerWidthObj)
      })
    }
    if (type === 'curriculumId') {
      if (curriculum?._id) {
        const tagTitle = curriculum.curriculum
        getTag(
          type,
          undefined,
          tagTitle,
          bodyArr,
          popOverArray,
          containerWidthObj
        )
      }
    }
    if (typeof data === 'string' && data?.length) {
      let tagTitle = data
      if (type === 'questionType') {
        tagTitle = questionTypes.selectsData.find((q) => q.value === data)?.text
      }
      if (type === 'status') {
        tagTitle = allStatus.find((s) => s.value === data)?.text
      }
      getTag(
        type,
        undefined,
        tagTitle,
        bodyArr,
        popOverArray,
        containerWidthObj
      )
    }
    return null
  }

  const getFilters = () => {
    const bodyArr = []
    const popOverArray = []
    const containerWidth =
      containerRef?.current?.offsetWidth - getWidthOfTag('+12')
    const containerWidthObj = {
      totalWidth: containerWidth,
      remainingWidth: containerWidth,
    }
    for (let i = 0; i < filtersTagToBeShown.length; i++) {
      const filterType = filtersTagToBeShown[i]
      const value = search[filterType]
      if (value?.length || typeof value === 'number') {
        getTags(value, filterType, bodyArr, popOverArray, containerWidthObj)
      }
    }

    return (
      <>
        {bodyArr?.length > 0 && bodyArr.map((e) => e)}
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
      </>
    )
  }

  return (
    <FiltersWrapper ref={containerRef}>
      {!isFolderSearch && getFilters()}
    </FiltersWrapper>
  )
}

export default connect((state) => ({
  curriculumById: curriculumsByIdSelector(state),
  standardsList: standardsSelector(state),
  collectionsList: getCollectionsSelector(state),
  allKnownTags: getKnownTagsSelector(state),
}))(HeaderFilter)

const TagsStyle = css`
  color: #686f75;
  background: #bac3ca;
  padding: 2px 10px;
  border: none;
  font-weight: bold;
  border-radius: 6px;
  margin-bottom: 5px;
`

const StyledPopupTag = styled(Tag)`
  ${TagsStyle};
`

export const FiltersWrapper = styled.div`
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

const PopoverContentWrapper = styled.div`
  max-width: 250px;
`
