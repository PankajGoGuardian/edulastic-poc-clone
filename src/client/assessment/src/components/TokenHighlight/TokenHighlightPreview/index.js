import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import { Paper, Stimulus } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { lightGreen, green, lightRed, red } from '@edulastic/colors';

import { PREVIEW, EDIT, CLEAR, CHECK, SHOW } from '../../../constants/constantsForQuestions';

const TokenHighlightPreview = ({
  view,
  item,
  smallSize,
  saveAnswer,
  editCorrectAnswers,
  previewTab
}) => {
  const initialArray = item.templeWithTokens.map((el, i) => ({
    value: el.value,
    index: i,
    selected: !!smallSize
  }));

  const validArray =
    (item &&
      item.validation &&
      item.validation.valid_response &&
      item.validation.valid_response.value) ||
    [];

  const altArray = (item && item.validation && item.validation.alt_responses) || [];

  const [answers, setAnswers] = useState(initialArray);

  useEffect(
    () => {
      if (view === EDIT) {
        if (item.templeWithTokens.length === editCorrectAnswers.length) {
          setAnswers(editCorrectAnswers);
        } else {
          saveAnswer(initialArray);
        }
      }
    },
    [item.templeWithTokens, editCorrectAnswers]
  );

  const handleSelect = i => () => {
    const newAnswers = cloneDeep(answers);

    const foundedItem = newAnswers.find(elem => elem.index === i);
    foundedItem.selected = !foundedItem.selected;

    setAnswers(newAnswers);
    saveAnswer(newAnswers);
  };

  const validate = () => {
    const resultArray = new Set(validArray);

    altArray.forEach((el) => {
      el.value.forEach((ans) => {
        resultArray.add(ans);
      });
    });

    return [...resultArray];
  };

  const smallSizeStyles = {
    fontSize: smallSize ? 11 : 14,
    lineHeight: smallSize ? '18px' : '28px'
  };

  const getClass = index =>
    (answers.find(elem => elem.index === index) &&
    answers.find(elem => elem.index === index).selected
      ? 'active-word token answer'
      : 'token answer');

  const preview = previewTab === CHECK || previewTab === SHOW || smallSize;

  const rightAnswers = validate();

  const getStyles = (index) => {
    const condition =
      answers.find(elem => elem.index === index) &&
      answers.find(elem => elem.index === index).selected;

    let resultStyle;

    if (condition && !!rightAnswers.find(el => el.index === index && el.selected)) {
      resultStyle = { background: lightGreen, borderColor: green };
    } else if (condition) {
      resultStyle = {
        background: lightRed,
        borderColor: red
      };
    } else {
      resultStyle = {};
    }

    return { ...resultStyle, ...smallSizeStyles };
  };

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      {view === PREVIEW && !smallSize && (
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      )}
      {item.templeWithTokens.map((el, i) =>
        (el.active ? (
          <span
            onClick={handleSelect(i)}
            dangerouslySetInnerHTML={{ __html: el.value }}
            style={preview ? getStyles(i) : {}}
            key={i}
            className={getClass(i)}
          />
        ) : (
          <span
            style={smallSizeStyles}
            className="token without-cursor"
            dangerouslySetInnerHTML={{ __html: el.value }}
            key={i}
          />
        )))}
    </Paper>
  );
};

TokenHighlightPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  editCorrectAnswers: PropTypes.array,
  previewTab: PropTypes.string
};

TokenHighlightPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  editCorrectAnswers: []
};

export default withNamespaces('assessment')(TokenHighlightPreview);
