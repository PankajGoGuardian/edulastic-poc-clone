import React, { memo } from "react";
import compose from "redux";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Container,
  Backdrop,
  CloseIcon,
  Title,
  Clear,
  FixedFilters,
  SearchWrapper,
  HeaderRow,
  MainFilter,
  MainFilterHeader,
  AffixContainer,
  SearchInput
} from "./styled";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import Search from "../Search/Search";

const ItemFilter = ({
  onClearSearch,
  search,
  onLabelSearch,
  curriculums,
  onSearchFieldChange,
  onSearchInputChange,
  curriculumStandards,
  t,
  items,
  toggleFilter
}) => {
  const renderFullTextSearch = () => (
    <SearchWrapper>
      <HeaderRow>
        <SearchInput
          placeholder="Search by skills and keywords"
          onChange={onSearchInputChange}
          size="large"
          value={search.searchString}
        />
      </HeaderRow>
    </SearchWrapper>
  );

  return (
    <>
      <Backdrop />
      <Container>
        <CloseIcon type="close" onClick={toggleFilter} />
        <PerfectScrollbar>
          <FixedFilters>
            {renderFullTextSearch()}
            <MainFilter>
              <div>
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
                  onSearchFieldChange={onSearchFieldChange}
                  curriculumStandards={curriculumStandards}
                />
              </div>
            </MainFilter>
          </FixedFilters>
        </PerfectScrollbar>
      </Container>
    </>
  );
};

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

export default memo(ItemFilter);
