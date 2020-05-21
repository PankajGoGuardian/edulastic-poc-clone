import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

// components
import { Link } from "react-router-dom";
import { Spin, Pagination, Row } from "antd";
import { MainHeader, MainContentWrapper, EduButton, withWindowSizes } from "@edulastic/common";
import { IconInterface, IconFilter, IconPlusCircle } from "@edulastic/icons";
import GradebookFilters from "./GradebookFilters";
import GradebookTable from "./GradebookTable";
import GradebookStatusColors from "./GradebookStatusColors";
import {
  FilterButton,
  TableHeader,
  TableContainer,
  TableFooter,
  ScrollbarContainer,
  LeftArrow,
  RightArrow
} from "./styled";
import AddToGroupModal from "../../Reports/common/components/Popups/AddToGroupModal";

// ducks
import { actions, selectors } from "../ducks";
import { getCurrentTerm } from "../../src/selectors/user";

// transformers & constants
import { curateFiltersData, curateGradebookData, INITIAL_FILTERS } from "../transformers";

const Gradebook = ({
  windowWidth,
  windowHeight,
  fetchFiltersData,
  loadingFilters,
  filtersData,
  fetchGradebookData,
  loading,
  gradebookData,
  showFilter,
  toggleShowFilter,
  filters,
  setFilters,
  pageDetail,
  setPageDetail,
  termId
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);

  const setInitialFilters = () => setFilters({ ...INITIAL_FILTERS, termId });

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    if (Object.keys(filters).length) {
      setPageDetail({ ...pageDetail, studentPage: 1, assignmentPage: 1 });
    } else {
      setInitialFilters();
    }
  }, [filters]);

  useEffect(() => {
    if (Object.keys(filters).length) {
      fetchGradebookData({ filters, pageDetail });
    }
  }, [pageDetail]);

  const curatedFiltersData = curateFiltersData(filtersData, filters);
  const [curatedData, assessmentsData] = curateGradebookData(gradebookData, filters);
  const { students = [], studentsCount, assignmentsCount } = gradebookData;

  const selectedStudentIds = Array.from(new Set(selectedRows.map(r => r.split("_")[0])));
  const selectedStudents = students.filter(s => selectedStudentIds.includes(s._id));

  return (
    <div>
      <AddToGroupModal
        groupType="custom"
        visible={showAddToGroupModal}
        onCancel={() => setShowAddToGroupModal(false)}
        checkedStudents={selectedStudents}
      />
      <MainHeader Icon={IconInterface} headingText="Gradebook" justify="space-between">
        <Row type="flex">
          <Link to="/author/assignments">
            <EduButton isGhost>VIEW ASSIGNMENTS</EduButton>
          </Link>
          <EduButton onClick={() => setShowAddToGroupModal(true)}>
            <IconPlusCircle />
            Add to Student Group
          </EduButton>
        </Row>
      </MainHeader>
      {loading || loadingFilters ? (
        <MainContentWrapper>
          <Spin />
        </MainContentWrapper>
      ) : (
        <MainContentWrapper style={{ display: "inline-flex" }}>
          {showFilter && (
            <ScrollbarContainer height={windowHeight - 120}>
              <GradebookFilters
                data={curatedFiltersData}
                filters={filters}
                updateFilters={setFilters}
                clearFilters={setInitialFilters}
                onNewGroupClick={() => setShowAddToGroupModal(true)}
              />
            </ScrollbarContainer>
          )}
          <FilterButton showFilter={showFilter} onClick={toggleShowFilter}>
            <IconFilter width={20} height={20} />
          </FilterButton>
          <TableContainer showFilter={showFilter}>
            <TableHeader>
              <LeftArrow
                onClick={() => setPageDetail({ ...pageDetail, assignmentPage: pageDetail.assignmentPage - 1 })}
                disabled={pageDetail.assignmentPage === 1}
              />
              <RightArrow
                onClick={() => setPageDetail({ ...pageDetail, assignmentPage: pageDetail.assignmentPage + 1 })}
                disabled={
                  assignmentsCount &&
                  pageDetail.assignmentPage === Math.ceil(assignmentsCount / pageDetail.assignmentPageSize)
                }
              />
            </TableHeader>
            <GradebookTable
              data={curatedData}
              assessments={assessmentsData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              windowWidth={windowWidth}
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
      showFilter: selectors.showFilter(state),
      filters: selectors.selectedFilters(state),
      pageDetail: selectors.pageDetail(state),
      termId: getCurrentTerm(state)
    }),
    {
      fetchFiltersData: actions.fetchGradebookFiltersRequest,
      fetchGradebookData: actions.fetchStudentPerformanceRequest,
      toggleShowFilter: actions.toggleShowFilter,
      setFilters: actions.setSelectedFilters,
      setPageDetail: actions.setPageDetail
    }
  )
);

export default enhance(Gradebook);
