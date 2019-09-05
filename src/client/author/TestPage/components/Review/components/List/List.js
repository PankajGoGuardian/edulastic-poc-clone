import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { get } from "lodash";
import { FlexContainer, AnswerContext, helpers } from "@edulastic/common";

import TestItemPreview from "../../../../../../assessment/components/TestItemPreview";
import MetaInfoCell from "../ReviewItemsTable/MetaInfoCell/MetaInfoCell";
import { TestItemWrapper, PreviewButton, PointsInput, PointsLabel, QuestionIndex, QuestionCheckbox } from "./styled";
import { getQuestionType, markQuestionLabel } from "../../../../../dataUtils";

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
  return (
    testItem.data &&
    testItem.data.questions.map(({ id: qid, ...qRest }) => ({
      item: transformItemRow(item, qid),
      question: { id: qid, ...qRest }
    }))
  );
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
  setQuestionNumber,
  mobile
}) => {
  // const DragHandle = SortableHandle(() => <QuestionIndex>Q{indx + 1}</QuestionIndex>);
  const handleCheck = e => onCheck(indx, e.target.checked);
  /**
   * @type {{item:Object,question:Object}[]}
   */
  const items = testItem.itemLevelScoring
    ? [{ item, question: (testItem.data && testItem.data.questions[0]) || {} }]
    : splitItems(item, testItem);
  return (
    <TestItemWrapper data-cy={metaInfoData.id}>
      {mobile ? (
        <FlexContainer flexDirection="column" alignItems="flex-start">
          <FlexContainer justifyContent="space-between" style={{ width: "100%", marginBottom: "15px" }}>
            {isEditable && !collapseView && (
              <FlexContainer flexDirection="column" justifyContent="center">
                {/* <DragHandle /> */}
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
                  disabled={!owner || !isEditable}
                  value={points}
                  onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
                />
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
              <TestItemPreview
                style={{ marginTop: -10, padding: 0, boxShadow: "none", display: "flex" }}
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
        items.map(({ item: _item, question }, index) => {
          //pick only questions required for the current loop and create question number for the same
          const rowQuestions = setQuestionNumber(_item);
          return (
            <FlexContainer justifyContent="space-between" alignItems="flex-start">
              <FlexContainer alignItems="flex-start" style={{ width: "85%" }}>
                {!collapseView && (
                  <FlexContainer
                    style={{ marginTop: 30, visibility: index === 0 ? "visible" : "hidden", width: "5%" }}
                    flexDirection="column"
                    justifyContent="center"
                  >
                    {/* {index === 0 && <DragHandle />} */}
                    {isEditable && <QuestionCheckbox checked={selected.includes(indx)} onChange={handleCheck} />}
                  </FlexContainer>
                )}
                <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
                  <TestItemPreview
                    style={{
                      marginTop: -10,
                      padding: 0,
                      boxShadow: "none",
                      display: "flex",
                      width: collapseView ? "100%" : "95%"
                    }}
                    cols={_item}
                    preview="show"
                    metaData={metaInfoData.id}
                    disableResponse
                    verticalDivider={item.verticalDivider}
                    scrolling={item.scrolling}
                    questions={rowQuestions}
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
                    disabled={!owner || !isEditable}
                    value={points}
                    onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
                  />
                </FlexContainer>
                {index === 0 && <PreviewButton onClick={() => onPreview(metaInfoData.id)}>Preview</PreviewButton>}
              </FlexContainer>
            </FlexContainer>
          );
        })
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
    mobile
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

    const setQuestionNumber = markQuestionLabel(questions);
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
            setQuestionNumber={setQuestionNumber}
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
  mobile: PropTypes.bool
};

List.defaultProps = {
  owner: false,
  mobile: false
};

export default List;
