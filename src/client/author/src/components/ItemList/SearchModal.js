import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import styled from 'styled-components';
import { Select, Icon } from 'antd';
import { blue } from '@edulastic/colors';

class SearchModal extends Component {
  render() {
    const { subjectItems, isVisible, onClose } = this.props;
    return (
      <StyledModal
        open={isVisible}
        onClose={onClose}
        center
      >
        <Container>
          <Title>Filters</Title>
          <MainFilterItems>
            <Item>
              <ItemHeader>Subject</ItemHeader>
              <ItemBody>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  defaultValue={['GRADE 5']}
                >
                  {subjectItems}
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Subject</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All subject"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Standard Set</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All standard set"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Select Standard</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All standards"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Collection</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All collections"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Question Types</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All types"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Depth of Knowledge</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All depth of knowledge"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
            <Item>
              <ItemHeader>Difficulty</ItemHeader>
              <ItemBody>
                <Select
                  defaultValue="All levels"
                  style={{ width: '100%' }}
                  suffixIcon={
                    <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
                  }
                >
                  <Select.Option value="math">Math</Select.Option>
                </Select>
              </ItemBody>
            </Item>
          </MainFilterItems>
        </Container>
      </StyledModal>
    );
  }
}

SearchModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subjectItems: PropTypes.any.isRequired
};

export default SearchModal;

const StyledModal = styled(Modal)`
  width: 100%;
  height: 100%;

  svg {
    fill: red;
  }
`;

const Container = styled.div`
  width: calc(100vw - 80px);
`;

const Title = styled.div`
  font-size: 22px;
  color: #4aac8b;
  font-weight: 600;
`;

const MainFilterItems = styled.div`
  margin-top: 4px;
`;

const Item = styled.div`
  margin-top: 13px;
`;

const ItemHeader = styled.span`
  font-size: 13px;
  color: #757d8e;
  font-weight: 600;
  letter-spacing: 0.2px;
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
