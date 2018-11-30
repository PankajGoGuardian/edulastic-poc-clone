import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon, Button, Affix, Row, Col } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { TextField } from '@edulastic/common';
import { desktopWidth, blue, greenDark, textColor } from '@edulastic/colors';

class ItemFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectItems: [],
      isShowFilter: false,
    };
  }

  showFilterHandler = () => {
    const { isShowFilter } = this.state;
    this.setState({ isShowFilter: !isShowFilter });
  }

  renderMainFilter = () => {
    const { subjectItems } = this.state;
    return (
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
    );
  }

  render() {
    const { onSearch, windowWidth } = this.props;
    const { isShowFilter } = this.state;

    return (
      <Container>
        {
          windowWidth > 468 ? (
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
            </Header>) : (
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
            windowWidth > 992 ? (
              <Affix style={{ width: 325 }}>
                <PerfectScrollbar>
                  <MainFilterHeader>
                    <Title>Filters</Title>
                    <Clear>Clear all</Clear>
                  </MainFilterHeader>
                  {this.renderMainFilter()}
                </PerfectScrollbar>
              </Affix>)
              :
              this.renderMainFilter()
          }
        </MainFilter>
      </Container>
    );
  }
}

ItemFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
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
