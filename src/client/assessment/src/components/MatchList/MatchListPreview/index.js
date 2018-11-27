import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from 'lodash';
import styled from 'styled-components';

import {
  Paper,
  FlexContainer,
  CorrectAnswersContainer,
  Stimulus,
  CorItem
} from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import {
  dashBorderColor,
  secondaryTextColor,
  mainTextColor,
  lightGreen,
  lightRed,
  white
} from '@edulastic/colors';

import { DropContainer } from '../../common';
import DragItem from './DragItem';

const styles = {
  dropContainerStyle: smallSize => ({
    width: '100%',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: smallSize ? 26 : 44,
    padding: 0
  }),
  listItemContainerStyle: { width: '100%', marginBottom: 6, marginTop: 6 },
  dragItemsContainerStyle: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: 140,
    borderRadius: 4
  }
};

const MatchListPreview = ({
  view,
  saveAnswer,
  item,
  t,
  previewTab,
  smallSize,
  editCorrectAnswers
}) => {
  const {
    possible_responses,
    stimulus,
    list,
    validation: {
      valid_response: { value: validArray },
      alt_responses: altArray
    }
  } = item;

  const [ans, setAns] = useState(Array.from({ length: list.length }).fill(null));

  const [dragItems, setDragItems] = useState(possible_responses);

  if (editCorrectAnswers.length > 0) {
    if (!isEqual(ans, editCorrectAnswers)) {
      setAns(editCorrectAnswers);
    }

    if (!isEqual(dragItems, possible_responses.filter(ite => !ans.includes(ite)))) {
      setDragItems(possible_responses.filter(ite => !ans.includes(ite)));
    }
  }

  const drop = ({ flag, index }) => ({ flag, index });

  const onDrop = (itemCurrent, itemTo) => {
    const answers = cloneDeep(ans);
    const dItems = cloneDeep(dragItems);

    if (itemTo.flag === 'ans') {
      if (dItems.includes(itemCurrent.item)) {
        dItems.splice(dItems.indexOf(itemCurrent.item), 1);
      }
      if (answers[itemTo.index] && answers[itemTo.index] !== itemCurrent.item) {
        dItems.push(ans[itemTo.index]);
      }
      if (answers.includes(itemCurrent.item)) {
        answers[answers.indexOf(itemCurrent.item)] = null;
      }

      answers[itemTo.index] = itemCurrent.item;
    } else if (answers.includes(itemCurrent.item)) {
      answers[answers.indexOf(itemCurrent.item)] = null;
      dItems.push(itemCurrent.item);
    }

    if (!isEqual(ans, answers)) {
      setAns(answers);
    }

    if (!isEqual(dItems, dragItems)) {
      setDragItems(dItems);
    }

    saveAnswer(answers);
  };

  const getStyles = ({ flag, preview, correct, isDragging }) => ({
    display: 'flex',
    width: flag === 'dragItems' ? 'auto' : '100%',
    alignItems: 'center',
    justifyContent: preview ? 'space-between' : 'center',
    margin: flag === 'dragItems' ? '10px 30px 10px 0' : '10px 0px 10px 0',
    background: preview ? (correct ? lightGreen : lightRed) : white,
    border: `1px solid ${dashBorderColor}`,
    height: 40,
    padding: preview ? 0 : '0 40px',
    cursor: 'pointer',
    borderRadius: 4,
    fontWeight: 600,
    color: mainTextColor,
    opacity: isDragging ? 0.5 : 1
  });

  const preview = previewTab === 'check' || previewTab === 'show';

  const validAnswers = ans.filter((ite, i) => ite === validArray[i]);

  let altAnswers = [];

  altArray.forEach((ite) => {
    let res = [];

    res = ans.filter((an, i) => ite.value[i] === an);

    if (res.length > altAnswers.length) {
      altAnswers = res;
    }
  });

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      {!smallSize && view === 'preview' && <Stimulus>{stimulus}</Stimulus>}

      <FlexContainer flexDirection="column" alignItems="flex-start">
        {list.map((ite, i) => (
          <FlexContainer
            key={i}
            style={styles.listItemContainerStyle}
            alignItems="center"
            childMarginRight={smallSize ? 13 : 45}
          >
            <ListItem smallSize={smallSize}>{ite}</ListItem>
            <Separator smallSize={smallSize} />
            <DropContainer
              noBorder={!!ans[i]}
              index={i}
              drop={drop}
              flag="ans"
              style={styles.dropContainerStyle(smallSize)}
            >
              <DragItem
                preview={preview}
                correct={validAnswers.includes(ans[i]) || altAnswers.includes(ans[i])}
                flag="ans"
                renderIndex={i}
                onDrop={onDrop}
                item={ans[i]}
                getStyles={getStyles}
              />
            </DropContainer>
          </FlexContainer>
        ))}
      </FlexContainer>
      {dragItems.length > 0 && (
        <CorrectAnswersContainer title={t('component.classification.dragItemsTitle')}>
          <DropContainer
            drop={drop}
            flag="dragItems"
            style={styles.dragItemsContainerStyle}
            noBorder
          >
            {dragItems.map((i, index) => (
              <DragItem
                flag="dragItems"
                onDrop={onDrop}
                key={index}
                item={i}
                getStyles={getStyles}
              />
            ))}
          </DropContainer>
        </CorrectAnswersContainer>
      )}

      {previewTab === 'show' && (
        <CorrectAnswersContainer title={t('component.classification.correctAnswers')}>
          {list.map((ite, i) => (
            <FlexContainer key={i} alignItems="center">
              <CorTitle>{ite}</CorTitle>
              <CorItem index={i}>{validArray[i]}</CorItem>
            </FlexContainer>
          ))}
        </CorrectAnswersContainer>
      )}
    </Paper>
  );
};

MatchListPreview.propTypes = {
  previewTab: PropTypes.string,
  editCorrectAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
};

MatchListPreview.defaultProps = {
  previewTab: 'clear',
  smallSize: false,
  editCorrectAnswers: []
};

export default withNamespaces('assessment')(MatchListPreview);

const CorTitle = styled.div`
  font-weight: 600;
  text-transform: uppercase;
`;

const Separator = styled.div`
  max-width: ${({ smallSize }) => (smallSize ? 22 : 47)}px;
  width: 100%;
  height: 0;
  position: relative;
  display: block;
  border: 1px solid ${secondaryTextColor};

  &:after {
    content: '';
    position: absolute;
    right: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    top: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    width: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    height: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    background: ${secondaryTextColor};
    display: block;
    border-radius: 50%;
  }

  &:before {
    content: '';
    position: absolute;
    left: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    top: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    width: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    height: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    background: ${secondaryTextColor};
    display: block;
    border-radius: 50%;
  }
`;

const ListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: ${({ smallSize }) => (smallSize ? 26 : 40)}px;
  border-radius: 4px;
  font-weight: 600;
  color: ${mainTextColor};
  border: 1px solid ${dashBorderColor};
`;
