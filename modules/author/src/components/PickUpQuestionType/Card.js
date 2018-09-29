import React from 'react';
import PropTypes from 'prop-types';

import { MultipleChoiceDisplay } from '../../../../assessment/src/components/MultipleChoice';
import { OrderListPreview } from '../../../../assessment/src/components/OrderList';
import { Content, Header, RoundDiv, QuestionText } from './components';
import { IconPlus } from '../common/icons';

const Card = ({ title, type, question, userSelections = [], options, onSelectQuestionType }) => (
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
        {type === 'mcq' && (
          <MultipleChoiceDisplay
            smallSize
            userSelections={userSelections}
            options={options.map((option, index) => ({ value: index, label: option }))}
            question={question}
            onChange={() => {}}
          />)
        }
        {type === 'orderlist' && (
          <React.Fragment>
            <QuestionText dangerouslySetInnerHTML={{ __html: question }} />
            <OrderListPreview
              smallSize
              onSortEnd={() => {}}
              questions={options}
            />
          </React.Fragment>
        )}
      </Content>
    </RoundDiv>
  </React.Fragment>
);

Card.propTypes = {
  options: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userSelections: PropTypes.array,
  onSelectQuestionType: PropTypes.func.isRequired,
};

Card.defaultProps = {
  userSelections: [],
};

export default Card;
