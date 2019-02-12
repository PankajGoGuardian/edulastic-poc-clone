import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from 'lodash';
import ReactQuill from 'react-quill';
import { Checkbox } from 'antd';
import { arrayMove } from 'react-sortable-hoc';

import { withNamespaces } from '@edulastic/localization';
import { Paper } from '@edulastic/common';

import WordLimitAndCount from '../../components/WordLimitAndCount';
import QuestionTextArea from '../../components/QuestionTextArea';
import { Subtitle } from '../../styled/Subtitle';

import SortableList from './components/SortableList';
import { ValidList } from './constants/validList';
import { QlToolbar } from './styled/QlToolbar';

const EditEssayRichText = ({ item, setQuestionData, t }) => {
  const [act, setAct] = useState(item.formatting_options || []);

  useEffect(() => {
    if (!isEqual(act, item.formatting_options)) {
      setAct(item.formatting_options);
    }
  });

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleActiveChange = (index) => {
    const newItem = cloneDeep(item);

    newItem.formatting_options[index].active = !newItem.formatting_options[index].active;

    setAct(newItem.formatting_options);

    setQuestionData(newItem);
  };

  const handleChange = ({ oldIndex, newIndex }) => {
    const newItem = cloneDeep(item);

    newItem.formatting_options = arrayMove(newItem.formatting_options, oldIndex, newIndex);

    setQuestionData(newItem);
  };

  return (
    <Fragment>
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>{t('component.essayText.composequestion')}</Subtitle>
        <QuestionTextArea
          placeholder={t('component.essayText.enterQuestion')}
          onChange={stimulus => handleItemChangeChange('stimulus', stimulus)}
          value={item.stimulus}
        />

        <Subtitle>{t('component.essayText.rich.formattingOptions')}</Subtitle>
        <QlToolbar id="toolbar">
          <SortableList
            axis="xy"
            onSortEnd={handleChange}
            items={act}
            useDragHandle
            validList={ValidList}
            handleActiveChange={handleActiveChange}
          />
        </QlToolbar>
        <ReactQuill modules={EditEssayRichText.modules} readOnly />

        <WordLimitAndCount
          withOutTopMargin
          onChange={handleItemChangeChange}
          selectValue={item.show_word_limit}
          inputValue={item.max_word}
        />

        <Checkbox
          style={{ marginTop: 32 }}
          defaultChecked={item.show_word_count}
          onChange={e => handleItemChangeChange('show_word_count', e.target.checked)}
        >
          {t('component.essayText.showWordCheckbox')}
        </Checkbox>
      </Paper>
    </Fragment>
  );
};

EditEssayRichText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

EditEssayRichText.modules = {
  toolbar: {
    container: '#toolbar'
  }
};

export default withNamespaces('assessment')(EditEssayRichText);
