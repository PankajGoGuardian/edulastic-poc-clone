import React from "react";
import PropTypes from "prop-types";
import { get, keyBy } from "lodash";
import { FlexContainer, AnswerContext, helpers } from "@edulastic/common";
import TestItemPreview from "../../../../../../../assessment/components/TestItemPreview";
import { PointsLabel, QuestionCheckbox } from "./styled";
import Actions from "../Actions";
import { PointsInput } from "../styled";

const transformItemRow = ([row], qid) => [
  {
    ...row,
    widgets: row.widgets.filter(x => {
      if (x.widgetType === "question") {
        return x.reference === qid;
      }
      return true;
    })
  }
];

const splitItems = (item, testItem) =>
  testItem.data?.questions.map(({ id }) => ({
    item: transformItemRow(item, id)
  }));

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
  selected
}) => {
  /**
   * @type {{item:Object,question:Object}[]}
   */
  const items = testItem.itemLevelScoring ? [{ item }] : splitItems(item, testItem);
  let passageContent = {};
  if (testItem.passageId && items?.[0]?.item) {
    items[0].item = [passagesKeyed[testItem.passageId].structure, ...items[0].item];
    passageContent = keyBy(passagesKeyed[testItem.passageId].data, "id");
  }
  const widgetsWithResource = { ...questions, ...keyBy(testItem.data.resources, "id"), ...passageContent };
  let points = 0;

  const itemLevelScoring = helpers.getPoints(testItem);
  const questionLevelScoring = helpers.getQuestionLevelScore(
    testItem,
    get(testItem, "data.questions", []),
    itemLevelScoring,
    get(scoring, testItem._id, 0)
  );

  if (testItem.itemLevelScoring || mobile) {
    points = get(scoring, testItem._id, itemLevelScoring);
  } else {
    points = get(scoring, `questionLevel.${testItem._id}`, questionLevelScoring);
  }

  const getPoint = questionId => {
    if (!testItem.itemLevelScoring && questionId) {
      return points[questionId];
    }
    return points;
  };

  const handleChangePoint = qid => e => {
    const questionScore = +e.target.value;
    if (!testItem.itemLevelScoring && qid) {
      const itemScore = itemLevelScoring - points[qid] + questionScore;
      onChangePoints(metaInfoData.id, itemScore, { ...points, [qid]: questionScore });
    } else {
      onChangePoints(metaInfoData.id, questionScore);
    }
  };

  return mobile ? (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <FlexContainer justifyContent="space-between" style={{ width: "100%", marginBottom: "15px" }}>
        {isEditable && (
          <FlexContainer style={{ marginTop: 20, width: "5%" }} flexDirection="column" justifyContent="center">
            {isEditable && <QuestionCheckbox checked={selected} onChange={onSelect} />}
          </FlexContainer>
        )}
        <FlexContainer>
          <Actions
            style={{ marginBottom: 8, width: 100 }}
            onPreview={() => onPreview(metaInfoData.id)}
            onCollapseExpandRow={collapsRow}
            onDelete={onDelete}
            isEditable={isEditable}
            expanded
          />
          <FlexContainer flexDirection="column">
            <PointsLabel>Points</PointsLabel>
            <PointsInput
              data-cy="pointsd"
              size="large"
              type="number"
              disabled={!owner || !isEditable || isScoringDisabled}
              value={points}
              onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
            />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer maxWidth="100%">
        <AnswerContext.Provider value={{ isAnswerModifiable: false, hideAnswers: true }}>
          <TestItemPreview
            style={{
              marginTop: -10,
              padding: 0,
              boxShadow: "none",
              display: "flex",
              maxWidth: "100%"
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
          />
        </AnswerContext.Provider>
      </FlexContainer>
    </FlexContainer>
  ) : (
    items.map(({ item: _item }, index) => (
      <FlexContainer
        data-cy={testItem._id}
        className="expanded-rows"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <FlexContainer alignItems="flex-start" style={{ width: "85%" }}>
          {isEditable && (
            <FlexContainer style={{ marginTop: 20, width: "5%" }} flexDirection="column" justifyContent="center">
              {isEditable && <QuestionCheckbox checked={selected} onChange={onSelect} />}
            </FlexContainer>
          )}
          <AnswerContext.Provider value={{ isAnswerModifiable: false, showAnswers: false }}>
            <TestItemPreview
              style={{
                padding: 0,
                boxShadow: "none",
                display: "flex"
              }}
              cols={_item}
              preview="show"
              metaData={metaInfoData.id}
              disableResponse
              verticalDivider={get(_item, "[0].verticalDivider")}
              scrolling={get(_item, "[0].scrolling")}
              questions={widgetsWithResource}
              windowWidth="100%"
              isReviewTab
              testItem
            />
          </AnswerContext.Provider>
        </FlexContainer>
        <FlexContainer style={{ width: "15%" }} flexDirection="column" alignItems="flex-end">
          <FlexContainer flexDirection="column" style={{ margin: 0 }}>
            <PointsLabel>Points</PointsLabel>
            <PointsInput
              size="large"
              type="number"
              disabled={!owner || !isEditable || isScoringDisabled}
              value={getPoint(get(_item, "[0].widgets[0].reference", null))}
              onChange={handleChangePoint(get(_item, "[0].widgets[0].reference", null))}
            />
          </FlexContainer>
          {index === 0 && (
            <Actions
              style={{ marginTop: 8, width: 100 }}
              onPreview={() => onPreview(metaInfoData.id)}
              onCollapseExpandRow={collapsRow}
              onDelete={onDelete}
              isEditable={isEditable}
              expanded
            />
          )}
        </FlexContainer>
      </FlexContainer>
    ))
  );
};

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
  scoring: PropTypes.object
};

Expanded.defaultProps = {
  scoring: {}
};

export default Expanded;
