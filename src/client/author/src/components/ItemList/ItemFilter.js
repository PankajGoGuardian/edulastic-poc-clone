import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button, Affix, Row, Col } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Modal from 'react-responsive-modal';
import { TextField } from '@edulastic/common';
import {
  desktopWidth,
  blue,
  greenDark,
  textColor,
  mainBlueColor,
  boxShadowDefault
} from '@edulastic/colors';
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

  handleStandardSearch = searchStr => {
    const {
      getCurriculumStandards,
      search: { grades, curriculumId }
    } = this.props;
    if (curriculumId && searchStr.length >= 2) {
      getCurriculumStandards(curriculumId, grades, searchStr);
    }
  };

  renderFullTextSearch = () => {
    const { onSearch, windowWidth } = this.props;
    const { isShowFilter } = this.state;
    const placeholder = 'Search by skills and keywords';

    const desktopSearch = (
      <Header>
        <HeaderRow>
          <Col lg={24} md={18} xs={18}>
            <TextFieldSearch
              onChange={e => onSearch(e.target.value)}
              type="search"
              icon={<SearchIcon type="search" />}
              containerStyle={{ marginRight: 20 }}
              placeholder={placeholder}
            />
          </Col>
          <Col span={6}>
            <FilterButton>
              <Button onClick={() => this.showFilterHandler()}>
                {!isShowFilter ? 'SHOW FILTERS' : 'HIDE FILTERS'}
              </Button>
            </FilterButton>
          </Col>
        </HeaderRow>
      </Header>
    );

    const mobileSearch = (
      <Header>
        <SearchField>
          <TextFieldStyled
            onChange={e => onSearch(e.target.value)}
            height="50px"
            type="search"
            icon={<SearchIcon type="search" />}
            containerStyle={{ marginRight: 20 }}
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

    return windowWidth > MAX_MOBILE_WIDTH ? desktopSearch : mobileSearch;
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
        <FixedFilters>
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
            {windowWidth > SMALL_DESKTOP_WIDTH && (
              <Affix>
                <PerfectScrollbar>
                  <MainFilterHeader>
                    <Title>Filters</Title>
                    <Clear onClick={onClearSearch}>Clear all</Clear>
                  </MainFilterHeader>
                  <Search
                    search={search}
                    curriculums={curriculums}
                    onSearchFieldChange={onSearchFieldChange}
                    curriculumStandards={curriculumStandards}
                    onStandardSearch={this.handleStandardSearch}
                  />
                </PerfectScrollbar>
              </Affix>
            )}
          </MainFilter>
        </FixedFilters>
      </Container>
    );
  }
}

ItemFilter.propTypes = {
  search: PropTypes.object.isRequired,
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })
  ).isRequired,
  onSearchFieldChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired
};

export default ItemFilter;

const Container = styled.div`
  width: 250px;
  @media (max-width: ${desktopWidth}) {
    width: 100%;
    padding-bottom: 20px;
  }
`;

const FixedFilters = styled.div`
  position: fixed;
  width: 250px;
  top: 85px;
  padding-right: 15px;
  @media (max-width: ${desktopWidth}) {
    width: 100%;
    position: relative;
    top: auto;
    padding-right: 0;
  }
`;

const Header = styled.div`
  display: flex;
`;

const HeaderRow = styled(Row)`
  width: 100%;
`;

const SearchField = styled.div`
  box-shadow: ${boxShadowDefault};
  border-radius: 10px;
`;

const TextFieldStyled = styled(TextField)`
  padding: 16px;
  padding-right: 68px;
  outline: none;
`;

const TextFieldSearch = styled(TextField)`
  height: 40px;
  padding: 10px 10px;
  span {
    right: 8px;
  }
  .ant-input-search-icon {
    color: ${mainBlueColor};
    font-size: 15px;
    &:hover {
      color: ${mainBlueColor};
    }
  }
  @media (max-width: ${desktopWidth}) {
    height: 40px;
  }
`;

const SearchIcon = styled(Icon)`
  color: ${mainBlueColor};
  fontsize: 15px;
`;

const FilterButton = styled.div`
  display: none;
  flex: 1;
  height: 40px;
  box-shadow: ${boxShadowDefault};
  border-radius: 10px;

  .ant-btn {
    height: 40px;
    border-radius: 10px;
    width: 100%;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
    margin-left: 10px;
  }
`;

const MainFilter = styled.div`
  margin-top: 17px;
  zindex: 0;

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

const Clear = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${blue};
  border: none;
  background: transparent;
  cursor: pointer;
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
  color: ${greenDark};
  font-weight: 600;
`;
