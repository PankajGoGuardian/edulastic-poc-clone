import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import Dropzone from 'react-dropzone';

import { withNamespaces } from '@edulastic/localization';
import { Paper, Image } from '@edulastic/common';

import { QuestionTextArea, Subtitle, DropZoneToolbar, StyledDropZone } from '../../common';
import { SOURCE } from '../../../constants/constantsForQuestions';
import withAddButton from '../../HOC/withAddButton';
import ColorPickers from './colorPickers';

const LineColors = withAddButton(ColorPickers);

const HighlightImageEdit = ({ item, setQuestionData, t }) => {
  const { image, line_color } = item;

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

  const hexToRGB = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);

    const g = parseInt(hex.slice(3, 5), 16);

    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const colorChange = i => (obj) => {
    const newItem = cloneDeep(item);
    newItem.line_color[i] = hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100);
    setQuestionData(newItem);
  };

  const handleAddLineColor = () => {
    const newItem = cloneDeep(item);

    newItem.line_color.push('#000000');
    setQuestionData(newItem);
  };

  const handleRemove = i => () => {
    const newItem = cloneDeep(item);

    newItem.line_color.splice(i, 1);

    setQuestionData(newItem);
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

        <LineColors
          onRemove={line_color.length > 1 ? handleRemove : undefined}
          changeHandler={colorChange}
          colors={line_color}
          buttonText={t('component.highlightImage.addButtonText')}
          onAdd={handleAddLineColor}
        />
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
