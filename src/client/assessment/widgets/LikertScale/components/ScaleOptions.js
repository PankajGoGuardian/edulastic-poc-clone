import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import uuid from 'uuid/v4'
import { Select } from 'antd'
import { isEmpty, maxBy } from 'lodash'
import { FlexContainer, EduButton } from '@edulastic/common'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import { Subtitle } from '../../../styled/Subtitle'
import { SelectInputStyled } from '../../../styled/InputStyles'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'
import Question from '../../../components/Question'
import Options from './Options'
import { MAX_OPTIONS_LIMIT, AGREEMENT, allScaleTypes, ASC } from '../constants'

const ScaleOptions = ({
  t,
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  scaleData,
  view,
  saveAnswer,
  userAnswer,
  removeAnswer,
}) => {
  const {
    scaleType,
    options = [],
    displayOrder = ASC,
    validation: { validResponse: { score = 1 } = {} } = {},
  } = item

  const ascSortComparatorMethod = (obj1, obj2) => obj1.score - obj2.score
  const descSortComparatorMethod = (obj1, obj2) => obj2.score - obj1.score

  const optionMaxScore = (_options) => {
    const allOptions = isEmpty(_options) ? [] : _options
    const maxScoreOption = maxBy(allOptions, 'score')
    return maxScoreOption?.score || 1
  }

  const sortOptions = () => {
    setQuestionData(
      produce(item, (draft) => {
        if (draft?.options?.length) {
          draft.options.sort(
            displayOrder === ASC
              ? ascSortComparatorMethod
              : descSortComparatorMethod
          )
          const _maxScore = optionMaxScore(draft.options)
          draft.validation.validResponse.score = _maxScore
        }
      })
    )
  }

  const onChangeScaleType = (value) => {
    removeAnswer()
    setQuestionData(
      produce(item, (draft) => {
        draft.scaleType = value
        draft.options = scaleData[value].options.map((option) => ({
          value: uuid(),
          ...option,
        }))
      })
    )
  }

  const totalOptions = useMemo(() => {
    return options?.length || 0
  }, [options])

  const _userAnswer = useMemo(() => {
    return isEmpty(userAnswer) ? options?.[0]?.value : userAnswer
  }, [userAnswer, options])

  const optionValue = useMemo(() => {
    return options?.[0]?.value
  }, [options])

  // fallback if scaleType value is incorrect
  useEffect(() => {
    if (!allScaleTypes.includes(scaleType)) {
      onChangeScaleType(AGREEMENT)
    }
  }, [])

  useEffect(() => {
    sortOptions()
  }, [optionValue, displayOrder])

  const editOptions = (index, value, type) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.options[index] = {
          ...draft.options[index],
          label: type === 'optionLabel' ? value : item.options[index].label,
          score: type === 'optionScore' ? value : item.options[index].score,
          bgColor:
            type === 'optionBgColor' ? value : item.options[index].bgColor,
        }
        if (type === 'optionScore' && value > score) {
          draft.validation.validResponse.score = value
        }
      })
    )
  }

  const removeOption = (index, value) => {
    if (userAnswer === value) {
      removeAnswer()
    }
    setQuestionData(
      produce(item, (draft) => {
        draft.options.splice(index, 1)
        const _maxScore = optionMaxScore(draft.options)
        draft.validation.validResponse.score = _maxScore
      })
    )
  }

  const onAddOption = () => {
    setQuestionData(
      produce(item, (draft) => {
        if (displayOrder === ASC) {
          const newOptionScore = totalOptions === 0 ? 1 : score + 1
          draft.options.push({
            value: uuid(),
            label: '',
            score: newOptionScore,
          })
          draft.validation.validResponse.score = newOptionScore
        } else {
          draft.options.push({
            value: uuid(),
            label: '',
            score: 1,
          })
        }
        draft.options.sort(
          displayOrder === ASC
            ? ascSortComparatorMethod
            : descSortComparatorMethod
        )
      })
    )
  }

  const handleSaveAnswer = (value) => saveAnswer(value)

  return (
    <Question
      section="main"
      label={t('component.likertScale.scaleOptions')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.likertScale.scaleOptions')}`
        )}
      >
        {t('component.likertScale.scaleOptions')}
      </Subtitle>
      <Row gutter={24}>
        <Col md={6}>
          <Label>{t('component.likertScale.selectScaleType')}</Label>
          <SelectInputStyled
            size="large"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(val) => onChangeScaleType(val)}
            value={scaleType}
          >
            {allScaleTypes.map((option) => (
              <Select.Option data-cy={option} key={option} value={option}>
                {scaleData[option].title}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </Row>

      <Options
        scaleType={scaleType}
        options={options}
        onChangeOption={editOptions}
        onRemoveOption={removeOption}
        sortOptions={sortOptions}
        view={view}
        handleSaveAnswer={handleSaveAnswer}
        userAnswer={_userAnswer}
      />

      <FlexContainer justifyContent="flex-start" alignItems="center" mt="10px">
        <EduButton
          ml="0px"
          mr="8px"
          height="28px"
          onClick={onAddOption}
          disabled={totalOptions >= MAX_OPTIONS_LIMIT}
        >
          {t('component.likertScale.addNewChoice')}
        </EduButton>
      </FlexContainer>
    </Question>
  )
}

ScaleOptions.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  scaleData: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  removeAnswer: PropTypes.func.isRequired,
}

ScaleOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  userAnswer: '',
}

export default ScaleOptions
