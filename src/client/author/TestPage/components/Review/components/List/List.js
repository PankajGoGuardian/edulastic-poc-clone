import React from "react";
import PropTypes from "prop-types";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";

import { FlexContainer } from "@edulastic/common";

import TestItemPreview from "../../../../../../assessment/components/TestItemPreview";
import MetaInfoCell from "../ReviewItemsTable/MetaInfoCell/MetaInfoCell";
import { TestItemWrapper, PreviewButton, PointsInput, PointsLabel, QuestionIndex, QuestionCheckbox } from "./styled";

const SortableItem = SortableElement(
  ({ indx, selected, item, onCheck, points, onChangePoints, metaInfoData, onPreview, questions, mobile }) => {
    const DragHandle = SortableHandle(() => <QuestionIndex>Q{indx + 1}</QuestionIndex>);
    const handleCheck = e => onCheck(indx, e.target.checked);
    return (
      <TestItemWrapper>
        {mobile ? (
          <FlexContainer flexDirection="column" alignItems="flex-start">
            <FlexContainer justifyContent="space-between" style={{ width: "100%", marginBottom: "15px" }}>
              <FlexContainer flexDirection="column" justifyContent="center">
                <DragHandle />
                <QuestionCheckbox checked={selected.includes(indx)} onChange={handleCheck} />
              </FlexContainer>

              <FlexContainer>
                <PreviewButton onClick={() => onPreview(metaInfoData.id)}>Preview</PreviewButton>
                <FlexContainer flexDirection="column">
                  <PointsLabel>Points</PointsLabel>
                  <PointsInput
                    size="large"
                    type="number"
                    value={points}
                    onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
                  />
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer>
              <TestItemPreview
                style={{ marginTop: -40, padding: 0, boxShadow: "none", display: "flex" }}
                cols={item}
                previewTab="clear"
                verticalDivider={item.verticalDivider}
                scrolling={item.scrolling}
                questions={questions}
                windowWidth="100%"
              />
            </FlexContainer>
          </FlexContainer>
        ) : (
          <FlexContainer justifyContent="space-between" alignItems="flex-start">
            <FlexContainer alignItems="flex-start">
              <FlexContainer flexDirection="column" justifyContent="center">
                <DragHandle />
                <QuestionCheckbox checked={selected.includes(indx)} onChange={handleCheck} />
              </FlexContainer>

              <TestItemPreview
                style={{ marginTop: -40, padding: 0, boxShadow: "none", display: "flex" }}
                cols={item}
                previewTab="clear"
                verticalDivider={item.verticalDivider}
                scrolling={item.scrolling}
                questions={questions}
                windowWidth="100%"
              />
            </FlexContainer>
            <FlexContainer>
              <PreviewButton onClick={() => onPreview(metaInfoData.id)}>Preview</PreviewButton>
              <FlexContainer flexDirection="column">
                <PointsLabel>Points</PointsLabel>
                <PointsInput
                  size="large"
                  type="number"
                  value={points}
                  onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
                />
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
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
    standards,
    scoring,
    onPreview,
    questions,
    mobile
  }) => {
    const handleCheckboxChange = (index, checked) => {
      if (checked) {
        setSelected([...selected, index]);
      } else {
        const removeIndex = selected.findIndex(item => item === index);
        const newSelected = [...selected];

        newSelected.splice(removeIndex, 1);
        setSelected(newSelected);
      }
    };

    const getPoints = i => {
      let item = null;
      if (scoring.testItems && scoring.testItems.length) {
        item = scoring.testItems.find(({ id }) => id === testItems[i].id);
      }

      return testItems && testItems[i] && testItems[i].maxScore ? testItems[i].maxScore : 0;
    };

    return (
      <div>
        {rows.map((item, i) => (
          <SortableItem
            key={i}
            metaInfoData={{
              id: testItems[i].id,
              by: "Kevin Hart",
              shared: "9578 (1)",
              likes: 9,
              types: types[testItems[i].id],
              standards: standards[testItems[i].id]
            }}
            index={i}
            indx={i}
            item={item}
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
  standards: PropTypes.object.isRequired,
  scoring: PropTypes.object.isRequired,
  questions: PropTypes.object.isRequired,
  mobile: PropTypes.bool
};

List.defaultProps = {
  mobile: false
};

export default List;
