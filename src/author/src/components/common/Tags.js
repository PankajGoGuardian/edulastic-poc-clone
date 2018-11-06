import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darkBlue, lightBlue } from '@edulastic/colors';

const Tags = ({ tags, labelStyle }) => (
  <Labels>
    {tags.map((tag, i) => (
      <Label style={labelStyle} key={i}>
        {tag}
      </Label>
    ))}
  </Labels>
);

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  labelStyle: PropTypes.object,
};

Tags.defaultProps = {
  labelStyle: {},
};

export default Tags;

const Labels = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.span`
  text-transform: uppercase;
  border-radius: 5px;
  padding: 5px;
  color: ${darkBlue};
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  background: ${lightBlue};
  font-weight: 700;

  :last-child {
    margin-right: 0;
  }
`;
