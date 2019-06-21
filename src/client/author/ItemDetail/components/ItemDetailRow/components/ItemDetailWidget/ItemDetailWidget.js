import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { Button } from "antd";
import { IconMoveArrows, IconPencilEdit, IconTrash } from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { DragSource } from "react-dnd";
import { withNamespaces } from "@edulastic/localization";

import QuestionWrapper from "../../../../../../assessment/components/QuestionWrapper";
import { Types } from "../../../../constants";
import { setItemDetailDraggingAction, setItemLevelScoreAction, setItemLevelScoringAction } from "../../../../ducks";
import { getQuestionByIdSelector, setQuestionScoreAction } from "../../../../../sharedDucks/questions";
import { Container, Buttons } from "./styled";
import { InputNumber } from "antd";
import { get } from "lodash";

const ItemDetailWidget = ({
  widget,
  onEdit,
  onDelete,
  isDragging,
  connectDragSource,
  connectDragPreview,
  t,
  widgetIndex,
  question,
  flowLayout,
  itemData,
  setItemLevelScoring,
  setItemLevelScore,
  setQuestionScore,
  rowIndex
}) => {
  const [showButtons, setShowButtons] = useState(!flowLayout);
  const onMouseEnterHander = () => {
    if (flowLayout) setShowButtons(true);
  };
  const onMouseLeaveHander = () => {
    if (flowLayout) setShowButtons(false);
  };
  return (
    connectDragPreview &&
    connectDragSource &&
    connectDragPreview(
      <div onMouseEnter={onMouseEnterHander} onMouseLeave={onMouseLeaveHander}>
        <Container isDragging={isDragging} flowLayout={flowLayout}>
          <div style={{ flex: "10" }}>
            {(widget.widgetType === "question" || widget.widgetType === "resource") && (
              <QuestionWrapper
                testItem
                qIndex={widgetIndex}
                type={widget.type}
                view="preview"
                questionId={widget.reference}
                data={{ ...question, smallSize: true }}
                flowLayout={flowLayout}
              />
            )}
          </div>

          {(!flowLayout || showButtons) && (
            <div style={{ flex: "1" }}>
              <Buttons>
                {itemData.itemLevelScoring && widgetIndex === 0 && (
                  <div className="points">
                    Points :{" "}
                    <input
                      className="ant-input"
                      type="number"
                      min={1}
                      value={itemData.itemLevelScore}
                      onChange={e => {
                        const v = parseFloat(e.target.value);
                        setItemLevelScore(v);
                      }}
                    />
                  </div>
                )}

                {!itemData.itemLevelScoring && (
                  <div className="points">
                    Points :{" "}
                    <input
                      className="ant-input"
                      type="number"
                      min={1}
                      value={get(question, "validation.valid_response.score", 0)}
                      onChange={e => {
                        const v = parseFloat(e.target.value);
                        setQuestionScore({ score: v, qid: question.id });
                        //
                      }}
                    />
                  </div>
                )}

                {connectDragSource(
                  <div>
                    <Button title={t("move")} shape="circle">
                      <IconMoveArrows color={white} style={{ fontSize: 11 }} width={16} height={16} />
                    </Button>
                  </div>
                )}
                <Button title={t("edit")} onClick={onEdit} shape="circle">
                  <IconPencilEdit color={white} width={16} height={16} />
                </Button>
                <Button title={t("delete")} onClick={onDelete} shape="circle">
                  <IconTrash color={white} width={16} height={16} />
                </Button>
              </Buttons>
            </div>
          )}
        </Container>
      </div>
    )
  );
};

ItemDetailWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  widgetIndex: PropTypes.number.isRequired,
  flowLayout: PropTypes.bool
};

const itemSource = {
  beginDrag({ setItemDetailDragging, widgetIndex, rowIndex }) {
    setTimeout(() => {
      setItemDetailDragging(true);
    }, 0);
    return {
      rowIndex,
      widgetIndex
    };
  },
  endDrag({ setItemDetailDragging }) {
    setItemDetailDragging(false);
    return {};
  }
};

function collect(c, monitor) {
  return {
    connectDragSource: c.dragSource(),
    connectDragPreview: c.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

const enhance = compose(
  withNamespaces("default"),
  connect(
    (state, { widget }) => ({ question: getQuestionByIdSelector(state, widget.reference) }),
    {
      setItemDetailDragging: setItemDetailDraggingAction,
      setItemLevelScoring: setItemLevelScoringAction,
      setItemLevelScore: setItemLevelScoreAction,
      setQuestionScore: setQuestionScoreAction
    }
  ),
  DragSource(Types.WIDGET, itemSource, collect)
);

export default enhance(ItemDetailWidget);
