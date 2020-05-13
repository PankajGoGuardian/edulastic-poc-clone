import { SpinLoader } from "@edulastic/common";
import { get, head } from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { getUserRole } from "../../../../src/selectors/user";
import AddToGroupModal from "../../../common/components/Popups/AddToGroupModal";
import TableTooltipRow from "../../../common/components/tooltip/TableTooltipRow";
import { downloadCSV, filterAccordingToRole, getFormattedName } from "../../../common/util";
import { getCsvDownloadingState } from "../../../ducks";
import AnalyseByFilter from "../common/components/filters/AnalyseByFilter";
import TrendStats from "../common/components/trend/TrendStats";
import TrendTable from "../common/components/trend/TrendTable";
import { getFiltersSelector, getReportsMARFilterData } from "../common/filterDataDucks";
import { usefetchProgressHook } from "../common/hooks";
import { getReportsStudentProgress, getReportsStudentProgressLoader, getStudentProgressRequestAction } from "./ducks";
import { useGetBandData } from "./hooks";
import dropDownData from "./static/json/dropDownData.json";
import tableColumns from "./static/json/tableColumns.json";

const DefaultBandInfo = [
  {
    threshold: 70,
    aboveStandard: 1,
    name: "Proficient"
  },
  {
    threshold: 50,
    aboveStandard: 1,
    name: "Basic"
  },
  {
    threshold: 0,
    aboveStandard: 0,
    name: "Below Basic"
  }
];

const compareBy = {
  key: "student",
  title: "Student"
};

const StudentProgress = ({
  getStudentProgressRequestAction,
  studentProgress,
  MARFilterData,
  isCsvDownloading,
  settings,
  loading,
  role,
  filters,
  pageTitle,
  location
}) => {
  const profiles = MARFilterData?.data?.result?.bandInfo || [];

  const bandInfo =
    profiles.find(profile => profile._id === filters.profileId)?.performanceBand ||
    profiles[0]?.performanceBand ||
    DefaultBandInfo;

  usefetchProgressHook(settings, getStudentProgressRequestAction);
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData));
  const [selectedTrend, setSelectedTrend] = useState("");
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [selectedRowKeys, onSelectChange] = useState([]);
  const [checkedStudents, setCheckedStudents] = useState([]);

  const { metricInfo = [] } = get(studentProgress, "data.result", {});
  const { orgData = [], testData = [] } = get(MARFilterData, "data.result", {});
  const [data, trendCount] = useGetBandData(metricInfo, compareBy.key, orgData, selectedTrend, bandInfo);

  if (loading) {
    return <SpinLoader position="fixed" />;
  }

  const customTableColumns = filterAccordingToRole(tableColumns, role);

  const onTrendSelect = trend => setSelectedTrend(trend === selectedTrend ? "" : trend);
  const onCsvConvert = data => downloadCSV(`Student Progress.csv`, data);

  const dataSource = data
    .map(d => ({ ...d, studentName: getFormattedName(d.studentName) }))
    .sort((a, b) => a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase()));

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ id }) =>
      setCheckedStudents(
        checkedStudents.includes(id) ? checkedStudents.filter(i => i !== id) : [...checkedStudents, id]
      ),
    onSelectAll: flag => setCheckedStudents(flag ? dataSource.map(d => d.id) : [])
  };

  const checkedStudentsForModal = dataSource
    .filter(d => checkedStudents.includes(d.id))
    .map(({ id, firstName, lastName, username }) => ({ _id: id, firstName, lastName, username }));

  return (
    <>
      <AddToGroupModal
        groupType="custom"
        visible={showAddToGroupModal}
        onCancel={() => setShowAddToGroupModal(false)}
        checkedStudents={checkedStudentsForModal}
      />
      <TrendStats
        heading="How well are students progressing ?"
        trendCount={trendCount}
        selectedTrend={selectedTrend}
        onTrendSelect={onTrendSelect}
        setShowAddToGroupModal={setShowAddToGroupModal}
        renderFilters={() => <AnalyseByFilter onFilterChange={setAnalyseBy} analyseBy={analyseBy} />}
      />
      <TrendTable
        filters={filters}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        data={dataSource}
        rowSelection={rowSelection}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        rawMetric={metricInfo}
        customColumns={customTableColumns}
        isCellClickable
        location={location}
        pageTitle={pageTitle}
        toolTipContent={(record, columnValue) => {
          return (
            <>
              <TableTooltipRow title={`Student Name : `} value={record.studentName} />
              {role === "teacher" ? (
                <TableTooltipRow title={`Class Name : `} value={record.groupName} />
              ) : (
                <>
                  <TableTooltipRow title={`School Name : `} value={record.schoolName} />
                  <TableTooltipRow title={`Teacher Name : `} value={record.teacherName} />
                </>
              )}
            </>
          );
        }}
      />
    </>
  );
};

const enhance = connect(
  state => ({
    studentProgress: getReportsStudentProgress(state),
    loading: getReportsStudentProgressLoader(state),
    MARFilterData: getReportsMARFilterData(state),
    filters: getFiltersSelector(state),
    role: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state)
  }),
  {
    getStudentProgressRequestAction
  }
);

export default enhance(StudentProgress);
