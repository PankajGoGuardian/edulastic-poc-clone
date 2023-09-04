import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { arrayMove } from 'react-sortable-hoc'
import uuid from 'uuid/v4'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
// import { updateVariables } from '../../../utils/variables'

import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'
import TypedList from '../../../components/TypedList'

const TestCases = ({
  item,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
}) => {
  const handleAdd = () => {
    setQuestionData(
      produce(item, (draft) => {
        const id = uuid()
        draft.validation.validResponse.testCases.push({
          id,
          // input: [{ name: 'v1', value: '' }],
          // output: '',
          str: '',
        })
      })
    )
  }

  const handleRemove = (index) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.validResponse.testCases.splice(index, 1)
        // draft.testCases[testCaseIndex].input.splice(index, 1)
        // if (draft.testCases[testCaseIndex].input.length === 0) {
        //   draft.testCases.splice(testCaseIndex, 1)
        // }
      })
      //   updateVariables(draft)
    )
  }

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.validResponse.testCases = arrayMove(
          draft.validation.validResponse.testCases,
          oldIndex,
          newIndex
        )
      })
    )
  }

  const handleChange = (index, _str) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.validResponse.testCases[index].str = _str
        // if (_str.includes(prefixStr) && _str.includes(middleStr)) {
        //   const splitStr = _str.split(middleStr)
        //   const input = splitStr[0]
        //     .split(prefixStr)[1]
        //     .split(inputDelimiter)
        //     .map((i, idx) => ({
        //       name: `v${idx + 1}`,
        //       value: i.match(/\d+/g)?.[0] || '',
        //     }))
        //   const output = splitStr[1].match(/\d+/g)?.[0] || ''
        //   draft.validation.validResponse.testCases[index].input = input
        //   draft.validation.validResponse.testCases[index].output = output
        // }
        // updateVariables(draft)
      })
    )
  }

  const inputItems = item.validation.validResponse.testCases.map((testCase) => {
    const testCaseStr = testCase.str || ''
    return testCaseStr
  })

  return (
    <Question
      section="main"
      label={`${t('component.visualProgramming.testCases')}`}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.visualProgramming.testCases')}`
        )}
      >
        {`${t('component.visualProgramming.testCases')}`}
      </Subtitle>
      <TypedList
        items={inputItems}
        buttonText="Add Test Case"
        placeholder="Test Case"
        onAdd={handleAdd}
        onSortEnd={handleSortEnd}
        onChange={handleChange}
        onRemove={handleRemove}
        useDragHandle
        columns={1}
      />
    </Question>
  )
}

TestCases.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

TestCases.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(TestCases)
