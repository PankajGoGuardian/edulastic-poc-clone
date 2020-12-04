import React, { Fragment, useMemo } from 'react'
import { get } from 'lodash'
import { helpers } from '@edulastic/common'
import MainInfo from './MainInfo'
import MetaInfo from './MetaInfo'
import Expanded from './Expanded'
import { getQuestionType } from '../../../../../dataUtils'
import { isPremiumContent } from '../../../../utils'

const ReviewItem = ({
  item,
  handlePreview,
  isEditable,
  owner,
  onChangePoints,
  onDelete,
  questions,
  passagesKeyed,
  expand,
  onSelect,
  selected,
  toggleExpandRow,
  rows,
  mobile,
  userFeatures,
  scoring,
  standards,
}) => {
  const audioStatus = (_item) => {
    const _questions = get(_item, 'data.questions', [])
    const getAllTTS = _questions.filter((ite) => ite.tts).map((ite) => ite.tts)
    const audio = {}
    if (getAllTTS.length) {
      const ttsSuccess =
        getAllTTS.filter((ite) => ite.taskStatus !== 'COMPLETED').length === 0
      audio.ttsSuccess = ttsSuccess
    }
    return audio
  }

  const data = useMemo(() => {
    const isScoringDisabled =
      (!!item?.data?.questions?.find((q) => q.rubrics) &&
        userFeatures.gradingrubrics) ||
      item.autoselectedItem ||
      item.isLimitedDeliveryType

    const main = {
      id: item._id,
      points: item.isLimitedDeliveryType
        ? 1
        : scoring[item._id] || helpers.getPoints(item),
      title: item._id,
      isScoringDisabled,
      groupId: item.groupId,
    }

    const meta = {
      id: item._id,
      by: get(item, ['createdBy', 'name'], ''),
      analytics: item?.analytics || [],
      type: getQuestionType(item),
      points: scoring[item._id] || helpers.getPoints(item),
      item,
      isPremium: isPremiumContent(item?.collections || []),
      standards: standards[item._id],
      audio: audioStatus(item),
      tags: item.tags,
      dok:
        item.data &&
        item.data.questions &&
        (item.data.questions.find((e) => e.depthOfKnowledge) || {})
          .depthOfKnowledge,
    }

    if (item.data && item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].stimulus
    }

    return {
      main,
      meta,
    }
  }, [item])

  const handleSelect = (e) => {
    onSelect(item._id, e.target.checked)
  }

  const checked = selected?.includes(item._id)

  return (
    <>
      {expand && (
        <Expanded
          metaInfoData={data.meta}
          owner={owner}
          checked={checked}
          onSelect={handleSelect}
          isEditable={isEditable}
          item={rows[item.indx - 1]}
          testItem={data.meta.item}
          points={data.main.points}
          onChangePoints={onChangePoints}
          onPreview={handlePreview}
          questions={questions}
          mobile={mobile}
          passagesKeyed={passagesKeyed}
          collapsRow={toggleExpandRow}
          onDelete={onDelete}
          isScoringDisabled={data.main.isScoringDisabled}
          scoring={scoring}
        />
      )}
      {!expand && (
        <MainInfo
          data={data.main}
          handlePreview={handlePreview}
          isEditable={isEditable}
          owner={owner}
          index={item.indx}
          onSelect={handleSelect}
          checked={checked}
          onDelete={onDelete}
          onChangePoints={onChangePoints}
          isScoringDisabled={data.main.isScoringDisabled}
          expandRow={toggleExpandRow}
        />
      )}
      <MetaInfo data={data.meta} />
    </>
  )
}

export default ReviewItem
