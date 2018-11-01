import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darkBlue, lightBlue } from '@edulastic/colors';

const Tags = ({ tags }) => (
  <Labels>
    {tags.map((tag, i) => (
      <Label key={i}>{tag}</Label>
    ))}
  </Labels>
);

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
};

export default Tags;

const Labels = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.span`
  text-transform: uppercase;
  border-radius: 10px;
  padding: 10px;
  color: ${darkBlue};
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  margin-bottom: 7px;
  background: ${lightBlue};
  font-weight: 700;

  :last-child {
    margin-right: 0;
  }
`;
