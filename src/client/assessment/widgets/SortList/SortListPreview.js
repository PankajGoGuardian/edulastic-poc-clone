import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEqual, get } from "lodash";
import produce from "immer";

import { Paper, FlexContainer, Stimulus, InstructorStimulus } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { SHOW, CLEAR } from "../../constants/constantsForQuestions";

import DropContainer from "../../components/DropContainer";

import ShowCorrect from "./components/ShowCorrect";
import DragItem from "./components/DragItem";
import { FullWidthContainer } from "./styled/FullWidthContainer";
import { Title } from "./styled/Title";
import { FlexWithMargins } from "./styled/FlexWithMargins";
import { IconLeft } from "./styled/IconLeft";
import { IconRight } from "./styled/IconRight";
import { FlexCol } from "./styled/FlexCol";
import { IconUp } from "./styled/IconUp";
import { IconDown } from "./styled/IconDown";
import { getFontSize } from "../../utils/helpers";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

const styles = {
  dropContainerStyles: smallSize => ({
    marginBottom: smallSize ? 6 : 20,
    borderRadius: 4
  }),
  wrapperStyles: smallSize => ({ marginTop: smallSize ? 0 : 40 })
};
const SortListPreview = ({
  previewTab,
  t,
  smallSize,
  item,
  userAnswer,
  saveAnswer,
  showQuestionNumber,
  disableResponse,
  changePreviewTab
}) => {
  const { source = [], instructor_stimulus, stimulus } = item;

  const getItemsFromUserAnswer = () =>
    source.map((sourceItem, i) => {
      if (disableResponse || !userAnswer.includes(i)) {
        return sourceItem;
      }
      return null;
    });

  const getSelectedFromUserAnswer = () =>
    userAnswer && userAnswer.length > 0
      ? userAnswer.map(index => (index !== null ? source[index] : null))
      : Array.from({ length: source.length }).fill(null);

  const [items, setItems] = useState(getItemsFromUserAnswer());
  const [selected, setSelected] = useState(getSelectedFromUserAnswer());

  const [active, setActive] = useState("");

  useEffect(() => {
    setItems(getItemsFromUserAnswer());
    setSelected(getSelectedFromUserAnswer());
    setActive("");
  }, [source, userAnswer]);

  const onDrop = (itemCurrent, itemTo, flag) => {
    const { items: newItems, selected: newSelected } = produce({ items, selected }, draft => {
      let tmp = [];

      [tmp] = draft[flag].splice(itemCurrent.index, 1, draft[itemTo.flag][itemTo.index]);
      draft[itemTo.flag][itemTo.index] = tmp;
    });

    setItems(newItems);
    setSelected(newSelected);

    saveAnswer(newSelected.map(currentAns => (currentAns ? source.indexOf(currentAns) : null)));
  };

  const setActiveItem = activeItem => {
    setActive(typeof activeItem === "string" ? activeItem : "");
  };

  const onRightLeftClick = () => {
    const { items: newItems, selected: newSelected } = produce({ items, selected }, draft => {
      if (draft.items.includes(active)) {
        draft.items.splice(draft.items.indexOf(active), 1, null);
        draft.selected.splice(draft.selected.indexOf(null), 1, active);
      } else if (active && Object.keys(active).length !== 0) {
        draft.selected.splice(draft.selected.indexOf(active), 1, null);
        draft.items.splice(draft.items.indexOf(null), 1, active);
      }

      if (active) {
        saveAnswer(draft.selected.map(currentAns => (currentAns ? source.indexOf(currentAns) : null)));
      }
    });
    setItems(newItems);
    setSelected(newSelected);
  };

  const onUpDownClick = indicator => () => {
    let tmp;

    setSelected(
      produce(selected, draft => {
        if (draft.includes(active)) {
          const activeIndex = draft.indexOf(active);
          if (indicator === "Up" && activeIndex !== 0) {
            tmp = draft[activeIndex - 1];
            draft[activeIndex - 1] = draft[activeIndex];
            draft[activeIndex] = tmp;
          }
          if (indicator === "Down" && activeIndex !== draft.length - 1) {
            tmp = draft[activeIndex + 1];
            draft[activeIndex + 1] = draft[activeIndex];
            draft[activeIndex] = tmp;
          }

          saveAnswer(draft.map(currentAns => (currentAns ? source.indexOf(currentAns) : null)));
        }
      })
    );
  };

  const drop = ({ obj, index, flag }) => ({ obj, index, flag });

  const { validation } = item;

  const fontSize = getFontSize(get(item, "ui_style.fontsize"));
  const orientation = get(item, "ui_style.orientation");
  const flexDirection = orientation === "vertical" ? "column" : "row";

  let valid_response = validation && validation.valid_response && validation.valid_response.value;
  valid_response = valid_response || [];
  let alt_responses = validation && validation.alt_responses && validation.alt_responses;
  alt_responses = alt_responses || [];

  const inCorrectList = selected
    .filter((selectedItem, i) => selectedItem && selectedItem !== source[valid_response[i]])
    .concat(items.filter(i => i !== null));

  const validRespCorrect = selected.filter(
    (selectedItem, i) => selectedItem && selectedItem === source[valid_response[i]]
  );

  let altRespCorrect = [...validRespCorrect];

  alt_responses.forEach(ob => {
    const alt = selected.filter((selectedItem, i) => selectedItem && selectedItem === source[ob.value[i]]);
    if (alt.length > altRespCorrect.length) {
      altRespCorrect = [...alt];
    }
  });

  const paperStyle = {
    fontSize,
    padding: smallSize,
    boxShadow: smallSize ? "none" : "",
    overflow: "auto"
  };

  return (
    <Paper data-cy="sortListPreview" style={paperStyle}>
      <InstructorStimulus>{instructor_stimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        {stimulus && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />}
      </QuestionTitleWrapper>

      <FlexContainer
        data-cy="sortListComponent"
        flexDirection={flexDirection}
        alignItems="flex-start"
        style={styles.wrapperStyles(smallSize)}
      >
        <FullWidthContainer>
          {!smallSize && <Title smallSize={smallSize}>{t("component.sortList.containerSourcePreview")}</Title>}
          {items.map((draggableItem, i) => (
            <DropContainer
              key={i}
              noBorder={!!draggableItem}
              style={styles.dropContainerStyles(smallSize)}
              index={i}
              flag="items"
              obj={draggableItem}
              drop={drop}
            >
              <DragItem
                index={i}
                smallSize={smallSize}
                active={isEqual(active, draggableItem)}
                onClick={setActiveItem}
                flag="items"
                onDrop={onDrop}
                obj={draggableItem}
                disableResponse={disableResponse}
                changePreviewTab={changePreviewTab}
              />
            </DropContainer>
          ))}
        </FullWidthContainer>

        <FlexWithMargins smallSize={smallSize}>
          <IconLeft smallSize={smallSize} onClick={onRightLeftClick} />
          <IconRight smallSize={smallSize} onClick={onRightLeftClick} />
        </FlexWithMargins>

        <FullWidthContainer>
          {!smallSize && <Title smallSize={smallSize}>{t("component.sortList.containerTargetPreview")}</Title>}
          {selected.map((selectedItem, i) => (
            <DropContainer
              key={i}
              noBorder={!!selectedItem}
              style={styles.dropContainerStyles(smallSize)}
              index={i}
              flag="selected"
              obj={selectedItem}
              drop={drop}
            >
              <DragItem
                index={i}
                correct={altRespCorrect.includes(selectedItem)}
                smallSize={smallSize}
                previewTab={previewTab}
                flag="selected"
                active={isEqual(active, selectedItem)}
                onClick={setActiveItem}
                onDrop={onDrop}
                obj={disableResponse ? inCorrectList[valid_response[i]] : selectedItem}
                disableResponse={disableResponse}
                changePreviewTab={changePreviewTab}
              />
            </DropContainer>
          ))}
        </FullWidthContainer>

        <FlexCol smallSize={smallSize}>
          <IconUp smallSize={smallSize} onClick={onUpDownClick("Up")} />
          <IconDown smallSize={smallSize} onClick={onUpDownClick("Down")} />
        </FlexCol>
      </FlexContainer>

      {previewTab === SHOW && inCorrectList.length > 0 && (
        <ShowCorrect source={source} list={inCorrectList} correctList={valid_response} />
      )}
    </Paper>
  );
};

SortListPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  userAnswer: PropTypes.any.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  disableResponse: PropTypes.bool,
  changePreviewTab: PropTypes.func.isRequired
};

SortListPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  showQuestionNumber: false,
  qIndex: null,
  disableResponse: false
};

export default withNamespaces("assessment")(SortListPreview);
