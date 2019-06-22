import React, { Component } from "react";
import PropTypes from "prop-types";

class AlternateAnswerBoxLayout extends Component {
  render() {
    const { altAnswers, fontSize } = this.props;
    let alternateAnswers = {};
    altAnswers.forEach(altAnswer => {
      altAnswer.value.forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        if (alt !== "") {
          alternateAnswers[index + 1].push(alt);
        }
      });
    });
    alternateAnswers = Object.keys(alternateAnswers).map(key => (
      <div key={key} className="response-btn check-answer showanswer">
        <span className="index">{key}</span>
        <span className="text">{alternateAnswers[key].join(", ")}</span>&nbsp;
      </div>
    ));

    return (
      <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
        <h2 style={{ fontSize: 20 }}>Alternate Answer</h2>
        <div>{alternateAnswers}</div>
      </div>
    );
  }
}

AlternateAnswerBoxLayout.propTypes = {
  altAnswers: PropTypes.array,
  fontSize: PropTypes.string
};

AlternateAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  altAnswers: []
};

export default AlternateAnswerBoxLayout;
