import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Select, Input } from 'antd';

import { Paper, Stimulus, FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { secondaryTextColor } from '@edulastic/colors';

import {
  PREVIEW,
  BY_LOCATION_METHOD,
  BY_COUNT_METHOD,
  EDIT,
  CLEAR,
  CHECK,
  SHOW
} from '../../../constants/constantsForQuestions';
import ShadesView from '../ShadesView';
import { Subtitle } from '../../common';

const { Option } = Select;

const ShadingPreview = ({
  view,
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  method,
  t,
  previewTab
}) => {
  const { canvas, validation } = item;

  const cell_width = canvas ? canvas.cell_width : 1;
  const cell_height = canvas ? canvas.cell_height : 1;
  const row_count = canvas ? canvas.row_count : 1;
  const column_count = canvas ? canvas.column_count : 1;
  const shaded = canvas ? canvas.shaded : [];
  const read_only_author_cells = canvas ? canvas.read_only_author_cells : false;

  const validAnswer =
    validation &&
    validation.valid_response &&
    validation.valid_response.value &&
    validation.valid_response.value.value;
  const altAnswers = validation && validation.alt_responses;

  useEffect(
    () => {
      if (view === PREVIEW) {
        if (!read_only_author_cells) {
          saveAnswer(shaded);
        }
      }
    },
    [view]
  );

  const validate = () => {
    const collection = Array.isArray(validAnswer) ? cloneDeep(validAnswer) : [validAnswer];

    altAnswers.forEach((answer) => {
      if (Array.isArray(answer.value.value)) {
        answer.value.value.forEach((val) => {
          if (!collection.includes(val)) {
            collection.push(val);
          }
        });
      } else if (!collection.includes(answer.value.value)) {
        collection.push(answer.value.value);
      }
    });

    return collection;
  };

  const correctAnswers = validation ? validate() : [];

  const handleCellClick = (rowNumber, colNumber) => () => {
    const newUserAnswer = cloneDeep(userAnswer);

    const indexOfSameShade = newUserAnswer.findIndex(
      shade => shade[0] === rowNumber && shade[1] === colNumber
    );

    if (indexOfSameShade === -1) {
      newUserAnswer.push([rowNumber, colNumber]);
    } else {
      newUserAnswer.splice(indexOfSameShade, 1);
    }

    saveAnswer(newUserAnswer);
  };

  const handleSelectMethod = (value) => {
    saveAnswer(value, true);
  };

  const preview = previewTab === CHECK || previewTab === SHOW;

  const shadedByProps = Array.isArray(userAnswer)
    ? !read_only_author_cells
      ? userAnswer.filter(
        shade => !shaded.every(pair => pair[0] !== shade[0] && pair[1] !== shade[1])
      )
      : userAnswer
    : [];

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      {view === PREVIEW && !smallSize && (
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      )}
      <FlexContainer alignItems="flex-start" flexDirection="column">
        {view === EDIT && (
          <Fragment>
            <Subtitle padding="0 0 16px 0" fontSize={13} color={secondaryTextColor}>
              {t('component.shading.methodSubtitle')}
            </Subtitle>
            <Select style={{ width: 320 }} value={method} onChange={handleSelectMethod}>
              <Option value={BY_LOCATION_METHOD}>{BY_LOCATION_METHOD}</Option>
              <Option value={BY_COUNT_METHOD}>{BY_COUNT_METHOD}</Option>
            </Select>
          </Fragment>
        )}

        {view === PREVIEW && (
          <ShadesView
            cellWidth={cell_width}
            cellHeight={cell_height}
            rowCount={row_count}
            correctAnswers={correctAnswers}
            showAnswers={preview}
            colCount={column_count}
            onCellClick={handleCellClick}
            shaded={Array.isArray(userAnswer) ? userAnswer : []}
            lockedCells={read_only_author_cells ? shaded : undefined}
          />
        )}

        {method === BY_LOCATION_METHOD ? (
          <ShadesView
            cellWidth={cell_width}
            cellHeight={cell_height}
            rowCount={row_count}
            correctAnswers={correctAnswers}
            showAnswers={preview}
            colCount={column_count}
            onCellClick={handleCellClick}
            shaded={shadedByProps}
            lockedCells={read_only_author_cells ? shaded : undefined}
          />
        ) : (
          view !== PREVIEW && (
            <Input
              size="large"
              type="number"
              style={{ marginTop: 40, width: 320 }}
              value={Array.isArray(userAnswer[0]) ? 0 : userAnswer[0]}
              onChange={e => saveAnswer([+e.target.value])}
            />
          )
        )}
      </FlexContainer>
    </Paper>
  );
};

ShadingPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  method: PropTypes.string,
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired
};

ShadingPreview.defaultProps = {
  smallSize: false,
  userAnswer: null,
  previewTab: CLEAR,
  method: ''
};

export default withNamespaces('assessment')(ShadingPreview);
