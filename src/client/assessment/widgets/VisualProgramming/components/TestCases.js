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

const List = withAddButton(QuillSortableList)

const TestCasesList = ({
  item,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
}) => {
  const handleAdd = (testCaseIndex) => () => {
    setQuestionData(
      produce(item, (draft) => {
        const testCaseInput = draft.testCases[testCaseIndex].input
        testCaseInput.push({
          name: `v${testCaseInput.length + 1}`,
          value: '',
        })
      })
    )
  }

  const handleRemove = (testCaseIndex) => (index) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.testCases[testCaseIndex].input.splice(index, 1)
      })
      //   updateVariables(draft)
    )
  }

  const handleSortEnd = (testCaseIndex) => ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.testCases[testCaseIndex].input = arrayMove(
          draft.testCases[testCaseIndex].input,
          oldIndex,
          newIndex
        )
      })
    )
  }

  const handleChange = (testCaseIndex) => (index, value) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.testCases[testCaseIndex].input[index].value = value
        // updateVariables(draft)
      })
    )
  }

  return item.testCases.map((testCase, testCaseIndex) => {
    const inputItems = testCase.input.map((i) => i.value)
    return (
      <Question
        section="main"
        label={`${t('component.visualProgramming.testCase')} ${
          testCaseIndex + 1
        }`}
        fillSections={fillSections}
        cleanSections={cleanSections}
        key={testCase.id}
      >
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.visualProgramming.testCase')}-${
              testCaseIndex + 1
            }`
          )}
        >
          {`${t('component.visualProgramming.testCase')} ${testCaseIndex + 1}`}
        </Subtitle>
        <List
          items={inputItems}
          buttonText="Add new Input"
          onAdd={handleAdd(testCaseIndex)}
          onSortEnd={handleSortEnd(testCaseIndex)}
          onChange={handleChange(testCaseIndex)}
          onRemove={handleRemove(testCaseIndex)}
          placeholder="Add Input"
          useDragHandle
          columns={1}
        />
      </Question>
    )
  })
}

const TestCasesListWithAdd = withAddButton(TestCasesList)

const TestCases = (props) => {
  const { item, setQuestionData } = props
  const handleAddTestCase = () => {
    setQuestionData(
      produce(item, (draft) => {
        const id = uuid()
        draft.testCases.push({ id, input: [{ name: 'v1', value: '' }] })
        draft.validation.validResponse.value.push({ id, output: '' })
      })
    )
  }
  return (
    <TestCasesListWithAdd
      buttonText="Add new Test Case"
      onAdd={handleAddTestCase}
      {...props}
    />
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
