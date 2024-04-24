/* eslint-disable array-callback-return */
import React from 'react'
import { keyBy, uniqBy, get } from 'lodash'
import { withInterestedCurriculums } from '@edulastic/common'
import {
  greyDarken,
  greyLight1,
  orangeTheme1,
  orangeTheme2,
} from '@edulastic/colors'
import styled from 'styled-components'
import Tags from '../../../src/components/common/Tags'

const Standards = ({
  item,
  interestedCurriculums,
  search,
  margin,
  labelStyle,
  show,
  reviewpage,
}) => {
  const { curriculumId = '', standardIds = [] } = search
  const domains = []
  let standards = []
  let titleKey = null
  const alignments = get(item, 'data.questions', []).flatMap(
    (q) => q?.alignment || []
  )
  const interestedCurriculumById = keyBy(interestedCurriculums, '_id')
  if (
    !alignments.length ||
    (reviewpage &&
      !alignments.some(
        (alignment) => interestedCurriculumById[alignment.curriculumId]
      ))
  ) {
    // No alignments present return early with No Standard tag
    return (
      <StyledStandardTags>
        <Tags
          tags={[
            {
              tagName: 'No Standard',
              stdTooltip:
                'No Standard assigned. Please edit the item to add a standard for standard-based reporting.',
            },
          ]}
          titleKey="stdTooltip"
          labelStyle={{
            ...labelStyle,
            color: greyDarken,
            background: greyLight1,
          }}
          margin={margin}
          tooltipContainer={(e) => e.parentNode} // using parent node for styling the tooltip
        />
      </StyledStandardTags>
    )
  }
  if (
    !alignments.some(
      (alignment) => interestedCurriculumById[alignment.curriculumId]
    )
  ) {
    // None of the alignment is interested show authored alignment in orange color
    alignments
      .filter(
        (alignment) =>
          alignment && !alignment.isEquivalentStandard && alignment.curriculumId
      )
      .forEach((alignment) => {
        const { curriculum = '', domains: _domains = [] } = alignment
        standards = _domains.flatMap((domain) =>
          domain.standards
            .map((std = {}) => ({
              ...std,
              stdTooltip: `This standard belongs to "${curriculum}" which isn't currently included in your interested set. Add your standard by editing item for standard-based reporting.`,
            }))
            .filter((std) => !!std)
        )
      })
    if (standards.length) {
      titleKey = 'stdTooltip'
      labelStyle = {
        ...labelStyle,
        color: orangeTheme2,
        background: orangeTheme1,
      }
    }
  }
  if (!standards?.length && item.data && item.data.questions) {
    item.data.questions.map((question) => {
      if (!question.alignment || !question.alignment.length) return
      // removing all multiStandard mappings
      const authorAlignments = question.alignment.filter(
        (_item) =>
          (!_item.isEquivalentStandard ||
            interestedCurriculumById[_item.curriculumId]) &&
          _item.curriculumId
      )

      // pick alignments matching with interested curriculums
      let interestedAlignments = authorAlignments.filter(
        (alignment) => interestedCurriculumById[alignment.curriculumId]
      )

      // pick alignments based on search if interested alignments is empty
      if (!interestedAlignments.length) {
        interestedAlignments = authorAlignments.filter(
          (alignment) => alignment.curriculumId == curriculumId
        )
      }
      interestedAlignments.map((el) =>
        el.domains && el.domains.length ? domains.push(...el.domains) : null
      )
    })
    if (!domains.length) return null
    domains.map((el) =>
      el.standards && el.standards.length
        ? standards.push(...el.standards)
        : null
    )
  }
  if (standardIds?.length) {
    // Bring the searching standard to the starting position
    const searchMatches = []
    const standardsById = keyBy(standards, 'id') || {}
    for (const std of standardIds) {
      if (standardsById[std]) {
        searchMatches.push(standardsById[std])
        delete standardsById[std]
      }
    }
    standards = [...searchMatches, ...(Object.values(standardsById) || [])]
  }

  return standards.length ? (
    <StyledStandardTags>
      <Tags
        tags={uniqBy(standards, (x) => x.name).map((_item) => ({
          ..._item,
          tagName: _item.name,
        }))}
        titleKey={titleKey}
        show={show || 2}
        labelStyle={labelStyle}
        margin={margin}
        tooltipContainer={(e) => (titleKey ? e.parentNode : document.body)} // using parent node for styling the tooltip
      />
    </StyledStandardTags>
  ) : null
}

Standards.defaultProps = {
  item: {},
  interestedCurriculums: [],
  search: {},
  margin: '',
  labelStyle: {},
  show: 2,
  showAllInterestedCurriculums: false,
}

export default withInterestedCurriculums(Standards)

const StyledStandardTags = styled.div`
  .ant-tooltip-content {
    width: 550px;
  }
  .ant-tooltip-inner {
    background: #fff;
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .ant-tooltip-arrow::before {
    background: #fff;
    width: 10px;
    height: 10px;
  }
`
