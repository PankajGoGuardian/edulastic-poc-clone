import PropTypes from 'prop-types';
import React from 'react';

import QuestionListItem from './QuestionListItem';

const SidebarQuestionList = (props) => {
  const { questions, selectedQuestion } = props;
  return (
    <div>
      { 
        questions.map((item, index) => {
          let active = false;
          let beforeSelection = false;
          if (selectedQuestion === index) active = true;
          if (selectedQuestion >= index) beforeSelection = true;
          return <QuestionListItem index={index} active={active} beforeSelection={beforeSelection} key={index} />;
        })
      }
    </div>
  );
};

SidebarQuestionList.propTypes = {
  beforeSelection: PropTypes.bool,
  active: PropTypes.bool,
};

export default SidebarQuestionList;
