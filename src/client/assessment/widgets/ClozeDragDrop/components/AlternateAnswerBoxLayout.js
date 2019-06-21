import React, { Component } from "react";
import PropTypes from "prop-types";
import { MathSpan } from "@edulastic/common";
class AlternateAnswerBoxLayout extends Component {
  render() {
    const { altAnswers, fontSize, groupResponses, hasGroupResponses } = this.props;
    let responses = [];
    if (hasGroupResponses) {
      groupResponses.forEach(groupResponse => {
        groupResponse.options.forEach(val => responses.push(val));
      });
    } else {
      responses = groupResponses;
    }
    const getLabel = value => {
      const item = responses.find(option => option.value === value);
      if (item) {
        return item.label;
      }
    };
    let alternateAnswers = {};
    altAnswers.forEach(altAnswer => {
      altAnswer.value.forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        alt = hasGroupResponses ? alt.data : alt;
        if (alt) {
          alternateAnswers[index + 1].push(getLabel(alt));
        }
      });
    });
    alternateAnswers = Object.keys(alternateAnswers).map(key => (
      <div key={key} className="response-btn check-answer showanswer">
        <span className="index">{key}</span>
        <MathSpan className="text" dangerouslySetInnerHTML={{ __html: alternateAnswers[key].join(", ") }} />
        &nbsp;
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
  fontSize: PropTypes.string,
  groupResponses: PropTypes.array
};

AlternateAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  altAnswers: [],
  groupResponses: []
};

export default AlternateAnswerBoxLayout;
