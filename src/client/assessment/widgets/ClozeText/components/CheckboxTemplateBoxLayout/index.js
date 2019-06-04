import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { WithMathFormula } from "@edulastic/common";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const MathSpan = WithMathFormula(styled.span`
  user-select: none;
  line-height: ${props => props.lineHeight};
`);

let maxLineHeight = 40;

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  templateParts,
  responsecontainerindividuals,
  responseBtnStyle,
  fontSize,
  userSelections,
  stemNumeration,
  evaluation,
  showIndex,
  uiStyle
}) => {
  let responseIndex = 0;
  return (
    <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden" }}>
      {templateParts.map((templatePart, index) => {
        if (templatePart.indexOf('class="response-btn"') !== -1) {
          const dropTargetIndex = responseIndex;
          responseIndex++;
          let indexStr;
          const status = evaluation[dropTargetIndex] ? "right" : "wrong";

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
          const btnStyle = {
            width: showAnswer ? "auto" : 140,
            height: 0,
            widthpx: showAnswer ? "auto" : 140,
            heightpx: 0,
            position: "relative"
          };
          if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
            const { widthpx: widthpx1, heightpx: heightpx1 } = responsecontainerindividuals[dropTargetIndex];
            btnStyle.width = widthpx1;
            btnStyle.height = heightpx1;
            btnStyle.widthpx = widthpx1;
            btnStyle.heightpx = heightpx1;
          }
          if (btnStyle && btnStyle.width === 0 && !showAnswer) {
            btnStyle.width = responseBtnStyle.widthpx;
          } else {
            btnStyle.width = btnStyle.widthpx;
          }
          if (btnStyle && btnStyle.height === 0) {
            btnStyle.height = responseBtnStyle.heightpx;
          } else {
            btnStyle.height = btnStyle.heightpx;
          }
          if (uiStyle.widthpx) {
            btnStyle.width = uiStyle.widthpx;
          }
          maxLineHeight = maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight;
          return (
            <span key={index}>
              {showAnswer && (
                <span
                  className={`
                    response-btn 
                    ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : ""} 
                    ${evaluation[dropTargetIndex] ? "right" : "wrong"}
                    ${showAnswer ? "show-answer" : ""}`}
                  style={btnStyle}
                >
                  &nbsp;<span className="index">{responseIndex}</span>
                  <span
                    title={userSelections[dropTargetIndex]}
                    className="text"
                    style={{
                      width: "100%",
                      display: "block",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      lineHeight: 2.5
                    }}
                  >
                    {userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}
                  </span>
                  &nbsp;
                  <IconWrapper>
                    {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && (
                      <RightIcon />
                    )}
                    {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && (
                      <WrongIcon />
                    )}
                  </IconWrapper>
                </span>
              )}
              {!showAnswer && (
                <div
                  className={`response-btn 
                ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : ""} 
                ${evaluation[dropTargetIndex] ? "right" : "wrong"}
                `}
                  style={{
                    ...btnStyle,
                    overflow: "hidden"
                  }}
                >
                  {showIndex && (
                    <Fragment>
                      &nbsp;<span className="index">{responseIndex}</span>
                    </Fragment>
                  )}
                  <span
                    title={userSelections[dropTargetIndex]}
                    style={{
                      width: "100%",
                      display: "block",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      lineHeight: 2.5
                    }}
                    className="text"
                  >
                    {userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}
                  </span>
                  &nbsp;
                  <IconWrapper>
                    {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && (
                      <RightIcon />
                    )}
                    {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && (
                      <WrongIcon />
                    )}
                  </IconWrapper>
                </div>
              )}
            </span>
          );
        }
        return (
          <MathSpan lineHeight={`${maxLineHeight}px`} key={index} dangerouslySetInnerHTML={{ __html: templatePart }} />
        );
      })}
    </span>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array,
  fontSize: PropTypes.string,
  templateParts: PropTypes.array,
  responseBtnStyle: PropTypes.object,
  userSelections: PropTypes.array,
  stemNumeration: PropTypes.string,
  evaluation: PropTypes.array,
  showAnswer: PropTypes.bool,
  showIndex: PropTypes.bool,
  uiStyle: PropTypes.object
};

CheckboxTemplateBoxLayout.defaultProps = {
  responsecontainerindividuals: [],
  fontSize: "13px",
  templateParts: [],
  responseBtnStyle: {},
  userSelections: [],
  stemNumeration: "numerical",
  evaluation: [],
  showAnswer: false,
  showIndex: true
};

export default React.memo(CheckboxTemplateBoxLayout);
