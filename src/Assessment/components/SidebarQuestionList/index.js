import PropTypes from 'prop-types';
import React from 'react';

import QuestionListItem from './QuestionListItem';

const SidebarQuestionList = ({ questions, selectedQuestion }) => (
  <div>
    {questions.map((item, index) => {
      let active = false;
      let beforeSelection = false;
      if (selectedQuestion === index) active = true;
      if (selectedQuestion >= index) beforeSelection = true;
      return (
        <QuestionListItem
          index={index}
          active={active}
          beforeSelection={beforeSelection}
          key={index}
        />
      );
    })}
  </div>
);

SidebarQuestionList.propTypes = {
  questions: PropTypes.array.isRequired,
  selectedQuestion: PropTypes.array.isRequired,
};

export default SidebarQuestionList;
