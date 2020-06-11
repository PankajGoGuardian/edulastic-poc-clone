import PropTypes from "prop-types";
import React, { memo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { libraryFilters } from "@edulastic/constants";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import Search from "../Search/Search";
import {
  Backdrop,
  Clear,
  CloseIcon,
  Container,
  FixedFilters,
  HeaderRow,
  MainFilter,
  MainFilterHeader,
  SearchWrapper,
  Title
} from "./styled";
import InputTag from "./SearchTag";

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
  toggleFilter,
  itemCount
}) => {
  const renderFullTextSearch = () => (
    <SearchWrapper>
      <HeaderRow>
        <InputTag
          onSearchInputChange={onSearchInputChange}
          value={search.searchString}
          placeholder="Search by skills and keywords"
          disabled={search.filter === libraryFilters.SMART_FILTERS.FAVORITES}
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
                  itemCount={itemCount}
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
  onClearSearch: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

export default memo(ItemFilter);
