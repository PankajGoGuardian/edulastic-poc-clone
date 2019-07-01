import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { get } from "lodash";
import { FlexContainer, AnswerContext } from "@edulastic/common";

import TestItemPreview from "../../../../../../assessment/components/TestItemPreview";
import MetaInfoCell from "../ReviewItemsTable/MetaInfoCell/MetaInfoCell";
import { TestItemWrapper, PreviewButton, PointsInput, PointsLabel, QuestionIndex, QuestionCheckbox } from "./styled";

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

const SortableItem = SortableElement(
  ({
    indx,
    selected,
    item,
    testItem,
    onCheck,
    isEditable = false,
    points,
    onChangePoints,
    owner,
    metaInfoData,
    onPreview,
    questions,
    mobile
  }) => {
    const DragHandle = SortableHandle(() => <QuestionIndex>Q{indx + 1}</QuestionIndex>);
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
              <FlexContainer flexDirection="column" justifyContent="center">
                <DragHandle />
                <QuestionCheckbox data-cy="queCheckbox" checked={selected.includes(indx)} onChange={handleCheck} />
              </FlexContainer>

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
                  style={{ marginTop: -40, padding: 0, boxShadow: "none", display: "flex" }}
                  cols={item}
                  metaData={metaInfoData.id}
                  previewTab="clear"
                  verticalDivider={item.verticalDivider}
                  disableResponse
                  scrolling={item.scrolling}
                  questions={questions}
                  windowWidth="100%"
                  isReviewTab
                />
              </AnswerContext.Provider>
            </FlexContainer>
          </FlexContainer>
        ) : (
          items.map(({ item: _item, question }, index) => {
            return (
              <FlexContainer justifyContent="space-between" alignItems="flex-start">
                <FlexContainer alignItems="flex-start" style={{ flex: 3 }}>
                  <FlexContainer
                    style={{ visibility: index === 0 ? "visible" : "hidden", flex: 1 }}
                    flexDirection="column"
                    justifyContent="center"
                  >
                    {index === 0 && <DragHandle />}
                    <QuestionCheckbox checked={selected.includes(indx)} onChange={handleCheck} />
                  </FlexContainer>
                  <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
                    <TestItemPreview
                      style={{ marginTop: -40, padding: 0, boxShadow: "none", display: "flex", flex: 11 }}
                      cols={_item}
                      previewTab="clear"
                      metaData={metaInfoData.id}
                      disableResponse
                      verticalDivider={item.verticalDivider}
                      scrolling={item.scrolling}
                      questions={questions}
                      windowWidth="100%"
                      isReviewTab
                    />
                  </AnswerContext.Provider>
                </FlexContainer>
                <FlexContainer style={{ flex: 1 }}>
                  {index === 0 && <PreviewButton onClick={() => onPreview(metaInfoData.id)}>Preview</PreviewButton>}
                  <FlexContainer flexDirection="column">
                    <PointsLabel>Points</PointsLabel>
                    <PointsInput
                      size="large"
                      type="number"
                      disabled={!owner || !isEditable}
                      value={
                        testItem.itemLevelScoring
                          ? testItem.itemLevelScore
                          : get(question, ["validation", "valid_response", "score"], 0)
                      }
                      onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
                    />
                  </FlexContainer>
                </FlexContainer>
              </FlexContainer>
            );
          })
        )}
        <FlexContainer style={{ margin: "20px 0" }}>
          <MetaInfoCell data={metaInfoData} />
        </FlexContainer>
      </TestItemWrapper>
    );
  }
);

const List = SortableContainer(
  ({
    rows,
    selected,
    setSelected,
    testItems,
    onChangePoints,
    types,
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

    const getPoints = i => {
      let item = null;
      if (scoring.testItems && scoring.testItems.length) {
        item = scoring.testItems.find(({ id }) => id === testItems[i].id);
      }

      return get(testItems, [i, "data", "questions"], []).reduce(
        (acc, q) => acc + (q.scoringDisabled ? 0 : get(q, ["validation", "valid_response", "score"], 0)),
        0
      );
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
              by: testItems[i].createdBy.name,
              shared: "0",
              likes: "0",
              types: types[testItems[i]._id],
              standards: standards[testItems[i]._id],
              audio: audioStatus(testItems[i])
            }}
            index={i}
            owner={owner}
            indx={i}
            isEditable={isEditable}
            item={item}
            testItem={testItems[i]}
            points={getPoints(i)}
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
  types: PropTypes.any.isRequired,
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
