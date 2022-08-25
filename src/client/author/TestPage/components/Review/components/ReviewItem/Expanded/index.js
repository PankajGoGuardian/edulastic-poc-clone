import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { get, keyBy } from 'lodash'
import {
  FlexContainer,
  AnswerContext,
  helpers,
  CheckboxLabel,
  NumberInputStyled,
} from '@edulastic/common'
import UnScored from '@edulastic/common/src/components/Unscored'
import TestItemPreview from '../../../../../../../assessment/components/TestItemPreview'
import { PointsLabel } from './styled'
import { ScoreInputWrapper, SaveToApply, InfoIcon } from '../styled'
import Actions from '../Actions'

const transformItemRow = (row, qid) => [
  {
    ...row,
    widgets: row.widgets.filter((x) => {
      if (x.widgetType === 'question') {
        return x.reference === qid
      }
      return false
    }),
  },
]

const splitItems = (item, testItem) => {
  const questionRow = item.find((x) =>
    x.widgets.some((w) => w.widgetType === 'question')
  )
  return testItem.data?.questions.map(({ id }) => ({
    item: transformItemRow(questionRow, id),
  }))
}

const Expanded = ({
  item,
  testItem,
  isEditable = false,
  onChangePoints,
  owner,
  metaInfoData,
  onPreview,
  questions,
  passagesKeyed,
  mobile,
  isScoringDisabled = false,
  scoring,
  onSelect,
  onDelete,
  collapsRow,
  checked,
  points: pointsProp,
  groupPoints,
  groupMinimized,
  isUnScoredItem,
  showAltScoreInfo,
  isPremiumContentWithoutAccess,
  premiumCollectionWithoutAccess,
  isTestsUpdated,
}) => {
  const [scoreChanged, setScoreChanged] = useState(false)

  useEffect(() => {
    if (!isTestsUpdated) {
      setScoreChanged(isTestsUpdated)
    }
  }, [isTestsUpdated])

  /**
   * @type {{item:Object,question:Object}[]}
   */
  const items = testItem.itemLevelScoring
    ? [{ item }]
    : splitItems(item, testItem)
  let passageContent = {}
  if (testItem.passageId && items?.[0]?.item) {
    items[0].item = [
      passagesKeyed[testItem?.passageId]?.structure,
      ...items[0]?.item,
    ]
    passageContent = keyBy(passagesKeyed[testItem.passageId]?.data, 'id')
  }
  const widgetsWithResource = {
    ...questions,
    ...keyBy(testItem?.data?.resources || [], (r) => `${testItem._id}_${r.id}`),
    ...passageContent,
  }
  let points = 0

  const itemLevelScoring = helpers.getPoints(testItem)
  const questionLevelScoring = helpers.getQuestionLevelScore(
    testItem,
    get(testItem, 'data.questions', []),
    itemLevelScoring,
    get(scoring, testItem._id, 0)
  )

  const testItemQuestions = get(testItem, 'data.questions', [])
  const isPassageWithMultipleQuestions =
    (testItem?.isPassageWithQuestions &&
      testItemQuestions.length > 1 &&
      !testItem?.itemLevelScoring) ||
    false

  if (testItem.itemLevelScoring || mobile) {
    points = get(scoring, testItem._id, itemLevelScoring)
  } else {
    points = get(scoring, `questionLevel.${testItem._id}`, questionLevelScoring)
  }

  const handleChangePoint = (qid) => (value) => {
    const questionScore = value
    if (!testItem.itemLevelScoring && qid) {
      const updatedPoints = { ...points, [qid]: questionScore }
      const itemScore = Object.values(updatedPoints).reduce(
        (acc, curr) => curr + acc
      )
      onChangePoints(metaInfoData.id, itemScore, updatedPoints)
    } else {
      onChangePoints(metaInfoData.id, questionScore)
    }

    setScoreChanged(true)
  }

  return mobile ? (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <FlexContainer
        justifyContent="space-between"
        style={{ width: '100%', marginBottom: '15px' }}
      >
        {isEditable && (
          <FlexContainer
            style={{ marginTop: 20, width: '5%' }}
            flexDirection="column"
            justifyContent="center"
          >
            <CheckboxLabel checked={checked} onChange={onSelect} />
          </FlexContainer>
        )}
        <FlexContainer>
          <Actions
            isAutoselect={testItem?.autoselectedItem}
            style={{ marginBottom: 8, width: 108 }}
            onPreview={() => onPreview(metaInfoData.id)}
            onCollapseExpandRow={collapsRow}
            onDelete={onDelete}
            isEditable={isEditable}
            expanded
          />
          <FlexContainer flexDirection="column">
            <PointsLabel>Points</PointsLabel>
            <ScoreInputWrapper data-cy="score-input-wrapper">
              {!isUnScoredItem ? (
                <NumberInputStyled
                  data-cy="pointsd"
                  width="108px"
                  padding="0px 12px"
                  disabled={
                    !owner || !isEditable || isScoringDisabled || groupMinimized
                  }
                  value={groupMinimized ? groupPoints : pointsProp}
                  onChange={(value) => onChangePoints(metaInfoData.id, value)}
                  textAlign="center"
                />
              ) : (
                <UnScored
                  width="60px"
                  height="32px"
                  margin="0px 0px 0px 5px"
                  fontSize="10px"
                  text="Z"
                  fontWeight="700"
                />
              )}
              {showAltScoreInfo && (
                <Tooltip title="Question has alternate answers with different score points.">
                  <InfoIcon />
                </Tooltip>
              )}
              {scoreChanged && <SaveToApply>Save to apply changes</SaveToApply>}
            </ScoreInputWrapper>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer maxWidth="100%">
        <AnswerContext.Provider
          value={{ isAnswerModifiable: false, hideAnswers: true }}
        >
          <TestItemPreview
            style={{
              marginTop: -10,
              padding: 0,
              boxShadow: 'none',
              display: 'flex',
              maxWidth: '100%',
            }}
            cols={item}
            metaData={metaInfoData.id}
            preview="show"
            verticalDivider={item.verticalDivider}
            disableResponse
            scrolling={item.scrolling}
            questions={questions}
            windowWidth="100%"
            isReviewTab
            testItem
            isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
            premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
            itemIdKey={testItem._id}
          />
        </AnswerContext.Provider>
      </FlexContainer>
    </FlexContainer>
  ) : (
    items &&
      items.map(({ item: _item = [] }, index) => {
        const questionWidgets = _item.filter(({ widgets = [] }) =>
          widgets.find(({ widgetType = '' }) => widgetType === 'question')
        )

        const qId = get(questionWidgets, `[0].widgets[0].reference`, null)

        return (
          <FlexContainer
            className="expanded-rows"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <FlexContainer alignItems="flex-start" style={{ width: '85%' }}>
              {isEditable && (
                <FlexContainer
                  style={{ marginTop: 20, width: '5%' }}
                  flexDirection="column"
                  justifyContent="center"
                >
                  {isEditable && (
                    <CheckboxLabel checked={checked} onChange={onSelect} />
                  )}
                </FlexContainer>
              )}
              <AnswerContext.Provider
                value={{ isAnswerModifiable: false, showAnswers: false }}
              >
                <div
                  onClick={() => onPreview(metaInfoData.id)}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <TestItemPreview
                    style={{
                      padding: 0,
                      boxShadow: 'none',
                      display: 'flex',
                    }}
                    cols={_item}
                    preview="show"
                    metaData={metaInfoData.id}
                    disableResponse
                    verticalDivider={get(_item, '[0].verticalDivider')}
                    scrolling={get(_item, '[0].scrolling')}
                    questions={widgetsWithResource}
                    windowWidth="100%"
                    isReviewTab
                    testItem
                    isPremiumContentWithoutAccess={
                      isPremiumContentWithoutAccess
                    }
                    premiumCollectionWithoutAccess={
                      premiumCollectionWithoutAccess
                    }
                    isPassageWithMultipleQuestions={
                      isPassageWithMultipleQuestions
                    }
                    isExpandedView
                    itemIdKey={testItem._id}
                  />
                </div>
              </AnswerContext.Provider>
            </FlexContainer>
            <FlexContainer
              style={{ width: '15%' }}
              flexDirection="column"
              alignItems="flex-end"
            >
              <FlexContainer flexDirection="column" style={{ margin: 0 }}>
                <PointsLabel>Points</PointsLabel>
                <ScoreInputWrapper>
                  {!isUnScoredItem &&
                  !get(
                    questions,
                    `${testItem._id}_${qId}.validation.unscored`,
                    false
                  ) ? (
                    <NumberInputStyled
                      min={0}
                      width="108px"
                      padding="0px 12px"
                      disabled={
                        !owner ||
                        !isEditable ||
                        isScoringDisabled ||
                        groupMinimized
                      }
                      value={
                        groupMinimized ? groupPoints : points?.[qId] || points
                      }
                      onChange={handleChangePoint(qId)}
                      textAlign="center"
                    />
                  ) : (
                    <UnScored
                      width="108px"
                      height="32px"
                      margin="0px 0px 0px 5px"
                      fontSize="10px"
                      text="Z"
                      fontWeight="700"
                    />
                  )}
                  {showAltScoreInfo && (
                    <Tooltip title="Question has alternate answers with different score points.">
                      <InfoIcon />
                    </Tooltip>
                  )}
                  {scoreChanged && (
                    <SaveToApply>Save to apply changes</SaveToApply>
                  )}
                </ScoreInputWrapper>
              </FlexContainer>
              {index === 0 && (
                <Actions
                  isAutoselect={testItem?.autoselectedItem}
                  style={{ marginTop: 8, width: 108 }}
                  onPreview={() => onPreview(metaInfoData.id)}
                  onCollapseExpandRow={collapsRow}
                  onDelete={onDelete}
                  isEditable={isEditable}
                  expanded
                />
              )}
            </FlexContainer>
          </FlexContainer>
        )
      })
  )
}

Expanded.propTypes = {
  item: PropTypes.object.isRequired,
  testItem: PropTypes.object.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  owner: PropTypes.bool.isRequired,
  metaInfoData: PropTypes.object.isRequired,
  onPreview: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  passagesKeyed: PropTypes.object.isRequired,
  mobile: PropTypes.bool.isRequired,
  isScoringDisabled: PropTypes.bool.isRequired,
  scoring: PropTypes.object,
}

Expanded.defaultProps = {
  scoring: {},
}

export default Expanded
