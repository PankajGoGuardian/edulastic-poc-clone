/* eslint-disable array-callback-return */
import React from 'react'
import { connect } from 'react-redux'
import { keyBy } from 'lodash'
import { getInterestedCurriculumsSelector } from '../../../src/selectors/user'
import Tags from '../../../src/components/common/Tags'

const Standards = ({
  item,
  interestedCurriculums,
  search,
  margin,
  labelStyle,
}) => {
  const { curriculumId, standardIds } = search
  const domains = []
  let standards = []
  if (item.data && item.data.questions) {
    item.data.questions.map((question) => {
      if (!question.alignment || !question.alignment.length) return
      // removing all multiStandard mappings
      const authorAlignments = question.alignment.filter(
        (_item) =>
          (!_item.isEquivalentStandard ||
            interestedCurriculums.some(
              (interested) => interested._id === _item.curriculumId
            )) &&
          _item.curriculumId
      )

      // pick alignments matching with interested curriculums
      let interestedAlignments = authorAlignments.filter((alignment) =>
        interestedCurriculums.some(
          (interested) => interested._id === alignment.curriculumId
        )
      )

      // pick alignments based on search if interested alignments is empty
      if (!interestedAlignments.length) {
        interestedAlignments = authorAlignments.filter(
          (alignment) => alignment.curriculumId === curriculumId
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
    <Tags
      tags={standards.map((_item) => ({ ..._item, tagName: _item.name }))}
      show={2}
      labelStyle={labelStyle}
      margin={margin}
    />
  ) : null
}

export default connect(
  (state) => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  null
)(Standards)
