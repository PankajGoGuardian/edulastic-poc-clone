import React from 'react';
import PropTypes from 'prop-types';
import { IconPlus } from '@edulastic/icons';

import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import { Content, Header, RoundDiv } from './components';

const Card = ({ title, type, onSelectQuestionType }) => (
  <React.Fragment>
    <RoundDiv borderRadius={10}>
      <Header borderRadius={10}>
        {title}
      </Header>
      <Content borderRadius={10} onClick={() => onSelectQuestionType(type)}>
        <div className="add-icon">
          <IconPlus
            color="#fff"
            width={50}
            height={50}
          />
        </div>
        <QuestionWrapper
          type={type}
          view="preview"
          smallSize
        />
        {/* {type === 'mcq' && (
          <MultipleChoiceDisplay
            smallSize
            userSelections={userSelections}
            options={options.map((option, index) => ({ value: index, label: option }))}
            question={question}
            onChange={() => {}}
          />)
        }
        {type === 'orderList' && (
          <React.Fragment>
            <QuestionText dangerouslySetInnerHTML={{ __html: question }} />
            <OrderListPreview
              smallSize
              onSortEnd={() => {}}
              questions={options}
            />
          </React.Fragment>
        )} */}
      </Content>
    </RoundDiv>
  </React.Fragment>
);

Card.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onSelectQuestionType: PropTypes.func.isRequired,
};

export default Card;
