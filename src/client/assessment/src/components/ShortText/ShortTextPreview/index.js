import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { Paper, Stimulus, CorrectAnswersContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { lightGreen, lightRed } from '@edulastic/colors';
import styled from 'styled-components';
import { CHECK, SHOW, PREVIEW, CLEAR, CONTAINS } from '../../../constants/constantsForQuestions';

const ShortTextPreview = ({ view, saveAnswer, t, item, previewTab, smallSize, userAnswer }) => {
  const [text, setText] = useState(Array.isArray(userAnswer) ? '' : userAnswer);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    saveAnswer(val);
  };

  const validate = () => {
    let flag = false;

    if (item.validation.valid_response.value === text) {
      return true;
    }

    if (
      item.validation.valid_response.matching_rule === CONTAINS &&
      text &&
      text.toLowerCase().includes(item.validation.valid_response.value.toLowerCase())
    ) {
      return true;
    }

    item.validation.alt_responses.forEach((ite) => {
      if (ite.value === text) {
        flag = true;
      }

      if (
        ite.matching_rule === CONTAINS &&
        text &&
        text.toLowerCase().includes(ite.value.toLowerCase())
      ) {
        flag = true;
      }
    });

    return flag;
  };

  const preview = previewTab === CHECK || previewTab === SHOW;

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      {view === PREVIEW && !smallSize && (
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      )}

      {smallSize && (
        <SmallConainer>
          <SmallStim bold>{t('component.shortText.smallSizeTitle')}</SmallStim>

          <SmallStim>{t('component.shortText.smallSizePar')}</SmallStim>
        </SmallConainer>
      )}

      <Input
        style={preview ? (validate() ? { background: lightGreen } : { background: lightRed }) : {}}
        value={text}
        onChange={handleTextChange}
        size="large"
      />

      {previewTab === SHOW && (
        <CorrectAnswersContainer title={t('component.classification.correctAnswers')}>
          {item.validation.valid_response.value}
        </CorrectAnswersContainer>
      )}
    </Paper>
  );
};

ShortTextPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any.isRequired
};

ShortTextPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false
};

export default withNamespaces('assessment')(ShortTextPreview);

const SmallStim = styled(Stimulus)`
  font-size: 14px;
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
`;
const SmallConainer = styled.div`
  text-align: center;
  width: 100%;
`;
