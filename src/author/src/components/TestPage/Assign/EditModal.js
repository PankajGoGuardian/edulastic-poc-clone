import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Input, Col, DatePicker, Select } from 'antd';
import { EduButton, FlexContainer } from '@edulastic/common';

import styled from 'styled-components';
import { selectsData } from '../common';

const EditModal = ({ title, visible, onOk, onCancel, setModalData, modalData }) => {
  const [endOpen, setEndOpen] = useState(false);

  const onChange = (field, value) => {
    setModalData({
      ...modalData,
      [field]: value,
    });
  };

  const disabledStartDate = (startDate) => {
    const { endDate } = modalData;
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };

  const disabledEndDate = (endDate) => {
    const { startDate } = modalData;
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() <= startDate.valueOf();
  };

  const onStartChange = (value) => {
    onChange('startDate', value);
  };

  const onEndChange = (value) => {
    onChange('endDate', value);
  };

  const handleStartOpenChange = (open) => {
    if (!open) {
      setEndOpen(true);
    }
  };

  const handleEndOpenChange = (open) => {
    setEndOpen(open);
  };

  const footer = (
    <FlexContainer justifyContent="space-around" style={{ padding: '20px 0' }}>
      <Button key="back" size="large" onClick={onCancel}>
        Cancel
      </Button>
      <Button key="submit" size="large" type="primary" onClick={onOk}>
        Apply
      </Button>
    </FlexContainer>
  );

  return (
    <Modal title={title} visible={visible} footer={footer} width="50%">
      <StyledRow>
        <Col span={24}>
          <Input
            value={modalData.class.id}
            size="large"
            onChange={e => onChange('class', { ...modalData, id: e.target.value })}
          />
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col span={12}>
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            disabledDate={disabledStartDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={modalData.startDate}
            placeholder="Open Date"
            onChange={onStartChange}
            onOpenChange={handleStartOpenChange}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            disabledDate={disabledEndDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={modalData.endDate}
            placeholder="Close Date"
            onChange={onEndChange}
            open={endOpen}
            onOpenChange={handleEndOpenChange}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={16}>
        <Col span={12}>
          <Select
            defaultValue="Automatically on Start Date"
            size="large"
            style={{ width: '100%' }}
            value={modalData.openPolicy}
            onChange={value => onChange('openPolicy', value)}
          >
            {selectsData.openPolicy.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            defaultValue="Automatically on Due Date"
            size="large"
            style={{ width: '100%' }}
            value={modalData.closePolicy}
            onChange={value => onChange('closePolicy', value)}
          >
            {selectsData.closePolicy.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </StyledRow>
    </Modal>
  );
};

EditModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  modalData: PropTypes.object.isRequired,
};

export default EditModal;

const Button = styled(EduButton)`
  width: 30%;
`;

const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;
