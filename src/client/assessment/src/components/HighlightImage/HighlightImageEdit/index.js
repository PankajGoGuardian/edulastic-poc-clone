import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import Dropzone from 'react-dropzone';

import { withNamespaces } from '@edulastic/localization';
import { Paper, Image } from '@edulastic/common';

import { QuestionTextArea, Subtitle, DropZoneToolbar, StyledDropZone } from '../../common';
import { SOURCE } from '../../../constants/constantsForQuestions';

const HighlightImageEdit = ({ item, setQuestionData, t }) => {
  const { image } = item;

  const width = image ? image.width : 900;
  const height = image ? image.height : 470;
  const altText = image ? image.altText : '';
  const file = image ? image.source : '';

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleImageToolbarChange = prop => (val) => {
    const newItem = cloneDeep(item);

    newItem.image[prop] = val;
    setQuestionData(newItem);
  };

  const onDrop = ([files]) => {
    handleImageToolbarChange(SOURCE)(URL.createObjectURL(files));
  };

  const thumb = file && <Image width={width} height={height} src={file} alt={altText} />;

  return (
    <Fragment>
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>{t('component.sortList.editQuestionSubtitle')}</Subtitle>
        <QuestionTextArea
          placeholder="Enter question"
          onChange={stimulus => handleItemChangeChange('stimulus', stimulus)}
          value={item.stimulus}
        />

        <DropZoneToolbar
          width={+width}
          height={+height}
          altText={altText}
          handleChange={handleImageToolbarChange}
        />

        <Dropzone
          onDrop={onDrop}
          className="dropzone"
          activeClassName="active-dropzone"
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'dropzone--isActive' : ''}`}
            >
              <input {...getInputProps()} />

              <StyledDropZone isDragActive={isDragActive} thumb={thumb} />
            </div>
          )}
        </Dropzone>

        <Subtitle>{t('component.highlightImage.lineColorOptionsSubtitle')}</Subtitle>
      </Paper>
    </Fragment>
  );
};

HighlightImageEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(HighlightImageEdit);
