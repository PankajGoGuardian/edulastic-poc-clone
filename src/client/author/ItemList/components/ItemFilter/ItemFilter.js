import React, { Component } from "react";
import PropTypes from "prop-types";
import { Affix } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Container,
  Title,
  Clear,
  FixedFilters,
  Header,
  HeaderRow,
  MainFilter,
  MainFilterHeader,
  SearchIcon,
  StyledModal,
  StyledModalContainer,
  StyledModalTitle,
  TextFieldSearch
} from "./styled";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import Search from "../Search/Search";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";

class ItemFilter extends Component {
  renderFullTextSearch = () => {
    const { onSearch } = this.props;
    const placeholder = "Search by skills and keywords";

    return (
      <Header>
        <HeaderRow>
          <TextFieldSearch
            onChange={e => onSearch(e.target.value)}
            type="search"
            icon={<SearchIcon type="search" />}
            containerStyle={{ marginRight: 20 }}
            placeholder={placeholder}
          />
        </HeaderRow>
      </Header>
    );
  };

  render() {
    const {
      windowWidth,
      onClearSearch,
      search,
      onLabelSearch,
      curriculums,
      onSearchFieldChange,
      curriculumStandards,
      t,
      items,
      toggleFilter,
      isShowFilter
    } = this.props;

    return (
      <Container>
        <PerfectScrollbar>
          <FixedFilters>
            <StyledModal open={isShowFilter} onClose={toggleFilter} center>
              <StyledModalContainer>
                <StyledModalTitle>{t("component.itemlist.filter.filters")}</StyledModalTitle>
                {this.renderFullTextSearch()}
                <Search
                  search={search}
                  showStatus={search.filter === items[1].filter}
                  curriculums={curriculums}
                  onSearchFieldChange={onSearchFieldChange}
                  curriculumStandards={curriculumStandards}
                />
              </StyledModalContainer>
            </StyledModal>
            {windowWidth > SMALL_DESKTOP_WIDTH ? this.renderFullTextSearch() : null}
            <MainFilter isVisible={isShowFilter}>
              <Affix>
                <MainFilterHeader>
                  <Title>{t("component.itemlist.filter.filters")}</Title>
                  <Clear onClick={onClearSearch}>{t("component.itemlist.filter.clearAll")}</Clear>
                </MainFilterHeader>
                <TestFiltersNav items={items} onSelect={onLabelSearch} search={search} />
                <Search
                  search={search}
                  showStatus={search.filter !== items[0].filter}
                  curriculums={curriculums}
                  onSearchFieldChange={onSearchFieldChange}
                  curriculumStandards={curriculumStandards}
                />
              </Affix>
            </MainFilter>
          </FixedFilters>
        </PerfectScrollbar>
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
  curriculumStandards: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  isShowFilter: PropTypes.bool.isRequired
};

export default ItemFilter;
