import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { MathSpan } from "@edulastic/common";
import Draggable from "../Draggable";
import Droppable from "../Droppable";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  templateParts,
  options,
  hasGroupResponses,
  responsecontainerindividuals,
  responseBtnStyle,
  fontSize,
  userSelections,
  stemNumeration,
  evaluation,
  onDropHandler,
  showIndex
}) => {
  let responseIndex = 0;

  console.log("props passed to the component", {
    showAnswer,
    templateParts,
    options,
    hasGroupResponses,
    responsecontainerindividuals,
    responseBtnStyle,
    fontSize,
    userSelections,
    stemNumeration,
    evaluation,
    onDropHandler,
    showIndex
  });

  const getLabel = dropTargetIndex => {
    let formulaLabel = "";
    if (!hasGroupResponses && userSelections[dropTargetIndex]) {
      const foundedItem = options.find(option => option.value === userSelections[dropTargetIndex]);
      if (foundedItem) {
        formulaLabel = foundedItem.label;
      }
    } else if (userSelections[dropTargetIndex] && userSelections[dropTargetIndex].data) {
      const foundedGroup = options.find(option =>
        option.options.find(inOption => inOption.value === userSelections[dropTargetIndex].data)
      );
      if (foundedGroup) {
        const foundItem = foundedGroup.options.find(
          inOption => inOption.value === userSelections[dropTargetIndex].data
        );
        if (foundItem) {
          formulaLabel = foundItem.label;
        }
      }
    }
    return <MathSpan dangerouslySetInnerHTML={{ __html: formulaLabel }} />;
  };

  return (
    <div className="template_box" style={{ fontSize, padding: 20 }}>
      {templateParts.map((templatePart, index) => {
        if (templatePart.indexOf('class="response-btn"') !== -1) {
          const dropTargetIndex = responseIndex;
          responseIndex++;
          let indexStr;
          const status =
            userSelections.length > 0 && evaluation.length > 0
              ? evaluation[dropTargetIndex]
                ? "right"
                : "wrong"
              : null;
          const choiceAttempted = userSelections.length > 0 ? (userSelections[dropTargetIndex] ? true : false) : null;
          switch (stemNumeration) {
            case "lowercase": {
              indexStr = ALPHABET[dropTargetIndex];
              break;
            }
            case "uppercase": {
              indexStr = ALPHABET[dropTargetIndex].toUpperCase();
              break;
            }
            case "numerical": {
              indexStr = dropTargetIndex + 1;
              break;
            }
            default:
          }
          let btnStyle = responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex];
          if (btnStyle === undefined) {
            btnStyle = responseBtnStyle;
          }
          if (btnStyle && btnStyle.widthpx === 0) {
            btnStyle.widthpx = responseBtnStyle.widthpx;
          }
          if (btnStyle && btnStyle.heightpx === 0) {
            btnStyle.heightpx = responseBtnStyle.heightpx;
          }
          if (btnStyle && btnStyle.wordwrap === undefined) {
            btnStyle.wordwrap = responseBtnStyle.wordwrap;
          }
          return (
            <div key={index}>
              {showAnswer && hasGroupResponses && (
                <div
                  className={`
                    response-btn 
                    ${choiceAttempted ? "check-answer" : ""}
                    ${status} 
                    ${showAnswer ? "show-answer" : ""}`}
                  style={btnStyle}
                >
                  &nbsp;<span className="index">{responseIndex}</span>
                  <span className="text">{getLabel(dropTargetIndex)}</span>
                  &nbsp;
                  <IconWrapper>
                    {choiceAttempted && status === "right" && <RightIcon />}
                    {choiceAttempted && status === "wrong" && <WrongIcon />}
                  </IconWrapper>
                </div>
              )}
              {showAnswer && !hasGroupResponses && (
                <div
                  className={`
                    response-btn 
                    ${choiceAttempted ? "check-answer" : ""} 
                    ${status} 
                    ${showAnswer ? "show-answer" : ""}`}
                  style={btnStyle}
                >
                  &nbsp;<span className="index">{responseIndex}</span>
                  <span className="text">{getLabel(dropTargetIndex)}</span>
                  &nbsp;
                  <IconWrapper>
                    {choiceAttempted && status === "right" && <RightIcon />}
                    {choiceAttempted && status === "wrong" && <WrongIcon />}
                  </IconWrapper>
                </div>
              )}
              <Droppable drop={() => ({ dropTargetIndex })}>
                {!showAnswer && hasGroupResponses && (
                  <Draggable
                    onDrop={onDropHandler}
                    data={`${getLabel(dropTargetIndex)}_${userSelections[dropTargetIndex] &&
                      userSelections[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
                  >
                    <div
                      className={`
                      response-btn 
                      ${choiceAttempted ? "check-answer" : ""} 
                      ${status}`}
                      style={btnStyle}
                    >
                      {showIndex && (
                        <Fragment>
                          &nbsp;<span className="index">{responseIndex}</span>
                        </Fragment>
                      )}
                      <span className="text">{getLabel(dropTargetIndex)}</span>
                      &nbsp;
                      <IconWrapper>
                        {choiceAttempted && status === "right" && <RightIcon />}
                        {choiceAttempted && status === "wrong" && <WrongIcon />}
                      </IconWrapper>
                    </div>
                  </Draggable>
                )}
                {!showAnswer && !hasGroupResponses && (
                  <Draggable onDrop={onDropHandler} data={`${getLabel(dropTargetIndex)}_${dropTargetIndex}_fromResp`}>
                    <div
                      className={`
                      response-btn 
                      ${choiceAttempted ? "check-answer" : ""}
                      ${status}`}
                      style={btnStyle}
                    >
                      {showIndex && (
                        <Fragment>
                          &nbsp;<span className="index">{responseIndex}</span>
                        </Fragment>
                      )}
                      <span className="text">{getLabel(dropTargetIndex)}</span>
                      &nbsp;
                      <IconWrapper>
                        {choiceAttempted && status === "right" && <RightIcon />}
                        {choiceAttempted && status === "wrong" && <WrongIcon />}
                      </IconWrapper>
                    </div>
                  </Draggable>
                )}
              </Droppable>
            </div>
          );
        }
        return <MathSpan key={index} dangerouslySetInnerHTML={{ __html: templatePart }} />;
      })}
    </div>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array,
  fontSize: PropTypes.string,
  templateParts: PropTypes.array,
  options: PropTypes.array,
  responseBtnStyle: PropTypes.object,
  hasGroupResponses: PropTypes.bool,
  userSelections: PropTypes.array,
  stemNumeration: PropTypes.string,
  evaluation: PropTypes.array,
  showAnswer: PropTypes.bool,
  onDropHandler: PropTypes.func,
  showIndex: PropTypes.bool
};

CheckboxTemplateBoxLayout.defaultProps = {
  responsecontainerindividuals: [],
  fontSize: "13px",
  templateParts: [],
  options: [],
  responseBtnStyle: {},
  hasGroupResponses: false,
  userSelections: [],
  stemNumeration: "numerical",
  evaluation: [],
  showAnswer: false,
  showIndex: true,
  onDropHandler: () => {}
};

export default React.memo(CheckboxTemplateBoxLayout);
