import React, { Fragment, useMemo } from 'react'
import { get } from 'lodash'
import { helpers } from '@edulastic/common'
import { collections as collectionConst } from '@edulastic/constants'
import { allDepthOfKnowledgeMap } from '@edulastic/constants/const/question'
import MainInfo from './MainInfo'
import MetaInfo from './MetaInfo'
import Expanded from './Expanded'
import {
  getQuestionType,
  isPremiumContent,
  showPremiumLabelOnContent,
} from '../../../../../dataUtils'

const ReviewItem = ({
  item,
  handlePreview,
  isEditable,
  owner,
  onChangePoints,
  blur,
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
  scoring = {},
  standards,
  groupMinimized,
  groupPoints,
  isTestsUpdated,
  orgCollections,
  isPublishers,
  userId,
}) => {
  const premiumCollectionWithoutAccess = useMemo(
    () =>
      item?.premiumContentRestriction &&
      item?.collections
        ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
        .map(({ name }) => name),
    [item]
  )

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

  /**
   * in test review, to disable input field for item
   * if item level scoring is on and one question has been selected as unscored
   * consider item is unscored
   * if item level scoring is off and all question has been selected as unscored
   * consider item is unscored
   * */
  const getUnScoredItem = (__questions) => {
    return __questions.every(({ validation }) =>
      get(validation, 'unscored', false)
    )
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
    const testItemOwner =
      item.authors && item.authors.some((x) => x._id === userId)
    const showPremiumLabel =
      !isPublishers &&
      !testItemOwner &&
      isPremiumContent(item?.collections || []) &&
      showPremiumLabelOnContent(item?.collections, orgCollections)

    const dok = (item.data.questions.find((e) => e.depthOfKnowledge) || {})
      .depthOfKnowledge

    const meta = {
      id: item._id,
      by: get(item, ['createdBy', 'name'], ''),
      analytics: item?.analytics || [],
      type: getQuestionType(item),
      points: scoring[item._id] || helpers.getPoints(item),
      item,
      isPremium: showPremiumLabel,
      standards: standards[item._id],
      audio: audioStatus(item),
      tags: item.tags,
      dok: item.data && item.data.questions && allDepthOfKnowledgeMap[dok]?.text,
    }

    if (item.data && item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].stimulus
    }

    return {
      main,
      meta,
    }
  }, [item])

  const showAltScoreInfo = useMemo(() => {
    return item?.data?.questions?.some((q) => {
      if (q?.validation?.unscored) {
        return false
      }
      const correctSore = q?.validation?.validResponse?.score
      const altScores = q?.validation?.altResponses?.map((resp) => resp?.score)
      return altScores?.some((altScore) => altScore !== correctSore)
    })
  }, [item])

  const handleSelect = (e) => {
    onSelect(item._id, e.target.checked)
  }

  const checked = selected?.includes(item._id)

  const _questions = get(item, 'data.questions', [])
  const itemLevelScoring = get(item, 'itemLevelScoring', false)

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
          groupMinimized={groupMinimized}
          groupPoints={groupPoints}
          isUnScoredItem={getUnScoredItem(_questions, itemLevelScoring)}
          itemNumber={item.indx}
          showAltScoreInfo={showAltScoreInfo}
          isTestsUpdated={isTestsUpdated}
          isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
          premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
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
          blur={blur}
          isScoringDisabled={data.main.isScoringDisabled}
          expandRow={toggleExpandRow}
          groupMinimized={groupMinimized}
          groupPoints={groupPoints}
          showAltScoreInfo={showAltScoreInfo}
          isTestsUpdated={isTestsUpdated}
          isUnScoredItem={getUnScoredItem(_questions, itemLevelScoring)}
          isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
          premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
        />
      )}
      <MetaInfo data={data.meta} />
    </>
  )
}

export default ReviewItem
