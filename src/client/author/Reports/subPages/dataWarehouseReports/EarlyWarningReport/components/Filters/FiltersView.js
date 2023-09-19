import React from 'react'
import { Col, Row } from 'antd'
import PopupFilters from './PopupFilters'
import PageLevelFilters from './PageLevelFilters'

const FiltersView = ({
  isPrinting,
  reportId,
  selectedFilterTagsData,
  tagTypes,
  availableTestTypes,
  handleCloseTag,
  handleTagClick,
  showFilter,
  toggleFilter,
  filtersTabKey,
  setFiltersTabKey,
  filters,
  setFilters,
  filterTagsData,
  setFilterTagsData,
  updateFilterDropdownCB,
  schoolYears,
  userRole,
  demographics,
  terms,
  showApply,
  showPageLevelApply,
  loadingFiltersData,
  onGoClick,
}) => {
  return (
    <Row type="flex" gutter={[0, 5]} style={{ width: '100%' }}>
      <Col span={24}>
        <PopupFilters
          isPrinting={isPrinting}
          reportId={reportId}
          selectedFilterTagsData={selectedFilterTagsData}
          tagTypes={tagTypes}
          availableTestTypes={availableTestTypes}
          handleCloseTag={handleCloseTag}
          handleTagClick={handleTagClick}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          filtersTabKey={filtersTabKey}
          setFiltersTabKey={setFiltersTabKey}
          filters={filters}
          setFilters={setFilters}
          filterTagsData={filterTagsData}
          setFilterTagsData={setFilterTagsData}
          updateFilterDropdownCB={updateFilterDropdownCB}
          schoolYears={schoolYears}
          userRole={userRole}
          demographics={demographics}
          terms={terms}
          showApply={showApply}
          loadingFiltersData={loadingFiltersData}
          onGoClick={onGoClick}
        />
      </Col>
      <Col span={24}>
        <PageLevelFilters
          reportId={reportId}
          filters={filters}
          showPageLevelApply={showPageLevelApply}
          loadingFiltersData={loadingFiltersData}
          updateFilterDropdownCB={updateFilterDropdownCB}
          onGoClick={onGoClick}
        />
      </Col>
    </Row>
  )
}

export default FiltersView
