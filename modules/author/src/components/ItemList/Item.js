import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaClock, FaAngleDoubleRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import { textColor, blue, darkBlue, grey } from '../../utils/css';
import { Button } from '../../../../assessment/src/components/common';

/* eslint-disable no-underscore-dangle */
const Item = ({ item, match }) => (
  <Container>
    <Question>
      <Link to={`${match.url}/${item._id}`}>
        {item.id}# <FaAngleDoubleRight />
      </Link>
      <div dangerouslySetInnerHTML={{ __html: item.stimulus }} />
    </Question>
    <Author>
      <div>
        Author: <span>Kevin Hart</span>
      </div>
      <Time>
        <Icon /> an hour ago
      </Time>
    </Author>
    <Labels>
      <Label>Order List</Label>
      <Label>Order List</Label>
      <Label>Order List</Label>
    </Labels>
    <View>
      <Button
        style={{
          width: 166,
          height: 50,
          fontSize: 11,
          fontWeight: 600,
        }}
        variant="extendedFab"
        color="primary"
        outlined
        onClick={() => {}}
      >
        View
      </Button>
    </View>
  </Container>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Item;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${grey};
  padding: 30px 0;
`;

const Link = styled(NavLink)`
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  color: ${blue};

  :hover {
    color: ${darkBlue};
  }
`;

const Icon = styled(FaClock)`
  color: #ee1658;
  margin-right: 15px;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Label = styled.span`
  text-transform: uppercase;
  border-radius: 10px;
  color: ${textColor};
  border: 1px solid #b1b1b1;
  font-size: 8px;
  width: 105px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  margin-bottom: 7px;

  :last-child {
    margin-right: 0;
  }
`;

const Question = styled.div`
  width: 50%;
`;

const Author = styled.div`
  width: 15%;
  font-size: 13px;
`;

const Labels = styled.div`
  width: 20%;
  display: flex;
  flex-wrap: wrap;
`;

const View = styled.div`
  width: 15%;
  display: flex;
  justify-content: flex-end;
`;
