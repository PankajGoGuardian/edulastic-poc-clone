import React from 'react';
import { Row, Col } from 'antd';
import HeaderBar from './HeaderBar';
import Calculator from './Calculator';

const Review = () => {
  const handleSelectAll = () => {
    console.log('select all');
  };

  const handleRemoveSelected = () => {
    console.log('remove selected');
  };

  const handleCollapse = () => {
    console.log('collapse');
  };

  return (
    <Row>
      <Col span={19}>
        <HeaderBar
          onSelectAll={handleSelectAll}
          onRemoveSelected={handleRemoveSelected}
          onCollapse={handleCollapse}
        />
      </Col>
      <Col span={5}>
        <Calculator />
      </Col>
    </Row>
  );
};

export default Review;
