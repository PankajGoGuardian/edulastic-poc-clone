import React from 'react';
import PropTypes from 'prop-types';

import OrderListPreview from '../OrderListPreview';
import { translate } from '../../../utils/localization';
import { Header, PointField } from './styled_components';

const CorrectAnswer = ({ response, onUpdatePoints, onSortCurrentAnswer }) => (
  <div>
    <Header>
      <PointField
        type="number"
        value={response.score}
        onChange={e => onUpdatePoints(+e.target.value)}
      />
      <span>{translate('component.orderlist.correctanswer.points')}</span>
    </Header>

    <OrderListPreview
      questions={response.value}
      onSortEnd={onSortCurrentAnswer}
      showAnswers={false}
    />
  </div>
);

CorrectAnswer.propTypes = {
  onSortCurrentAnswer: PropTypes.func.isRequired,
  response: PropTypes.object.isRequired,
  onUpdatePoints: PropTypes.func.isRequired,
};

export default CorrectAnswer;
