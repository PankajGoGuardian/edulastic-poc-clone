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

// transformers
import { curateFiltersData, curateGradebookData } from "../transformers";

const Gradebook = ({
  windowWidth,
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
  setPageDetail
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    setPageDetail({ ...pageDetail, studentPage: 1, assignmentPage: 1 });
  }, [filters]);

  useEffect(() => {
    fetchGradebookData({ filters, pageDetail });
  }, [pageDetail]);

  const curatedFiltersData = curateFiltersData(filtersData, filters);
  const [curatedData, assessmentsData] = curateGradebookData(gradebookData, filters);
  const { students = [], studentsCount, assignmentsCount } = gradebookData;

  const selectedStudents = students.filter(s => selectedRows.includes(s._id));

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
                clearFilters={() => setFilters(INITIAL_FILTERS)}
                onNewGroupClick={() => setShowAddToGroupModal(true)}
              />
            </ScrollbarContainer>
          )}
          <FilterButton showFilter={showFilter} onClick={() => setShowFilter(!showFilter)}>
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
      filters: selectors.selectedFilters(state),
      pageDetail: selectors.pageDetail(state)
    }),
    {
      fetchFiltersData: actions.fetchGradebookFiltersRequest,
      fetchGradebookData: actions.fetchStudentPerformanceRequest,
      setFilters: actions.setSelectedFilters,
      setPageDetail: actions.setPageDetail
    }
  )
);

export default enhance(Gradebook);
