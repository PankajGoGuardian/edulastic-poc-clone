import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper } from '@edulastic/common';
import { Icon, Select } from 'antd';
import { blue } from '@edulastic/colors';

const handleFilter = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

export default class QuestionMetadata extends Component {
  static propTypes = {
    curriculums: PropTypes.arrayOf(PropTypes.shape({
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })).isRequired,
    standards: PropTypes.array.isRequired,
    getStandards: PropTypes.func.isRequired,
    allGradesObj: PropTypes.shape({}).isRequired
  };

  static defaultProps = {
  };

  state = {
    curriculum: {},
    curriculumId: '',
    subject: '',
    grades: []
  };

  handleCurriculumChange = (curriculumId) => {
    const { curriculums } = this.props;
    const curriculum = curriculums.filter(el => el._id === curriculumId)[0];
    if (curriculum) {
      this.setState({ curriculum, curriculumId });
    }
  };

  handleSubjectChange = (subject) => {
    this.setState({ subject });
  };

  handleGradeChange = (grades) => {
    this.setState({ grades });
  };

  handleStandardSearch = (searchStr) => {
    const { getStandards } = this.props;
    const { curriculumId, grades, subject } = this.state;
    if (searchStr.length > 0) {
      getStandards(curriculumId, grades, searchStr, subject);
    }
  };

  // TODO: save standards
  // handleStandardChange = (standards) => {
  //   console.log('standards', standards);
  // };

  render() {
    const { curriculums, standards, allGradesObj } = this.props;
    const { curriculum } = this.state;
    return (
      <Container>
        <ItemBody>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select Curriculum"
            optionFilterProp="children"
            onChange={this.handleCurriculumChange}
            filterOption={handleFilter}
            suffixIcon={
              <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
            }
          >
            { curriculums.map(el => (
              <Select.Option key={el._id} value={el._id}>{el.curriculum}</Select.Option>
            )) }
          </Select>
        </ItemBody>
        <ItemBody>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select Subject"
            optionFilterProp="children"
            onChange={this.handleSubjectChange}
            filterOption={handleFilter}
            suffixIcon={
              <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
            }
          >
            { curriculum.subject
            && (
              <Select.Option key={curriculum.subject} value={curriculum.subject}>
                {curriculum.subject}
              </Select.Option>
            )}
          </Select>
        </ItemBody>
        <ItemBody>
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Select Grade"
            onChange={this.handleGradeChange}
          >
            { curriculum.grades && curriculum.grades.map(el => (
              <Select.Option key={el} value={el}>{allGradesObj[el].text}</Select.Option>
            )) }
          </Select>
        </ItemBody>
        <ItemBody>
          <Select
            onSearch={this.handleStandardSearch}
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Select Standards"
            onChange={() => {}}
            filterOption={false}
          >
            { standards.map(el => (
              <Select.Option key={el.identifier} value={el.identifier}>
                {`${el.identifier}: ${el.description}`}
              </Select.Option>
            )) }
          </Select>
        </ItemBody>
      </Container>
    );
  }
}

const Container = styled(Paper)`
  display: flex;
  width: 100%
`;

const ItemBody = styled.div`
  margin-top: 11px;
  height: 40px;

  .ant-select-selection {
    height: 40px;
    background: transparent;
    padding-top: 4px;
  }

  .ant-select-selection__choice {
    border-radius: 5px;
    border: solid 1px #444444;
  }

  .ant-select-selection__choice__content {
    font-size: 9px;
    font-weight: bold;
    color: #434b5d;
  }

  .ant-select-selection-selected-value {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-select-selection__rendered {
    margin-left: 22px;
  }

  .ant-select-arrow-icon {
    color: ${blue};
  }
`;
