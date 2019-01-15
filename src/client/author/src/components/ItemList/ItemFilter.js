import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon, Button, Affix, Row, Col } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { TextField } from '@edulastic/common';
import { desktopWidth, blue, greenDark, textColor } from '@edulastic/colors';
import SearchModal from './SearchModal';
import { SMALL_DESKTOP_WIDTH, MAX_MOBILE_WIDTH } from '../../constants/others';
import selectsData from '../TestPage/common/selectsData';

class ItemFilter extends Component {
  state = {
    isShowFilter: false
  };

  showFilterHandler = () => {
    this.setState({ isShowFilter: true });
  };

  closeSearchModal = () => {
    this.setState({ isShowFilter: false });
  };

  handleStandardSearch = (searchStr) => {
    const {
      getCurriculumStandards,
      search: {
        grades,
        curriculumId
      }
    } = this.props;
    if (curriculumId && searchStr.length >= 2) {
      getCurriculumStandards(curriculumId, grades, searchStr);
    }
  };

  renderMainFilter = () => {
    const {
      search: {
        grades,
        subject,
        curriculumId,
        standardIds,
        questionType,
        depthOfKnowledge,
        authorDifficulty
      },
      curriculums,
      onSearchFieldChange,
      curriculumStandards
    } = this.props;
    return (
      <MainFilterItems>
        <Item>
          <ItemHeader>Grades</ItemHeader>
          <ItemBody>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="All Grades"
              value={grades}
              onChange={onSearchFieldChange('grades')}
            >
              { selectsData.allGrades.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Subject</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('subject')}
              value={subject}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allSubjects.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Curriculum</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('curriculumId')}
              value={curriculumId}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              <Select.Option key="" value="">All Curriculums</Select.Option>
              { curriculums.map(el => (
                <Select.Option key={el._id} value={el._id}>{el.curriculum}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Standards</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSearch={this.handleStandardSearch}
              mode="multiple"
              placeholder="All standards"
              onChange={onSearchFieldChange('standardIds')}
              filterOption={false}
              value={standardIds}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { curriculumStandards.map(el => (
                <Select.Option key={el.identifier} value={el.identifier}>
                  {`${el.identifier}: ${el.description}`}
                </Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Question Type</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('questionType')}
              value={questionType}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allQuestionTypes.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Depth of Knowledge</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('depthOfKnowledge')}
              value={depthOfKnowledge}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allDepthOfKnowledge.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Difficulty</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('authorDifficulty')}
              value={authorDifficulty}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allAuthorDifficulty.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Author</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              defaultValue="All Authors"
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              <Select.Option value="">All Authors</Select.Option>
              <Select.Option value="author1">Author 1</Select.Option>
              <Select.Option value="author2">Author 2</Select.Option>
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Owner</ItemHeader>
          <ItemBody>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="All Owners"
              defaultValue={[]}
            >
              <Select.Option value="owner1">Owner 1</Select.Option>
              <Select.Option value="owner2">Owner 2</Select.Option>
              <Select.Option value="owner3">Owner 3</Select.Option>
            </Select>
          </ItemBody>
        </Item>
      </MainFilterItems>
    );
  };

  render() {
    const { onSearch, windowWidth } = this.props;
    const { isShowFilter } = this.state;

    // TODO: SearchModal
    return (
      <Container>
        <SearchModal
          subjectItems={[]}
          isVisible={isShowFilter}
          onClose={this.closeSearchModal}
        />
        {
          windowWidth > MAX_MOBILE_WIDTH ? (
            <Header>
              <Row style={{ width: '100%' }}>
                <Col span={18}>
                  <SearchField>
                    <TextField
                      onChange={e => onSearch(e.target.value)}
                      height="50px"
                      type="search"
                      icon={<Icon type="search" style={{ color: blue, fontSize: '18px' }} />}
                      containerStyle={{ marginRight: 20 }}
                      style={{ padding: 16, paddingRight: 68, outline: 'none' }}
                      placeholder="Search by skills and"
                    />
                  </SearchField>
                </Col>
                <Col span={6}>
                  <FilterButton>
                    <Button onClick={() => this.showFilterHandler()}>
                      {!isShowFilter ? 'SHOW FILTERS' : 'HIDE FILTERS'}
                    </Button>
                  </FilterButton>
                </Col>
              </Row>
            </Header>
          ) : (
            <Header>
              <SearchField>
                <TextField
                  onChange={e => onSearch(e.target.value)}
                  height="50px"
                  type="search"
                  icon={<Icon type="search" style={{ color: blue, fontSize: '18px' }} />}
                  containerStyle={{ marginRight: 20 }}
                  style={{ padding: 16, paddingRight: 68, outline: 'none' }}
                  placeholder="Search by skills and"
                />
              </SearchField>
              <FilterButton>
                <Button onClick={() => this.showFilterHandler()}>
                  {!isShowFilter ? 'SHOW FILTERS' : 'HIDE FILTERS'}
                </Button>
              </FilterButton>
            </Header>
          )
        }
        <MainFilter isVisible={isShowFilter}>
          {
            windowWidth > SMALL_DESKTOP_WIDTH && (
              <Affix style={{ width: 325 }}>
                <PerfectScrollbar>
                  <MainFilterHeader>
                    <Title>Filters</Title>
                    <Clear>Clear all</Clear>
                  </MainFilterHeader>
                  {this.renderMainFilter()}
                </PerfectScrollbar>
              </Affix>)
          }
        </MainFilter>
      </Container>
    );
  }
}

ItemFilter.propTypes = {
  search: PropTypes.object.isRequired,
  curriculums: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    curriculum: PropTypes.string.isRequired,
    grades: PropTypes.array.isRequired,
    subject: PropTypes.string.isRequired
  })).isRequired,
  onSearchFieldChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired
};

export default ItemFilter;


const Container = styled.div`
  min-width: 286px;
`;

const Header = styled.div`
  display: flex;
`;

const SearchField = styled.div`
  margin: 24px 11px 0px 45px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  height: 50px;
  width: 280px;

  @media (max-width: ${desktopWidth}) {
    margin: 13px 8px 13px 26px;
  }
`;

const FilterButton = styled.div`
  display: none;
  flex: 1;
  height: 50px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border-radius: 10px;

  .ant-btn {
    height: 50px;
    border-radius: 10px;
    width: 100%;
    
    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }

  @media (max-width: ${desktopWidth}) {
    margin-top: 13px;
    margin-right: 26px;
    display: block;
  }
`;

const MainFilter = styled.div`
  margin-top: 17px;
  padding: 0px 11px 0px 39px;
  zIndex: 0;
  position: fixed;

  .scrollbar-container {
    overflow: auto !important;
    height: calc(100vh - 195px);

    ::-webkit-scrollbar { 
      display: none; 
    }
  }


  @media (max-width: ${desktopWidth}) {
    position: relative;
    display: ${props => (props.isVisible ? 'block' : 'none')};
    padding: 0px 25px 0px 19px;
  }
`;

const MainFilterHeader = styled.div`
  display: flex;
  width: 280px;

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`;

const Title = styled.span`
  font-size: 14px;
  letter-spacing: 0.3px;
  color: ${greenDark};
  font-weight: 600;
  flex: 1;
`;

const Clear = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${blue};
  border: none;
  background: transparent;
  cursor: pointer;
`;

const MainFilterItems = styled.div`
  margin-top: 4px;
  padding-left: 6px;
  width: 280px;
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
