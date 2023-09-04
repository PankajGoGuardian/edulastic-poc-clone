import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { arrayMove } from 'react-sortable-hoc'
import uuid from 'uuid/v4'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
// import { updateVariables } from '../../../utils/variables'

import withAddButton from '../../../components/HOC/withAddButton'
import QuillSortableList from '../../../components/QuillSortableList/index'
import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'

const ListWithAdd = withAddButton(QuillSortableList)

const prefixStr = 'main('
const middleStr = ')='
const inputDelimiter = ','

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
        draft.testCases.push({
          id,
          input: [{ name: 'v1', value: '' }],
          str: 'main()=',
        })
        draft.validation.validResponse.value.push({
          id,
          output: '',
        })
      })
    )
  }

  const handleRemove = (index) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.testCases.splice(index, 1)
      })
      //   updateVariables(draft)
    )
  }

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.testCases = arrayMove(draft.testCases, oldIndex, newIndex)
      })
    )
  }

  const handleChange = (index, value) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.testCases[index].str = value
        if (value.includes(prefixStr) && value.includes(middleStr)) {
          const splitStr = value.split(middleStr)
          const input = splitStr[0]
            .split(prefixStr)[1]
            .split(inputDelimiter)
            .map((i, idx) => ({
              name: `v${idx + 1}`,
              value: parseInt(i, 10) || '',
            }))
          const output = parseInt(splitStr[1], 10) || ''
          const response = { id: draft.testCases[index].id, output }
          draft.testCases[index].input = input
          draft.validation.validResponse.value[index] = response
        }
        // updateVariables(draft)
      })
    )
  }

  const inputItems = item.testCases.map((testCase, index) => {
    const testCaseStr = testCase.str || ''
    const inputStr = testCase.input.map((i) => i.value).join(inputDelimiter)
    const outputStr = item.validation.validResponse.value[index].output
    return testCaseStr || `${prefixStr}${inputStr}${middleStr}${outputStr}`
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
      <ListWithAdd
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
