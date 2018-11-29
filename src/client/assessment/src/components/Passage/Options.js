import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';

import { Input, Row, Col, Checkbox, Select } from 'antd';
import { CustomQuillComponent } from '@edulastic/common';
import Options from '../common/Options';
import { SortableList } from '../common';
import withAddButton from '../HOC/withAddButton';

const List = withAddButton(SortableList);

const rendererOptions = [
  { value: '', label: 'MathJax (response inputs renderer with MathQuill)' },
  { value: 'mathquill', label: 'MathQuill' }
];

const Opt = ({ setQuestionData, item }) => {
  const handleChange = (prop, value) => {
    const newItem = cloneDeep(item);

    if (prop === 'paginated_content' && value) {
      newItem.pages = [newItem.content];
      delete newItem.content;
    }

    if (prop === 'paginated_content' && !value) {
      if (newItem.pages && newItem.pages.length) {
        newItem.content = newItem.pages.join('');
      }

      delete newItem.pages;
    }

    newItem[prop] = value;
    setQuestionData(newItem);
  };

  const handleSortPagesEnd = ({ oldIndex, newIndex }) => {
    const newItem = cloneDeep(item);
    newItem.pages = arrayMove(newItem.pages, oldIndex, newIndex);
    setQuestionData(newItem);
  };

  const handleRemovePage = (index) => {
    const newItem = cloneDeep(item);
    newItem.pages.splice(index, 1);
    setQuestionData(newItem);
  };

  const handleChangePage = (index, value) => {
    const newItem = cloneDeep(item);
    newItem.pages[index] = value;
    setQuestionData(newItem);
  };

  const handleAddPage = () => {
    const newItem = cloneDeep(item);
    newItem.pages.push('');
    setQuestionData(newItem);
  };

  return (
    <div>
      <StyledRow gutter={32}>
        <Col span={24}>
          <Options.Label>Heading</Options.Label>
          <StyledInput
            size="large"
            value={item.heading}
            onChange={e => handleChange('heading', e.target.value)}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        {!item.paginated_content && (
          <Col span={24}>
            <Options.Label>Contents</Options.Label>
            <CustomQuillComponent
              toolbarId="contents"
              placeholder="Enter passage content here"
              onChange={value => handleChange('content', value)}
              showResponseBtn={false}
              value={item.content}
            />
          </Col>
        )}
        {item.paginated_content && item.pages && !!item.pages.length && (
          <Col span={24}>
            <Options.Label>Content pages</Options.Label>
            <List
              items={item.pages}
              buttonText="Add"
              onAdd={handleAddPage}
              onSortEnd={handleSortPagesEnd}
              useDragHandle
              onRemove={handleRemovePage}
              onChange={handleChangePage}
            />
          </Col>
        )}
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Options.Label>Flesch-Kincaid</Options.Label>
          <StyledInput
            size="large"
            value={item.flesch_kincaid || ''}
            onChange={e => handleChange('flesch_kincaid', e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Options.Label>Lexile</Options.Label>
          <StyledInput
            size="large"
            value={item.lexile || ''}
            onChange={e => handleChange('lexile', e.target.value)}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Options.Label>Instructor Stimulus</Options.Label>
          <CustomQuillComponent
            toolbarId="instructorStimulus"
            onChange={value => handleChange('instructor_stimulus', value)}
            showResponseBtn={false}
            value={item.instructor_stimulus || ''}
            style={{
              border: '1px solid #d9d9d9',
              height: 'auto',
              padding: '6px 11px',
              borderRadius: 5
            }}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Checkbox
            checked={item.is_math}
            onChange={e => handleChange('is_math', e.target.checked)}
          >
            <b>Contains Mathematics</b>
          </Checkbox>
        </Col>
        <Col span={12}>
          <Checkbox
            checked={item.paginated_content}
            onChange={e => handleChange('paginated_content', e.target.checked)}
          >
            <b>Enable paginated content</b>
          </Checkbox>
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        {item.is_math && (
          <Col span={12}>
            <Options.Label>Math renderer</Options.Label>
            <Select
              size="large"
              value={item.math_renderer}
              style={{ width: '100%' }}
              onChange={value => handleChange('math_renderer', value)}
            >
              {rendererOptions.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        )}
      </StyledRow>
    </div>
  );
};

Opt.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default Opt;

const StyledInput = styled(Input)`
  width: 100%;
`;

const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;
