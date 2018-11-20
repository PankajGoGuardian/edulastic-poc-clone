import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Row, Col, Checkbox } from 'antd';

const ListCard = ({ item }) => (
  <StyledCard bodyStyle={{ height: 52, display: 'flex', alignItems: 'center', padding: '0px' }}>
    <Row style={{ width: '100%' }}>
      <Col span={6} style={{ paddingLeft: 24 }}>
        {item.bands}
      </Col>
      <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
        <Checkbox />
      </Col>
      <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
        {item.from}
      </Col>
      <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
        {item.bands}
      </Col>
    </Row>
  </StyledCard>
);

ListCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ListCard;

const StyledCard = styled(Card)`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #434b5d;
  border-radius: 5px;
`;
