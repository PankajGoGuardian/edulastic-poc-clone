import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import OrderListPreview from '../Display';
import { Header, PointField } from './styled_components';

const CorrectAnswer = ({ response, onUpdatePoints, onSortCurrentAnswer, t }) => (
  <div>
    <Header>
      <PointField
        type="number"
        value={response.score}
        onChange={e => onUpdatePoints(+e.target.value)}
      />
      <span>{t('component.orderlist.correctanswer.points')}</span>
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
  t: PropTypes.func.isRequired,
};

export default withNamespaces('assessment')(CorrectAnswer);
