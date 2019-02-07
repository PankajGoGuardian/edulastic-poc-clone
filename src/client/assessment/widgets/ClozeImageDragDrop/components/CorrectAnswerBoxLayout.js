import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

// eslint-disable-next-line max-len
const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, t }) => {
  const results = userAnswers;
  return (
    <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
      <b style={{ fontSize }}>
        <span style={{ color: '#444' }}>
          {t('component.clozeImageDragDrop.draganddrop')}&nbsp;&nbsp;
        </span>
        <span style={{ color: '#878282' }}>{t('component.clozeImageDragDrop.theanswer')}</span>
      </b>
      <div style={{ marginTop: 10 }}>
        {results.map((result, index) => (
          <div
            key={index}
            className="imagelabeldragdrop-droppable active"
            style={{ margin: '8px 15px', marginLeft: 0, display: 'inline-flex' }}
          >
            <span className="index index-box" style={{ padding: 8 }}>
              {index + 1}
            </span>
            <span
              className="text container"
              style={{
                padding: '8px 15px',
                fontWeight: 'bold',
                width: 'auto',
                background: 'white'
              }}
            >
              {result && result.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: '13px',
  userAnswers: []
};

export default React.memo(withNamespaces('assessment')(CorrectAnswerBoxLayout));
