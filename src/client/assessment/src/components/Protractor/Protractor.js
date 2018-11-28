import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';

import { Subtitle } from '../common';
import Options from './Options';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import ProtractorView from './ProtractorView';

const EmptyWrapper = styled.div``;

const Protractor = ({ item, view, smallSize, setQuestionData }) => {
  const Wrapper = smallSize ? EmptyWrapper : Paper;

  const handleItemChangeChange = (prop, value) => {
    const newItem = cloneDeep(item);

    newItem[prop] = value;
    setQuestionData(newItem);
  };

  if (view === 'edit') {
    return (
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>Details</Subtitle>
        <Options
          onChange={handleItemChangeChange}
          item={item}
        />
        <ProtractorView smallSize={smallSize} item={item} />
      </Paper>
    );
  }

  if (view === 'preview') {
    return (
      <Wrapper>
        <ProtractorView smallSize={smallSize} item={item} />
      </Wrapper>
    );
  }
};

Protractor.propTypes = {
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool.isRequired,
};

const enhance = compose(
  memo,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Protractor);
