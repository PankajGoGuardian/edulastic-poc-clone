import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

// eslint-disable-next-line max-len
const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, t }) => {
  const results = userAnswers;
  return (
    <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
      <b style={{ fontSize: 13 }}>
        <span style={{ color: '#444' }}>{t('component.clozeImageDragDrop.draganddrop')}&nbsp;&nbsp;</span>
        <span style={{ color: '#878282' }}>{t('component.clozeImageDragDrop.theanswer')}</span>
      </b>
      <div style={{ marginRight: -20, marginLeft: -20 }}>
        {results.map((result, index) => (
          <div key={index} className="answer">
            &nbsp;<span className="text">{result}</span>&nbsp;
          </div>
        ))
        }
      </div>
    </div>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: '13px',
  userAnswers: []
};

export default React.memo(withNamespaces('assessment')(CorrectAnswerBoxLayout));
