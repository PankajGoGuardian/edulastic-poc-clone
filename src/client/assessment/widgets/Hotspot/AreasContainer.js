import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cloneDeep, isEqual } from "lodash";
import produce from "immer";
import { FlexContainer } from "@edulastic/common";
import { IconEraseText, IconRedo, IconUndo, IconDraw, IconTrash } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { DRAW_MODE, DELETE_MODE } from "../../constants/constantsForQuestions";

import SvgContainer from "./SvgContainer";
import SvgDeleteContainer from "./SvgDeleteContainer";
import { DrawingContainer } from "./styled/DrawingContainer";
import { AreaText } from "./styled/AreaText";
import { AreaButton } from "./styled/AreaButton";

const AreasContainer = ({ itemData, areas, width, imageSrc, height, t, setQuestionData }) => {
  const [history, setHistory] = useState([{ areas: [], points: [] }]);

  const [historyTab, setHistoryTab] = useState(0);

  const [mode, setMode] = useState(DRAW_MODE);

  useEffect(() => {
    if (history[historyTab] && !isEqual(history[historyTab].areas, areas, areas)) {
      const newHistory = cloneDeep(history);

      if (historyTab !== history.length - 1) {
        newHistory.splice(historyTab + 1);
      }

      newHistory.push({
        areas,
        points: []
      });

      setHistory(newHistory);
      setHistoryTab(newHistory.length - 1);
    }
  }, [areas]);

  const handleHistoryChange = (newAreas, points) => {
    const newHistory = cloneDeep(history);

    newHistory.splice(historyTab + 1);

    newHistory.push({ areas: newAreas, points: cloneDeep(points) });

    setHistory(newHistory);

    setHistoryTab(newHistory.length - 1);

    setQuestionData(
      produce(itemData, draft => {
        draft.areas = newAreas;
        draft.validation.validResponse.value = [];
        if (draft.validation.altResponses) {
          draft.validation.altResponses.forEach(altResponse => {
            altResponse.value = [];
          });
        }
      })
    );
  };

  const handleUndoClick = () => {
    setHistoryTab(historyTab - 1);
    setQuestionData({ ...itemData, areas: history[historyTab - 1].areas });
  };

  const handleRedoClick = () => {
    setHistoryTab(historyTab + 1);
    setQuestionData({
      ...itemData,
      areas: history[historyTab + 1] ? history[historyTab + 1].areas : []
    });
  };

  const handleClearClick = () => {
    setHistoryTab(0);

    setHistory([]);

    setQuestionData({ ...itemData, areas: [] });
  };

  const handleModeChange = newMode => () => {
    setMode(newMode);
  };

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer marginBottom="16px" justifyContent="flex-end">
        <AreaButton onClick={handleModeChange(DRAW_MODE)} active={mode === DRAW_MODE}>
          <IconDraw data-cy="area-draw" />
          <AreaText>{t("component.hotspot.draw")}</AreaText>
        </AreaButton>
        <AreaButton disabled={historyTab === 0} onClick={handleUndoClick}>
          <IconUndo data-cy="area-undo" />
          <AreaText>{t("component.hotspot.undo")}</AreaText>
        </AreaButton>
        <AreaButton disabled={history.length === 0 || historyTab === history.length - 1} onClick={handleRedoClick}>
          <IconRedo data-cy="area-redo" />
          <AreaText>{t("component.hotspot.redo")}</AreaText>
        </AreaButton>
        <AreaButton onClick={handleClearClick}>
          <IconEraseText data-cy="area-clear" />
          <AreaText>{t("component.hotspot.clear")}</AreaText>
        </AreaButton>
        <AreaButton onClick={handleModeChange(DELETE_MODE)} active={mode === DELETE_MODE}>
          <IconTrash data-cy="area-delete" />
          <AreaText>{t("component.hotspot.delete")}</AreaText>
        </AreaButton>
      </FlexContainer>
      <DrawingContainer>
        {imageSrc &&
          (mode === DRAW_MODE ? (
            <SvgContainer
              changeHistory={handleHistoryChange}
              areas={areas}
              history={history[historyTab]}
              width={width}
              height={height}
              itemData={itemData}
              imageSrc={imageSrc}
            />
          ) : (
            <SvgDeleteContainer
              areas={areas}
              history={history[historyTab]}
              width={width}
              height={height}
              itemData={itemData}
              imageSrc={imageSrc}
            />
          ))}
      </DrawingContainer>
    </FlexContainer>
  );
};

AreasContainer.propTypes = {
  t: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
  areas: PropTypes.array.isRequired,
  itemData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

export default connect(
  null,
  { setQuestionData: setQuestionDataAction }
)(withNamespaces("assessment")(AreasContainer));
