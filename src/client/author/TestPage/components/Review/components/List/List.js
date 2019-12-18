import React from "react";
import PropTypes from "prop-types";
import { SortableContainer } from "react-sortable-hoc";
import { get } from "lodash";
import { FlexContainer, AnswerContext, helpers } from "@edulastic/common";

import TestItemPreview from "../../../../../../assessment/components/TestItemPreview";
import MetaInfoCell from "../ReviewItemsTable/MetaInfoCell/MetaInfoCell";
import { TestItemWrapper, PreviewButton, PointsInput, PointsLabel, QuestionCheckbox } from "./styled";
import { getQuestionType } from "../../../../../dataUtils";

const transformItemRow = ([row], qid) => [
  {
    ...row,
    widgets: row.widgets.filter(x => {
      if (x.widgetType === "question") {
        return x.reference === qid;
      } else {
        return true;
      }
    })
  }
];

const splitItems = (item, testItem) => {
  return testItem.data?.questions.map(({ id }) => ({
    item: transformItemRow(item, id)
  }));
};

export const SortableItem = ({
  indx,
  selected,
  item,
  testItem,
  onCheck,
  isEditable = false,
  points,
  onChangePoints,
  owner,
  collapseView = false,
  metaInfoData,
  onPreview,
  questions,
  passagesKeyed,
  mobile,
  isCollapse,
  isScoringDisabled = false
}) => {
  const handleCheck = e => onCheck(indx, e.target.checked);
  /**
   * @type {{item:Object,question:Object}[]}
   */
  let items = testItem.itemLevelScoring ? [{ item }] : splitItems(item, testItem);
  if (testItem.passageId && items?.[0]?.item) {
    items[0].item = [passagesKeyed[testItem.passageId].structure, ...items[0].item];
  }
  return (
    <TestItemWrapper data-cy={metaInfoData.id}>
      {mobile ? (
        <FlexContainer flexDirection="column" alignItems="flex-start">
          <FlexContainer justifyContent="space-between" style={{ width: "100%", marginBottom: "15px" }}>
            {isEditable && !collapseView && (
              <FlexContainer flexDirection="column" justifyContent="center">
                <QuestionCheckbox data-cy="queCheckbox" checked={selected.includes(indx)} onChange={handleCheck} />
              </FlexContainer>
            )}
            <FlexContainer>
              <PreviewButton data-cy="previewButton" onClick={() => onPreview(metaInfoData.id)}>
                Preview
              </PreviewButton>
              <FlexContainer flexDirection="column">
                <PointsLabel>Points</PointsLabel>
                <PointsInput
                  data-cy="points"
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
                style={{ marginTop: -10, padding: 0, boxShadow: "none", display: "flex", maxWidth: "100%" }}
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
            className={!isCollapse ? "expanded-rows" : ""}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <FlexContainer alignItems="flex-start" style={{ width: "85%" }}>
              {isEditable && !collapseView && (
                <FlexContainer style={{ marginTop: 20, width: "5%" }} flexDirection="column" justifyContent="center">
                  {isEditable && <QuestionCheckbox checked={selected.includes(indx)} onChange={handleCheck} />}
                </FlexContainer>
              )}
              <AnswerContext.Provider value={{ isAnswerModifiable: false, showAnswers: false }}>
                <TestItemPreview
                  style={{
                    padding: 0,
                    boxShadow: "none",
                    display: "flex",
                    width: isEditable && !collapseView ? "95%" : "100%"
                  }}
                  cols={_item}
                  preview="show"
                  metaData={metaInfoData.id}
                  disableResponse
                  verticalDivider={item.verticalDivider}
                  scrolling={item.scrolling}
                  questions={questions}
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
                  value={points}
                  onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
                />
              </FlexContainer>
              {index === 0 && <PreviewButton onClick={() => onPreview(metaInfoData.id)}>Preview</PreviewButton>}
            </FlexContainer>
          </FlexContainer>
        ))
      )}
      <FlexContainer style={{ margin: "20px 0" }}>
        <MetaInfoCell data={metaInfoData} itemTableView={true} />
      </FlexContainer>
    </TestItemWrapper>
  );
};

const List = SortableContainer(
  ({
    rows,
    selected,
    setSelected,
    testItems,
    onChangePoints,
    isEditable = false,
    standards,
    scoring,
    onPreview,
    owner,
    questions,
    passagesKeyed = {},
    mobile,
    gradingRubricsFeature
  }) => {
    const handleCheckboxChange = (index, checked) => {
      if (checked) {
        setSelected([...selected, index]);
      } else {
        const newSelected = selected.filter(item => item !== index);
        setSelected(newSelected);
      }
    };

    const audioStatus = item => {
      const questions = get(item, "data.questions", []);
      const getAllTTS = questions.filter(item => item.tts).map(item => item.tts);
      const audio = {};
      if (getAllTTS.length) {
        const ttsSuccess = getAllTTS.filter(item => item.taskStatus !== "COMPLETED").length === 0;
        audio.ttsSuccess = ttsSuccess;
      }
      return audio;
    };

    return (
      <div>
        {rows.map((item, i) => (
          <SortableItem
            key={i}
            metaInfoData={{
              id: testItems[i]._id,
              by: (testItems[i].createdBy && testItems[i].createdBy.name) || "",
              shared: "0",
              likes: "0",
              type: getQuestionType(testItems[i]),
              isPremium: !!testItems[i].collectionName,
              item: testItems[i],
              audio: audioStatus(testItems[i]),
              dok:
                testItems[i].data &&
                testItems[i].data.questions &&
                (testItems[i].data.questions.find(e => e.depthOfKnowledge) || {}).depthOfKnowledge
            }}
            isScoringDisabled={!!testItems[i].data.questions.find(q => q.rubrics) && gradingRubricsFeature}
            index={i}
            owner={owner}
            indx={i}
            isEditable={isEditable}
            item={item}
            testItem={testItems[i]}
            points={scoring[testItems[i]._id] || helpers.getPoints(testItems[i])}
            onCheck={handleCheckboxChange}
            onChangePoints={onChangePoints}
            onPreview={onPreview}
            selected={selected}
            questions={questions}
            passagesKeyed={passagesKeyed}
            mobile={mobile}
          />
        ))}
      </div>
    );
  }
);

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
  gradingRubricsFeature: PropTypes.bool
};

List.defaultProps = {
  owner: false,
  mobile: false
};

export default List;
