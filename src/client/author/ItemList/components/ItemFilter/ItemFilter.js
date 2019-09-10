import React, { Component } from "react";
import PropTypes from "prop-types";
import { Affix, Input } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Container, Title, Clear, FixedFilters, Header, HeaderRow, MainFilter, MainFilterHeader } from "./styled";

import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import Search from "../Search/Search";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";

class ItemFilter extends Component {
  renderFullTextSearch = () => {
    const {
      onSearchInputChange,
      search: { searchString }
    } = this.props;

    return (
      <Header>
        <HeaderRow>
          <Input.Search
            placeholder="Search by skills and keywords"
            onChange={onSearchInputChange}
            size="large"
            value={searchString}
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
      onSearchInputChange,
      curriculumStandards,
      t,
      allTagsData,
      items
    } = this.props;

    return (
      <Container>
        <PerfectScrollbar>
          <FixedFilters>
            {windowWidth > SMALL_DESKTOP_WIDTH ? this.renderFullTextSearch() : null}
            <MainFilter>
              <Affix>
                <MainFilterHeader>
                  <Title>{t("component.itemlist.filter.filters")}</Title>
                  <Clear data-cy="clearAll" onClick={onClearSearch}>
                    {t("component.itemlist.filter.clearAll")}
                  </Clear>
                </MainFilterHeader>
                <TestFiltersNav items={items} onSelect={onLabelSearch} search={search} />
                <Search
                  search={search}
                  showStatus={search.filter !== items[0].filter}
                  curriculums={curriculums}
                  allTagsData={allTagsData}
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
  onSearchInputChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

export default ItemFilter;
