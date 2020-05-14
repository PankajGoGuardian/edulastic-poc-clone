import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

// components
import { Spin, Pagination } from "antd";
import { MainHeader, MainContentWrapper, withWindowSizes } from "@edulastic/common";
import { IconInterface, IconFilter } from "@edulastic/icons";
import GradebookFilters from "./GradebookFilters";
import GradebookTable from "./GradebookTable";
import GradebookStatusColors from "./GradebookStatusColors";
import { FilterButton, TableContainer, TableFooter } from "./styled";

// ducks
import { actions, selectors } from "../ducks";

// transformers
import { curateFiltersData, curateGradebookData } from "../transformers";

const Gradebook = ({
  windowHeight,
  fetchFiltersData,
  loadingFilters,
  filtersData,
  fetchGradebookData,
  loading,
  gradebookData,
  filters,
  setFilters
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageDetail, setPageDetail] = useState([]);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const [studentPage, studentPageSize] = pageDetail;
    fetchGradebookData({ filters, studentPage, studentPageSize });
  }, [filters, pageDetail]);

  const curatedFiltersData = curateFiltersData(filtersData, filters);
  const [curatedData, assessmentsData] = curateGradebookData(gradebookData, filtersData);
  const { studentsCount } = gradebookData;

  return (
    <div>
      <MainHeader Icon={IconInterface} headingText="Gradebook" justify="space-between" />
      {loading || loadingFilters ? (
        <MainContentWrapper>
          <Spin />
        </MainContentWrapper>
      ) : (
        <MainContentWrapper style={{ display: "inline-flex" }}>
          {showFilter && (
            <GradebookFilters
              data={curatedFiltersData}
              filters={filters}
              updateFilters={setFilters}
              clearFilters={() => setFilters(INITIAL_FILTERS)}
            />
          )}
          <FilterButton showFilter={showFilter} onClick={() => setShowFilter(!showFilter)}>
            <IconFilter width={20} height={20} />
          </FilterButton>
          <TableContainer showFilter={showFilter}>
            <GradebookTable
              data={curatedData}
              assessments={assessmentsData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              windowHeight={windowHeight}
            />
            <TableFooter>
              <GradebookStatusColors />
              <Pagination
                showSizeChanger
                onChange={(pgNo, pgSize) => setPageDetail([pgNo, pgSize])}
                onShowSizeChange={(_, pgSize) => setPageDetail([1, pgSize])}
                total={studentsCount}
              />
            </TableFooter>
          </TableContainer>
        </MainContentWrapper>
      )}
    </div>
  );
};

const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      loadingFilters: selectors.loadingFilters(state),
      filtersData: selectors.filtersData(state),
      loading: selectors.loading(state),
      gradebookData: selectors.gradebookData(state),
      filters: selectors.selectedFilters(state)
    }),
    {
      fetchFiltersData: actions.fetchGradebookFiltersRequest,
      fetchGradebookData: actions.fetchStudentPerformanceRequest,
      setFilters: actions.setSelectedFilters
    }
  )
);

export default enhance(Gradebook);
