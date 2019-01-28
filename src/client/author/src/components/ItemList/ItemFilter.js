import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button, Affix, Row, Col } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Modal from 'react-responsive-modal';
import { TextField } from '@edulastic/common';
import { desktopWidth, blue, greenDark, textColor } from '@edulastic/colors';
import Search from './Search';
import { SMALL_DESKTOP_WIDTH, MAX_MOBILE_WIDTH } from '../../constants/others';

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

  renderFullTextSearch = () => {
    const { onSearch, windowWidth } = this.props;
    const { isShowFilter } = this.state;
    const placeholder = 'Full-text search (TODO)';

    const desktopSearch = (
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
                placeholder={placeholder}
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
    );

    const mobileSearch = (
      <Header>
        <SearchField>
          <TextField
            onChange={e => onSearch(e.target.value)}
            height="50px"
            type="search"
            icon={<Icon type="search" style={{ color: blue, fontSize: '18px' }} />}
            containerStyle={{ marginRight: 20 }}
            style={{ padding: 16, paddingRight: 68, outline: 'none' }}
            placeholder={placeholder}
          />
        </SearchField>
        <FilterButton>
          <Button onClick={() => this.showFilterHandler()}>
            {!isShowFilter ? 'SHOW FILTERS' : 'HIDE FILTERS'}
          </Button>
        </FilterButton>
      </Header>
    );

    return (windowWidth > MAX_MOBILE_WIDTH) ? desktopSearch : mobileSearch;
  };

  render() {
    const {
      windowWidth,
      onClearSearch,
      search,
      curriculums,
      onSearchFieldChange,
      curriculumStandards
    } = this.props;
    const { isShowFilter } = this.state;

    return (
      <Container>
        <StyledModal
          open={isShowFilter}
          onClose={this.closeSearchModal}
          center
        >
          <StyledModalContainer>
            <StyledModalTitle>Filters</StyledModalTitle>
            <Search
              search={search}
              curriculums={curriculums}
              onSearchFieldChange={onSearchFieldChange}
              curriculumStandards={curriculumStandards}
              onStandardSearch={this.handleStandardSearch}
            />
          </StyledModalContainer>
        </StyledModal>
        {this.renderFullTextSearch()}
        <MainFilter isVisible={isShowFilter}>
          {
            windowWidth > SMALL_DESKTOP_WIDTH && (
              <Affix style={{ width: 325 }}>
                <PerfectScrollbar>
                  <MainFilterHeader>
                    <Title>Filters</Title>
                    <Clear>
                      <div onClick={onClearSearch}>
                        Clear all
                      </div>
                    </Clear>
                  </MainFilterHeader>
                  <Search
                    search={search}
                    curriculums={curriculums}
                    onSearchFieldChange={onSearchFieldChange}
                    curriculumStandards={curriculumStandards}
                    onStandardSearch={this.handleStandardSearch}
                  />
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
  onClearSearch: PropTypes.func.isRequired,
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

const StyledModal = styled(Modal)`
  width: 100%;
  height: 100%;

  svg {
    fill: red;
  }
`;

const StyledModalContainer = styled.div`
  width: calc(100vw - 80px);
`;

const StyledModalTitle = styled.div`
  font-size: 22px;
  color: #4aac8b;
  font-weight: 600;
`;
