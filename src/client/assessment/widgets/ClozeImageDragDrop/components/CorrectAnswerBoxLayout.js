import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { MathSpan } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, t, theme }) => {
  const results = userAnswers;
  return (
    <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
      <b style={{ fontSize }}>
        <span
          style={{
            color: theme.widgets.clozeImageDragDrop.correctAnswerBoxTitleColor
          }}
        >
          {t("component.cloze.imageDragDrop.draganddrop")}&nbsp;&nbsp;
        </span>
        <span
          style={{
            color: theme.widgets.clozeImageDragDrop.correctAnswerBoxSubtitleColor
          }}
        >
          {t("component.cloze.imageDragDrop.theanswer")}
        </span>
      </b>
      <div style={{ marginTop: 10 }}>
        {results.map((result, index) => (
          <div
            key={index}
            className="imagelabeldragdrop-droppable active"
            style={{
              margin: "8px 15px",
              marginLeft: 0,
              display: "inline-flex"
            }}
          >
            <div style={{ display: "flex", height: "100%" }}>
              <span
                className="index index-box"
                style={{
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "stretch",
                  height: "auto"
                }}
              >
                {index + 1}
              </span>
              <span
                className="text container"
                style={{
                  padding: "8px 15px",
                  fontWeight: theme.widgets.clozeImageDragDrop.correctAnswerBoxTextContainerFontWeight,
                  width: "auto",
                  background: theme.widgets.clozeImageDragDrop.correctAnswerBoxTextContainerBgColor,
                  minHeight: "40px",
                  minWidth: "35px"
                }}
              >
                <MathSpan dangerouslySetInnerHTML={{ __html: result && result.join(", ") }} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: []
};

export default withTheme(React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout)));
