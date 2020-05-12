import React, { useState } from "react";
import styled from "styled-components";

// components
import { MainHeader, MainContentWrapper, Button } from "@edulastic/common";
import { IconInterface, IconFilter } from "@edulastic/icons";
import GradebookFilters from "./GradebookFilters";
import GradebookTable from "./GradebookTable";
import GradebookStatusColors from "./GradebookStatusColors";

// constants & transformers
import { white, themeColor } from "@edulastic/colors";
import { getFormattedName } from "../transformers";
import { dummyAssessmentsData, dummyTableData } from "../transformers";

const INITIAL_FILTERS = {
  assessments: [],
  statuses: [],
  classes: [],
  grades: [],
  subjects: [],
  years: [],
  testTypes: [],
  groups: []
};

const Gradebook = props => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedRows, setSelectedRows] = useState([]);

  const tableData = dummyTableData
    .map(s => ({ ...s, studentName: getFormattedName(s.firstName, s.middleName, s.lastName) }))
    .sort((a, b) => b.studentName.toLowerCase().localeCompare(a.studentName.toLowerCase()));

  return (
    <div>
      <MainHeader Icon={IconInterface} headingText="Gradebook" justify="space-between" />
      <MainContentWrapper style={{ display: "inline-flex" }}>
        {showFilter && (
          <GradebookFilters
            data={filters}
            filters={filters}
            updateFilters={setFilters}
            clearFilters={() => setFilters(INITIAL_FILTERS)}
          />
        )}
        <FilterButton showFilter={showFilter} onClick={() => setShowFilter(!showFilter)}>
          <IconFilter color={showFilter ? white : themeColor} width={20} height={20} />
        </FilterButton>
        <TableContainer showFilter={showFilter}>
          <GradebookTable
            data={tableData}
            assessments={dummyAssessmentsData}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          <GradebookStatusColors />
        </TableContainer>
      </MainContentWrapper>
    </div>
  );
};

export default Gradebook;

const FilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  padding: 2px;
  padding-top: 5px;
  border-radius: 3px;
  position: fixed;
  z-index: 1;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  margin-left: ${props => (props.showFilter ? "240px" : "-23px")};
  background: ${props => (props.showFilter ? themeColor : white)} !important;
  &:focus,
  &:hover {
    outline: unset;
  }
`;

const TableContainer = styled.div`
  min-height: 100%;
  width: ${props => (props.showFilter ? "calc(100% - 220px)" : "100%")};
  padding-left: ${props => (props.showFilter ? "50px" : "0px")};
`;
