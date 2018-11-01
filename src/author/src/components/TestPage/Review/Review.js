import React from 'react';
import { Row, Col } from 'antd';
import HeaderBar from './HeaderBar';

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
    <Row gutter={16}>
      <Col span={20}>
        <HeaderBar
          onSelectAll={handleSelectAll}
          onRemoveSelected={handleRemoveSelected}
          onCollapse={handleCollapse}
        />
      </Col>
      <Col span={4}>asdf</Col>
    </Row>
  );
};

export default Review;
