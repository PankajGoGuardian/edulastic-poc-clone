import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { IconTrash, IconPensilEdit } from '@edulastic/icons';

import { red, redDark, greenDark } from '@edulastic/colors';
import OrderListPreview from '../Display';
import { Header, PointField, HeaderInner } from './styled_components';

const CorrectAnswer = ({
  response,
  onUpdatePoints,
  onSortCurrentAnswer,
  t,
  showDelete,
  onDelete,
}) => (
  <div>
    <Header style={{ width: '100%' }}>
      <HeaderInner>
        <PointField
          type="number"
          value={response.score}
          icon={<IconPensilEdit color={greenDark} />}
          onChange={e => onUpdatePoints(+e.target.value)}
        />
        <span>{t('component.correctanswers.points')}</span>
      </HeaderInner>
      {showDelete && (
        <IconTrash
          color={red}
          onClick={onDelete}
          hoverColor={redDark}
          style={{ cursor: 'pointer' }}
        />
      )}
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
  showDelete: PropTypes.bool,
  onDelete: PropTypes.func,
};

CorrectAnswer.defaultProps = {
  showDelete: false,
  onDelete: () => {},
};

export default withNamespaces('assessment')(CorrectAnswer);
