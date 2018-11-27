import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cloneDeep, isEqual } from 'lodash';

import {
  Paper,
  FlexContainer,
  CorrectAnswersContainer,
  Stimulus,
  Subtitle
} from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { white, grey } from '@edulastic/colors';

import { DropContainer } from '../../common';
import DragItem from '../DragItem';
import { getStyles, IndexBox } from '../DragItem/StyledItem';

const styles = {
  itemContainerStyle: { display: 'flex', alignItems: 'center', margin: '10px 30px 10px 0' },
  previewItemStyle: {
    paddingRight: 15,
    paddingLeft: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    cursor: 'normal',
    fontWeight: 600
  },
  noPreviewItemStyle: {},
  columnContainerStyle: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '70px 50px',
    minHeight: 204,
    borderRadius: 4,
    backgroundColor: white
  },
  dragItemsContainerStyle: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: 140,
    borderRadius: 4
  },
  flexColumnsContainerStyle: smallSize => ({
    marginTop: smallSize ? 0 : 40,
    marginBottom: 160
  }),
  correctAnswersMargins: { marginBottom: 0, marginRight: 30 }
};

const ClassificationPreview = ({
  view,
  saveAnswer,
  item,
  t,
  previewTab,
  smallSize
  // editCorrectAnswers
}) => {
  const {
    possible_responses,
    stimulus,
    ui_style: {
      column_count: colCount,
      column_titles: colTitles,
      row_count: rowCount,
      row_titles: rowTitles
    },
    validation: {
      valid_response: { value: validArray },
      alt_responses: altArray
    }
  } = item;

  const [dragItems, setDragItems] = useState(possible_responses);

  const [answers, setAnswers] = useState(Array.from({ length: colCount * rowCount }, () => []));

  const columns = Array.from({ length: colCount }, () =>
    Array.from({ length: rowCount }).fill(null));

  const onDrop = (itemCurrent, itemTo) => {
    console.log(itemCurrent, itemTo);

    const dItems = cloneDeep(dragItems);
    const ansArrays = cloneDeep(answers);

    if (itemTo.flag === 'dragItems') {
      ansArrays.forEach((arr) => {
        if (arr.includes(itemCurrent.item)) {
          arr.splice(arr.indexOf(itemCurrent.item), 1);
        }
      });
      if (!isEqual(ansArrays, answers)) {
        setAnswers(ansArrays);
      }

      if (!dItems.includes(itemCurrent.item)) {
        dItems.push(itemCurrent.item);
        setDragItems(dItems);
      }
    } else {
      if (dItems.includes(itemCurrent.item)) {
        dItems.splice(dItems.indexOf(itemCurrent.item), 1);
        setDragItems(dItems);
      }
      /* Start */
      // const colIndex = +itemTo.flag.replace('column', '');
      /* Stop */
      ansArrays.forEach((arr, i) => {
        if (arr.includes(itemCurrent.item) && itemTo.index !== i) {
          arr.splice(arr.indexOf(itemCurrent.item), 1);
        } else if (!arr.includes(itemCurrent.item) && itemTo.index === i) {
          arr.push(itemCurrent.item);
        }
      });

      if (!isEqual(ansArrays, answers)) {
        setAnswers(ansArrays);
      }
    }

    saveAnswer(ansArrays);
  };

  const drop = ({ flag, index }) => ({ flag, index });

  const validateAnswers = () => {
    const valRespArray = [];
    const altRespArray = [];

    answers.forEach((arr, i) => {
      arr.forEach((ans) => {
        const indexOfAns = possible_responses.indexOf(ans);
        if (validArray[i].includes(indexOfAns)) {
          valRespArray.push(ans);
        }

        altArray.forEach((alt) => {
          if (alt.value[i].includes(indexOfAns)) {
            altRespArray.push(ans);
          }
        });
      });
    });

    return valRespArray.length >= altRespArray.length ? valRespArray : altRespArray;
  };

  const validatedAnswers = validateAnswers(validArray);

  const preview = previewTab === 'check' || previewTab === 'show';

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      {!smallSize && view === 'preview' && <Stimulus>{stimulus}</Stimulus>}

      <FlexContainer
        alignItems="flex-start"
        childMarginRight={37}
        style={styles.flexColumnsContainerStyle(smallSize)}
      >
        {columns.map((i, ind) => (
          <FullWidth key={ind}>
            {colTitles[ind] && <CenteredText>{colTitles[ind]}</CenteredText>}
            {i.map((ite, inde) => (
              <FlexContainer>
                {rowTitles[inde] && (
                  <CenteredText style={{ flex: 0.3 }}>{rowTitles[inde]}</CenteredText>
                )}
                <DropContainer
                  style={{ ...styles.columnContainerStyle, marginTop: colTitles[ind] ? 10 : 34 }}
                  drop={drop}
                  index={inde}
                  flag={`column${ind}`}
                >
                  {answers[inde].map((an, index) => (
                    <DragItem
                      valid={validatedAnswers.includes(an)}
                      preview={preview}
                      key={index}
                      renderIndex={possible_responses.indexOf(an)}
                      onDrop={onDrop}
                      item={an}
                    />
                  ))}
                </DropContainer>
              </FlexContainer>
            ))}
          </FullWidth>
        ))}
      </FlexContainer>

      {dragItems.length > 0 && (
        <CorrectAnswersContainer title={t('component.classification.dragItemsTitle')}>
          <DropContainer
            flag="dragItems"
            drop={drop}
            style={styles.dragItemsContainerStyle}
            noBorder
          >
            {dragItems.map((i, index) => (
              <DragItem
                key={index}
                preview={preview}
                renderIndex={possible_responses.indexOf(i)}
                onDrop={onDrop}
                item={i}
              />
            ))}
          </DropContainer>
        </CorrectAnswersContainer>
      )}

      {previewTab === 'show' && (
        <CorrectAnswersContainer title={t('component.classification.correctAnswers')}>
          {validArray.map((arr, i) => (
            <FlexContainer>
              <Subtitle style={styles.correctAnswersMargins}>{colTitles[i]}</Subtitle>
              {arr.map(index => (
                <div style={styles.itemContainerStyle} key={index}>
                  <IndexBox preview={preview}>{index + 1}</IndexBox>
                  <div
                    style={getStyles(
                      false,
                      white,
                      grey,
                      preview ? styles.previewItemStyle : styles.noPreviewItemStyle
                    )}
                  >
                    {possible_responses[index]}
                  </div>
                </div>
              ))}
            </FlexContainer>
          ))}
        </CorrectAnswersContainer>
      )}
    </Paper>
  );
};

ClassificationPreview.propTypes = {
  previewTab: PropTypes.string,
  // editCorrectAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
};

ClassificationPreview.defaultProps = {
  previewTab: 'clear',
  smallSize: false
  // editCorrectAnswers: []
};

export default withNamespaces('assessment')(ClassificationPreview);

const FullWidth = styled.div`
  width: 100%;
`;

const CenteredText = styled(FullWidth)`
  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 15px;
`;
