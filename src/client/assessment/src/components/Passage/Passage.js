import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';

import { Subtitle } from '../common';
import Options from './Options';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import PassageView from './PassageView';

const EmptyWrapper = styled.div``;

const Passage = ({ item, view, smallSize, setQuestionData }) => {
  const Wrapper = smallSize ? EmptyWrapper : Paper;

  if (view === 'edit') {
    return (
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>Details</Subtitle>
        <Options setQuestionData={setQuestionData} item={item} />
        <Paper>
          <PassageView item={item} />
        </Paper>
      </Paper>
    );
  }

  if (view === 'preview') {
    return (
      <Wrapper>
        <PassageView item={item} />
      </Wrapper>
    );
  }
};

Passage.propTypes = {
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool
};

Passage.defaultProps = {
  smallSize: false
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

export default enhance(Passage);
