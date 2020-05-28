import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty } from "lodash";

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
import { curateFiltersData, curateGradebookData, INITIAL_FILTERS, PAGE_DETAIL } from "../transformers";

const Gradebook = ({
  windowWidth,
  windowHeight,
  fetchFiltersData,
  loadingFilters,
  filtersData,
  fetchGradebookData,
  gradebookData,
  showFilter,
  toggleShowFilter,
  filters,
  setFilters,
  pageDetail,
  setPageDetail,
  termId
}) => {
  const [onComponentLoad, setOnComponentLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [pseudoPageDetail, setPseudoPageDetail] = useState({ ...PAGE_DETAIL });

  const setInitialFilters = () => setFilters({ ...INITIAL_FILTERS, termId });

  const handlePagination = paginationData =>
    filters.status ? setPseudoPageDetail(paginationData) : setPageDetail(paginationData);

  useEffect(() => {
    fetchFiltersData();
    setOnComponentLoad(false);
  }, []);

  useEffect(() => {
    if (!isEmpty(filters)) {
      setPageDetail({ ...PAGE_DETAIL });
      setPseudoPageDetail({ ...PAGE_DETAIL });
    } else {
      setInitialFilters();
    }
  }, [filters]);

  useEffect(() => {
    if (!onComponentLoad) {
      fetchGradebookData({ filters, pageDetail });
      setLoading(true);
    }
  }, [pageDetail]);

  useEffect(() => setLoading(false), [gradebookData]);

  const pagination = filters.status ? pseudoPageDetail : pageDetail;
  const curatedFiltersData = curateFiltersData(filtersData, filters);
  const { curatedData, assessmentsData, studentsCount, assignmentsCount } = curateGradebookData(
    gradebookData,
    pagination,
    filters.status
  );

  // select unique students for AddToGroupModal
  const { students = [] } = gradebookData;
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
      {loadingFilters ? (
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
          {loading ? (
            <TableContainer showFilter={showFilter}>
              <Spin />
            </TableContainer>
          ) : (
            <TableContainer showFilter={showFilter}>
              <TableHeader>
                <LeftArrow
                  onClick={() => handlePagination({ ...pagination, assignmentPage: pagination.assignmentPage - 1 })}
                  disabled={pagination.assignmentPage === 1}
                />
                <RightArrow
                  onClick={() => handlePagination({ ...pagination, assignmentPage: pagination.assignmentPage + 1 })}
                  disabled={
                    assignmentsCount === 0 ||
                    pagination.assignmentPage === Math.ceil(assignmentsCount / pagination.assignmentPageSize)
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
                {/* NOTE: When status filter is set, assignment pagination is dependent on student pagination */}
                <Pagination
                  current={pagination.studentPage}
                  pageSize={pagination.studentPageSize}
                  onChange={studentPage =>
                    handlePagination({
                      ...pagination,
                      ...(filters.status ? { assignmentPage: 1 } : {}),
                      studentPage
                    })
                  }
                  onShowSizeChange={(_, studentPageSize) =>
                    handlePagination({
                      ...pagination,
                      ...(filters.status ? { assignmentPage: 1 } : {}),
                      studentPage: 1,
                      studentPageSize
                    })
                  }
                  total={studentsCount}
                  showSizeChanger={false}
                />
              </TableFooter>
            </TableContainer>
          )}
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
