import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Col, DatePicker, Select, Radio, Icon } from 'antd';
import { FlexContainer } from '@edulastic/common';
import {
  findIndex as _findIndex,
  groupBy as _groupBy,
  cloneDeep as _cloneDeep,
  uniq as _uniq,
  uniqBy,
  flatMap as _flatmap
} from 'lodash';

import {
  Button,
  SettingsBtn,
  StyledRow,
  StyledRowLabel,
  StudentWrapper
} from './styled';
import { selectsData } from '../../../common';
import { fetchStudentsOfGroupAction } from '../../ducks';

import Settings from './Settings';

const RadioGroup = Radio.Group;
const { Option } = Select;

const getGroupFromId = (id, groups) => {
  const group = groups.filter(g => g.students.map(s => s._id).includes(id))[0];
  return group._id;
};

const EditModal = ({
  title,
  visible,
  onOk,
  onCancel,
  setModalData,
  modalData,
  group,
  fetchStudents
}) => {
  const [endOpen, setEndOpen] = useState(false);
  let [isVisible, openSettings] = useState(false);

  const toggleSettings = () => {
    isVisible = !isVisible;
    openSettings(isVisible);
  };
  const onChange = (field, value) => {
    setModalData({
      ...modalData,
      [field]: value
    });
  };

  // FIXME: fix delete
  const updateStudents = students => {
    const modalDataCloned = _cloneDeep(modalData);
    const studentsGroup = _groupBy(students, 'class_id');
    for (const _class of modalDataCloned.class) {
      // _class.students = [];
    }

    for (const classId in studentsGroup) {
      const index = _findIndex(
        modalDataCloned.class,
        ({ _id }) => _id === classId
      );
      if (index >= 0) {
        if (!modalDataCloned.class[index].students) {
          modalDataCloned.class[index].students = studentsGroup[classId].map(
            x => x._id
          );
        } else {
          modalDataCloned.class[index].students = modalDataCloned.class[
            index
          ].students.concat(studentsGroup[classId].map(x => x._id));
        }

        modalDataCloned.class[index].students = _uniq(
          modalDataCloned.class[index].students
        );
      }
    }

    setModalData(modalDataCloned);
  };

  const disabledStartDate = startDate => {
    const { endDate } = modalData;
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };

  const disabledEndDate = endDate => {
    const { startDate } = modalData;
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() <= startDate.valueOf();
  };

  const onStartChange = value => {
    onChange('startDate', value);
  };

  const onEndChange = value => {
    onChange('endDate', value);
  };

  const handleStartOpenChange = open => {
    if (!open) {
      setEndOpen(true);
    }
  };

  const handleEndOpenChange = open => {
    setEndOpen(open);
  };

  const selectedGroups = modalData.class.map(x => x._id);
  const selectedStudents = _flatmap(modalData.class, _class =>
    _class.students ? _uniq(_class.students) : []
  );

  let allStudents = [];

  group.forEach(({ _id, students }) => {
    if (selectedGroups.includes(_id)) {
      students = students || [];
      students = students.map(s => {
        s.class_id = _id;
        return s;
      });
      allStudents = uniqBy([...allStudents, ...students], '_id');
    }
  });

  const studentNames = [];

  allStudents.forEach(({ _id, firstName, lastName = '' }) => {
    if (selectedStudents.includes(_id)) {
      studentNames.push(`${firstName} ${lastName}`);
    }
  });

  const footer = (
    <FlexContainer justifyContent="space-around" style={{ padding: '20px 0' }}>
      <Button key="back" size="large" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        key="submit"
        size="large"
        type="primary"
        onClick={onOk}
        data-cy="apply"
      >
        Apply
      </Button>
    </FlexContainer>
  );

  return (
    <Modal
      data-cy="title"
      title={title}
      visible={visible}
      footer={footer}
      onCancel={onCancel}
      width="50%"
      onCancel={onCancel}
    >
      <StyledRowLabel gutter={16}>
        <Col span={12}>Class/Group Section</Col>
      </StyledRowLabel>
      <StyledRow>
        <Col span={24}>
          <Select
            data-cy="selectClass"
            placeholder="Please select"
            style={{ width: '100%' }}
            mode="multiple"
            cache="false"
            onChange={event => {
              onChange(
                'class',
                event.map(_id => ({
                  _id,
                  status: 3,
                  totalNumber: 0,
                  submittedNumber: 0
                }))
              );
            }}
            onSelect={classId => {
              fetchStudents({ classId });
            }}
            value={modalData.class.map(obj => obj._id)}
          >
            {group.map(data => (
              <Option data-cy="class" key={data._id}>
                {data.name}
              </Option>
            ))}
          </Select>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <RadioGroup value={modalData.specificStudents ? 2 : 1}>
          <Radio value={1} onClick={() => onChange('specificStudents', false)}>
            Entire Class
          </Radio>
          <Radio
            value={2}
            data-cy="specificStudent"
            onClick={() => onChange('specificStudents', true)}
          >
            Specific Student
          </Radio>
        </RadioGroup>
      </StyledRow>
      <StudentWrapper show={modalData.specificStudents}>
        <StyledRowLabel gutter={16}>
          <Col span={12}>Student</Col>
        </StyledRowLabel>
        <StyledRow>
          <Col span={24}>
            <Select
              placeholder="Please select"
              style={{ width: '100%' }}
              mode="multiple"
              onChange={event => {
                updateStudents(event);
                // onChange('students', event);
              }}
              value={studentNames}
            >
              {allStudents.map(({ _id, firstName, lastName, class_id }) => (
                <Option key={_id} value={{ _id, class_id }}>
                  {`${firstName || 'Anonymous'} ${lastName || ''}`}
                </Option>
              ))}
            </Select>
          </Col>
        </StyledRow>
      </StudentWrapper>
      <StyledRowLabel gutter={16} style={{ marginBottom: '10' }}>
        <Col span={12}>Open Date</Col>
        <Col span={12}>Close Date</Col>
      </StyledRowLabel>
      <StyledRow gutter={16}>
        <Col span={12}>
          <DatePicker
            data-cy="startDate"
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
            data-cy="closeDate"
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
      <StyledRowLabel gutter={16}>
        <Col span={12}>Open Policy</Col>
        <Col span={12}>Close Policy</Col>
      </StyledRowLabel>
      <StyledRow gutter={16}>
        <Col span={12}>
          <Select
            data-cy="openPolicy"
            defaultValue="Automatically on Start Date"
            size="large"
            style={{ width: '100%' }}
            value={modalData.openPolicy}
            onChange={value => onChange('openPolicy', value)}
          >
            {selectsData.openPolicy.map(({ value, text }) => (
              <Select.Option key={value} value={value} data-cy="open">
                {text}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            data-cy="closePolicy"
            defaultValue="Automatically on Due Date"
            size="large"
            style={{ width: '100%' }}
            value={modalData.closePolicy}
            onChange={value => onChange('closePolicy', value)}
          >
            {selectsData.closePolicy.map(({ value, text }) => (
              <Select.Option key={value} value={value} data-cy="close">
                {text}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </StyledRow>
      <StyledRowLabel gutter={16}>
        <Col>
          <SettingsBtn onClick={toggleSettings}>
            OVERRIDE TEST SETTINGS{' '}
            {isVisible ? <Icon type="up" /> : <Icon type="down" />}
          </SettingsBtn>
        </Col>
      </StyledRowLabel>
      {isVisible && (
        <Settings
          modalData={modalData}
          onChange={onChange}
          selectsData={selectsData}
        />
      )}
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
  group: PropTypes.array.isRequired,
  fetchStudents: PropTypes.func.isRequired
};

export default connect(
  () => ({}),
  { fetchStudents: fetchStudentsOfGroupAction }
)(EditModal);
