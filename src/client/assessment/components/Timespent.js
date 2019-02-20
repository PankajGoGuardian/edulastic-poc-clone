import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import clockIcon from '../assets/clock-circular-outline.svg';

const Timespent = ({ timespent, view  }) => {
  const showTimespent = view === "preview" && timespent

  return (
      <Fragment>
          {showTimespent &&
            <StyledDivSec>
              <img alt="icon" src={clockIcon} />
              <TextPara>{timespent}</TextPara>
            </StyledDivSec>
          }
      </Fragment>
  );
};

Timespent.propTypes = {
  timespent: PropTypes.any,
  view: PropTypes.string.isRequired,
};

export default Timespent;

const StyledDivSec = styled.div`
  height:45px;
  display: flex;
  alignItems: 'center';
  border-bottom:1.4px solid #f7f7f7;
`;

const TextPara = styled.p`
  margin-left:10px;
  font-size:14px;
  display:flex;
  align-items:center;
`;
