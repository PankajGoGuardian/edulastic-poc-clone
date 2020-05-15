import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

// components
import { Link } from "react-router-dom";
import { Spin, Pagination } from "antd";
import { MainHeader, MainContentWrapper, EduButton, withWindowSizes } from "@edulastic/common";
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
  setFilters,
  pageDetail,
  setPageDetail,
  countFlag,
  setCountFlag
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchFiltersData();
    return () => setCountFlag(true);
  }, []);

  useEffect(() => {
    setPageDetail({ ...pageDetail, studentPage: 1, assignmentPage: 1 });
  }, [filters]);

  useEffect(() => {
    fetchGradebookData({ filters, pageDetail, countFlag });
    countFlag && setCountFlag(false); // set countFlag to false after first load
  }, [pageDetail]);

  const curatedFiltersData = curateFiltersData(filtersData, filters);
  const [curatedData, assessmentsData] = curateGradebookData(gradebookData, filtersData);
  const { studentsCount } = gradebookData;

  return (
    <div>
      <MainHeader Icon={IconInterface} headingText="Gradebook" justify="space-between">
        <Link to="/author/assignments">
          <EduButton>VIEW ASSIGNMENTS</EduButton>
        </Link>
      </MainHeader>
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
                current={pageDetail.studentPage}
                pageSize={pageDetail.studentPageSize}
                onChange={studentPage => setPageDetail({ ...pageDetail, studentPage })}
                onShowSizeChange={(_, studentPageSize) =>
                  setPageDetail({ ...pageDetail, studentPage: 1, studentPageSize })
                }
                total={studentsCount}
                showSizeChanger={false}
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
      filters: selectors.selectedFilters(state),
      pageDetail: selectors.pageDetail(state),
      countFlag: selectors.countFlag(state)
    }),
    {
      fetchFiltersData: actions.fetchGradebookFiltersRequest,
      fetchGradebookData: actions.fetchStudentPerformanceRequest,
      setFilters: actions.setSelectedFilters,
      setPageDetail: actions.setPageDetail,
      setCountFlag: actions.setCountFlag
    }
  )
);

export default enhance(Gradebook);
