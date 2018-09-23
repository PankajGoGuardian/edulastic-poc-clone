import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField } from '../../common';
import OrderListPreview from '../OrderListPreview';
import { lightGrey } from '../../../utilities/css';
import { translate } from '../../../utilities/localization';

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

const Header = styled.div`
  padding: 10px;
  background: ${lightGrey};
  display: flex;
  align-items: center;
`;

const PointField = styled(TextField)`
  width: 100px;
  padding: 0 0 0 40px;
  margin-right: 25px;
`;
