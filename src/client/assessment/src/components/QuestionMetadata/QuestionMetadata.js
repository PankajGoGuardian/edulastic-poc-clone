import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper } from '@edulastic/common';
import { Icon, Select, Button } from 'antd';
import { blue } from '@edulastic/colors';
import { compose } from 'redux';
import { withNamespaces } from 'react-i18next';
import connect from 'react-redux/es/connect/connect';
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from '../../../../author/src/actions/dictionaries';
import {
  setQuestionAlignmentRowAction,
  setQuestionAlignmentRowStandardsAction,
  setQuestionAlignmentAddRowAction
} from '../../../../author/src/actions/question';
import { getCurriculumsListSelector, getStandardsListSelector } from '../../../../author/src/selectors/dictionaries';
import { getQuestionAlignmentSelector } from '../../../../author/src/selectors/question';
import selectsData from '../../../../author/src/components/TestPage/common/selectsData';

const handleFilter = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

class QuestionMetadata extends Component {
  static propTypes = {
    getCurriculums: PropTypes.func.isRequired,
    curriculums: PropTypes.arrayOf(PropTypes.shape({
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })).isRequired,
    standards: PropTypes.array.isRequired,
    alignment: PropTypes.arrayOf(PropTypes.shape({
      curriculumId: PropTypes.string,
      curriculum: PropTypes.string,
      subject: PropTypes.string,
      grades: PropTypes.array,
      alignmentStandards: PropTypes.array
    })),
    getStandards: PropTypes.func.isRequired,
    setQuestionAlignmentRow: PropTypes.func.isRequired,
    setQuestionAlignmentRowStandards: PropTypes.func.isRequired,
    setQuestionAlignmentAddRow: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    alignment: []
  };

  state = {
    grades: {}
  };

  handleCurriculumSelect = index => (curriculumId, option) => {
    const { curriculum, subject, grades } = option.props.obj;
    const { setQuestionAlignmentRow } = this.props;
    setQuestionAlignmentRow(
      index,
      { curriculum, curriculumId, subject, grades }
    );
  };

  handleGradeChange = index => (selectedGrades) => {
    const { grades } = this.state;
    this.setState({ grades: { ...grades, [index]: selectedGrades } });
  };

  handleStandardSearch = (index, curriculumId) => (searchStr) => {
    const { getStandards } = this.props;
    const { grades } = this.state;
    const searchGrades = grades[index] || [];
    if (searchStr.length > 0) {
      getStandards(curriculumId, searchGrades, searchStr);
    }
  };

  handleStandardSelect = (index, alignmentStandards) => (standards, option) => {
    const { setQuestionAlignmentRowStandards } = this.props;
    const newStandard = option.props.obj;
    const newAlignmentStandards = [...alignmentStandards, newStandard];
    setQuestionAlignmentRowStandards(index, newAlignmentStandards);
  };

  handleStandardDeselect = (index, alignmentStandards) => (removedElement) => {
    const { setQuestionAlignmentRowStandards } = this.props;
    const newAlignmentStandards = alignmentStandards.filter(el => el.identifier !== removedElement);
    setQuestionAlignmentRowStandards(index, newAlignmentStandards);
  };

  handleAdd = () => {
    const { setQuestionAlignmentAddRow } = this.props;
    setQuestionAlignmentAddRow();
  };

  componentDidMount() {
    const { curriculums, getCurriculums } = this.props;
    if (curriculums.length === 0) {
      getCurriculums();
    }
  }

  renderRow(row, index) {
    const {
      curriculums,
      standards
    } = this.props;
    const {
      curriculumId,
      subject,
      grades,
      alignmentStandards
    } = row;
    const selectedStandards = alignmentStandards.map(el => el.identifier);
    return (
      <RowContainer key={index}>
        <ItemBody>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select Curriculum"
            optionFilterProp="children"
            onSelect={this.handleCurriculumSelect(index)}
            filterOption={handleFilter}
            value={curriculumId}
            suffixIcon={
              <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
            }
          >
            { curriculums.map(el => (
              <Select.Option key={el._id} value={el._id} obj={el}>{el.curriculum}</Select.Option>
            )) }
          </Select>
        </ItemBody>
        <ItemBody>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select Subject"
            optionFilterProp="children"
            filterOption={handleFilter}
            value={subject}
            suffixIcon={
              <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
            }
          >
            { subject
            && (
              <Select.Option key={subject} value={subject}>
                {subject}
              </Select.Option>
            )}
          </Select>
        </ItemBody>
        <ItemBody>
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Select Grade"
            onChange={this.handleGradeChange(index)}
          >
            { grades && grades.map(el => (
              <Select.Option key={el} value={el}>{selectsData.allGradesObj[el].text}</Select.Option>
            )) }
          </Select>
        </ItemBody>
        <ItemBody>
          <Select
            onSearch={this.handleStandardSearch(index, curriculumId)}
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Select Standards"
            onSelect={this.handleStandardSelect(index, alignmentStandards)}
            onDeselect={this.handleStandardDeselect(index, alignmentStandards)}
            filterOption={false}
            value={selectedStandards}
          >
            { standards.map(el => (
              <Select.Option key={el.identifier} value={el.identifier} obj={el}>
                {`${el.identifier}: ${el.description}`}
              </Select.Option>
            )) }
          </Select>
        </ItemBody>
      </RowContainer>
    );
  }

  render() {
    const { alignment, t } = this.props;
    return (
      <Container>
        <AlignmentContainer>
          { alignment.map((el, index) => this.renderRow(el, index))}
        </AlignmentContainer>
        <AddButtonContainer>
          <Button icon="plus" type="primary" onClick={this.handleAdd}>
            <span>{t('component.options.newcurriculum')}</span>
          </Button>
        </AddButtonContainer>
      </Container>
    );
  }
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    state => ({
      curriculums: getCurriculumsListSelector(state),
      standards: getStandardsListSelector(state),
      alignment: getQuestionAlignmentSelector(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getStandards: getDictStandardsForCurriculumAction,
      setQuestionAlignmentRow: setQuestionAlignmentRowAction,
      setQuestionAlignmentRowStandards: setQuestionAlignmentRowStandardsAction,
      setQuestionAlignmentAddRow: setQuestionAlignmentAddRowAction
    }
  )
);

export default enhance(QuestionMetadata);

const Container = styled(Paper)`
  width: 100%
`;

const AlignmentContainer = styled.div`
  margin-top: 11px;
  margin-botton: 11px;
`;

const RowContainer = styled.div`
  display: flex;
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

const AddButtonContainer = styled.div`
  margin-top: 11px;
  height: 40px;
`;
