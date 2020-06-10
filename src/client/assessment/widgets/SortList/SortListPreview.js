import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { isEqual, get } from "lodash";
import produce from "immer";

import {
  FlexContainer,
  Stimulus,
  QuestionNumberLabel,
  AnswerContext,
  QuestionSubLabel,
  QuestionContentWrapper,
  QuestionLabelWrapper
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { ChoiceDimensions } from "@edulastic/constants";

import { compose } from "redux";
import { withTheme } from "styled-components";
import { SHOW, CLEAR, EDIT } from "../../constants/constantsForQuestions";
import Instructions from "../../components/Instructions";
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
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import { StyledPaperWrapper } from "../../styled/Widget";
import { Container } from "./styled/Container";

const {
  maxWidth: choiceDefaultMaxW,
  minWidth: choiceDefaultMinW,
  minHeight: choiceDefaultMinH,
  maxHeight: choiceDefaultMaxH
} = ChoiceDimensions;

const SortListPreview = ({
  previewTab: _previewTab,
  t,
  smallSize,
  item,
  view,
  userAnswer,
  saveAnswer,
  showQuestionNumber,
  disableResponse,
  changePreviewTab,
  isReviewTab,
  isPrintPreview,
  theme: {
    answerBox: { borderWidth, borderStyle, borderColor }
  }
}) => {
  const answerContextConfig = useContext(AnswerContext);
  const { expressGrader, isAnswerModifiable } = answerContextConfig;
  let previewTab = _previewTab;
  if (expressGrader && !isAnswerModifiable) {
    /**
     * ideally wanted to be in CHECK mode.
     * But this component seems to be
     * written to work with only SHOW & CLEAR
     */
    previewTab = SHOW;
  } else if (expressGrader && isAnswerModifiable) {
    previewTab = CLEAR;
  }

  const { source = [], stimulus } = item;

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
    if (previewTab === CLEAR) {
      setActive(typeof activeItem === "string" ? activeItem : "");
    } else {
      changePreviewTab(CLEAR);
      setActive(typeof activeItem === "string" ? activeItem : "");
    }
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

    // we want users to be able to interact with the items,
    // when in other modes user can't do that
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
    }

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

    // we want users to be able to interact with the items,
    // when in other modes user can't do that
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
    }
  };

  const drop = ({ obj, index, flag }) => ({ obj, index, flag });

  const fontSize = getFontSize(get(item, "uiStyle.fontsize"));
  const orientation = get(item, "uiStyle.orientation");
  const isVertical = orientation === "vertical";
  const flexDirection = isPrintPreview || isVertical ? "column" : "row";
  const stemNumeration = get(item, "uiStyle.validationStemNumeration", "");

  const validResponse = get(item, "validation.validResponse.value", []);
  const altResponses = get(item, "validation.altResponses", []);

  const validResponseCorrectList = source.map((ans, i) => source[validResponse[i]]);
  const altResponseCorrectList = altResponses.map((altResponse, arIndex) =>
    source.map((ans, i) => source[altResponses[arIndex].value[i]])
  );

  const validRespCorrect = selected.filter(
    (selectedItem, i) => selectedItem && selectedItem === source[validResponse[i]]
  );

  let altRespCorrect = [...validRespCorrect];

  altResponses.forEach(ob => {
    const alt = selected.filter((selectedItem, i) => selectedItem && selectedItem === source[ob.value[i]]);
    if (alt.length > altRespCorrect.length) {
      altRespCorrect = [...alt];
    }
  });

  /**
   * calculate styles based on question JSON here
   */
  const dragItemMinWidth = get(item, "uiStyle.choiceMinWidth", choiceDefaultMinW);
  const dragItemMaxWidth = get(item, "uiStyle.choiceMaxWidth", choiceDefaultMaxW);

  const paperStyle = {
    fontSize,
    padding: smallSize,
    boxShadow: smallSize ? "none" : "",
    position: "relative"
  };

  const contentStyle = {
    minWidth: 580,
    maxWidth: isPrintPreview ? "100%" : 980,
    margin: "auto",
    overflow: isPrintPreview ? "" : "auto"
  };

  const wrapperStyles = {
    marginTop: smallSize ? 0 : 40,
    width: isPrintPreview ? "100%" : dragItemMaxWidth * 2 + 180
  };

  const dragItemStyle = {
    minWidth: dragItemMinWidth,
    maxWidth: dragItemMaxWidth,
    minHeight: choiceDefaultMinH,
    maxHeight: choiceDefaultMaxH,
    overflow: "hidden"
  };

  const sourceItemStyle = {
    marginBottom: smallSize ? 6 : 12,
    borderRadius: 4,
    transform: "translate3d(0px, 0px, 0px)",
    ...dragItemStyle
  };

  const targetItemStyle = {
    marginBottom: smallSize ? 6 : 12,
    borderRadius: 4,
    transform: "translate3d(0px, 0px, 0px)",
    ...dragItemStyle
  };

  return (
    <StyledPaperWrapper data-cy="sortListPreview" style={paperStyle}>
      <FlexContainer justifyContent="flex-start" alignItems="baseline">
        <QuestionLabelWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
          {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
        </QuestionLabelWrapper>

        <QuestionContentWrapper>
          <QuestionTitleWrapper>
            {stimulus && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />}
          </QuestionTitleWrapper>

          <Container style={contentStyle}>
            <FlexContainer
              data-cy="sortListComponent"
              flexDirection={flexDirection}
              alignItems="stretch"
              style={wrapperStyles}
              flexWrap="nowrap"
              className="sort-list-wrapper"
            >
              <FullWidthContainer isVertical={isVertical}>
                {!smallSize && <Title smallSize={smallSize}>{t("component.sortList.containerSourcePreview")}</Title>}
                {items.map((draggableItem, i) => (
                  <DropContainer
                    key={i}
                    noBorder={!!draggableItem}
                    style={sourceItemStyle}
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
                      items={selected}
                      flag="items"
                      onDrop={onDrop}
                      obj={draggableItem}
                      style={dragItemStyle}
                      disableResponse={disableResponse || !isAnswerModifiable}
                      stemNumeration={stemNumeration}
                    />
                  </DropContainer>
                ))}
              </FullWidthContainer>

              <FlexWithMargins smallSize={smallSize} flexDirection={flexDirection} flexWrap="nowrap">
                {isVertical ? (
                  <>
                    <IconUp smallSize={smallSize} onClick={!disableResponse ? onRightLeftClick : () => {}} />
                    <IconDown smallSize={smallSize} onClick={!disableResponse ? onRightLeftClick : () => {}} />
                  </>
                ) : (
                  <>
                    <IconLeft smallSize={smallSize} onClick={!disableResponse ? onRightLeftClick : () => {}} />
                    <IconRight smallSize={smallSize} onClick={!disableResponse ? onRightLeftClick : () => {}} />
                  </>
                )}
              </FlexWithMargins>

              <FullWidthContainer isVertical={isVertical}>
                {!smallSize && <Title smallSize={smallSize}>{t("component.sortList.containerTargetPreview")}</Title>}
                {selected.map((selectedItem, i) => (
                  <DropContainer
                    key={i}
                    noBorder={!!selectedItem}
                    style={targetItemStyle}
                    index={i}
                    flag="selected"
                    obj={selectedItem}
                    drop={drop}
                  >
                    <DragItem
                      index={i}
                      correct={altRespCorrect.includes(selectedItem) || isReviewTab === true}
                      smallSize={smallSize}
                      previewTab={previewTab}
                      flag="selected"
                      active={isEqual(active, selectedItem)}
                      onClick={setActiveItem}
                      onDrop={onDrop}
                      items={items}
                      style={dragItemStyle}
                      obj={
                        userAnswer.length !== 0
                          ? selectedItem
                          : isReviewTab === true
                          ? validResponseCorrectList[i]
                          : null
                      }
                      isReviewTab={isReviewTab}
                      disableResponse={disableResponse || !isAnswerModifiable}
                      changePreviewTab={changePreviewTab}
                      stemNumeration={stemNumeration}
                    />
                  </DropContainer>
                ))}
              </FullWidthContainer>

              <FlexCol smallSize={smallSize}>
                <IconUp smallSize={smallSize} onClick={!disableResponse ? onUpDownClick("Up") : () => {}} />
                <IconDown smallSize={smallSize} onClick={!disableResponse ? onUpDownClick("Down") : () => {}} />
              </FlexCol>
            </FlexContainer>
          </Container>
          {view && view !== EDIT && <Instructions item={item} />}
          {(previewTab === SHOW || isReviewTab) && (
            <ShowCorrect
              source={source}
              list={validResponseCorrectList}
              altList={altResponseCorrectList}
              altResponses={altResponses}
              correctList={validResponse}
              itemStyle={{ ...dragItemStyle, border: `${borderWidth} ${borderStyle} ${borderColor}` }}
              stemNumeration={stemNumeration}
            />
          )}
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
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
  disableResponse: PropTypes.bool,
  changePreviewTab: PropTypes.func.isRequired,
  isReviewTab: PropTypes.bool
};

SortListPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(SortListPreview);
