import React from 'react'
import PropTypes from 'prop-types'
import { SortableContainer } from 'react-sortable-hoc'
import { get } from 'lodash'
import { getQuestionType, isPremiumContent } from '../../../../../dataUtils'

import ListItem from './ListItem'

const List = SortableContainer(
  ({
    rows,
    selected,
    setSelected,
    testItems,
    onChangePoints,
    isEditable = false,
    scoring,
    onPreview,
    owner,
    questions: questionsById,
    passagesKeyed = {},
    mobile,
    gradingRubricsFeature,
  }) => {
    const handleCheckboxChange = (index, checked) => {
      if (checked) {
        setSelected([...selected, index])
      } else {
        const newSelected = selected.filter((item) => item !== index)
        setSelected(newSelected)
      }
    }

    const audioStatus = (item) => {
      const questionItems = get(item, 'data.questions', [])
      const getAllTTS = questionItems
        .filter((questionItem) => questionItem.tts)
        .map((questionItem) => questionItem.tts)
      const audio = {}
      if (getAllTTS.length) {
        const ttsSuccess =
          getAllTTS.filter(
            (questionItem) => questionItem.taskStatus !== 'COMPLETED'
          ).length === 0
        audio.ttsSuccess = ttsSuccess
      }
      return audio
    }

    return (
      <div>
        {rows.map((item, i) => (
          <ListItem
            key={i}
            metaInfoData={{
              id: testItems[i]._id,
              by: (testItems[i].createdBy && testItems[i].createdBy.name) || '',
              shared: '0',
              likes: '0',
              type: getQuestionType(testItems[i]),
              isPremium: isPremiumContent(testItems[i]?.collections),
              item: testItems[i],
              tags: testItems[i].tags,
              audio: audioStatus(testItems[i]),
              dok:
                testItems[i].data &&
                testItems[i].data.questions &&
                (
                  testItems[i].data.questions.find((e) => e.depthOfKnowledge) ||
                  {}
                ).depthOfKnowledge,
            }}
            isScoringDisabled={
              (!!testItems[i].data.questions.find((q) => q.rubrics) &&
                gradingRubricsFeature) ||
              testItems[i].autoselectedItem ||
              testItems[i].isLimitedDeliveryType
            }
            index={i}
            owner={owner}
            indx={i}
            isEditable={isEditable}
            item={item}
            testItem={testItems[i]}
            scoring={scoring}
            onCheck={handleCheckboxChange}
            onChangePoints={onChangePoints}
            onPreview={onPreview}
            selected={selected}
            questions={questionsById}
            passagesKeyed={passagesKeyed}
            mobile={mobile}
          />
        ))}
      </div>
    )
  }
)

List.propTypes = {
  rows: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  testItems: PropTypes.array.isRequired,
  isEditable: PropTypes.bool,
  standards: PropTypes.object.isRequired,
  scoring: PropTypes.object.isRequired,
  owner: PropTypes.bool,
  questions: PropTypes.object.isRequired,
  mobile: PropTypes.bool,
  gradingRubricsFeature: PropTypes.bool,
}

List.defaultProps = {
  owner: false,
  mobile: false,
}

export default List
