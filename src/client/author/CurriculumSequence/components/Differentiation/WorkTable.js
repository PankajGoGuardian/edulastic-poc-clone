import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import { message } from "antd";
import { groupBy } from "lodash";
import { ProgressBar, EduButton } from "@edulastic/common";
import { IconUser } from "@edulastic/icons";
import { themeColorLighter, borderGrey } from "@edulastic/colors";
import { TableContainer, StyledTable, TableHeader, Tag, StyledSlider, TableSelect } from "./style";
import { ResouceIcon } from "../ResourceItem/index";

const WorkTable = ({
  type,
  addRecommendations,
  selectedAssignment,
  groupId,
  differentiationStudentList,
  data = [],
  isFetchingWork,
  workStatusData,
  addTestToDifferentiation
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [masteryRange, setMasteryRange] = useState([0, 10]);

  const isDisabledMasterySlider = useMemo(() => !!data.find(s => s.status === "ADDED"), [data]);
  const filteredStudentList = useMemo(
    () =>
      differentiationStudentList.filter(
        ({ performance }) => performance >= masteryRange[0] && performance <= masteryRange[1]
      ),
    [masteryRange, differentiationStudentList]
  );

  const handleSliderChange = value => {
    if (isDisabledMasterySlider) return;
    setMasteryRange(value);
  };

  useEffect(() => {
    if (type === "REVIEW") {
      handleSliderChange([0, 69]);
    } else if (type === "PRACTICE") {
      handleSliderChange([70, 90]);
    } else {
      handleSliderChange([91, 100]);
    }
  }, []);

  /** Drop handle to accept dropped items from manage content (yet to be implemented) */
  const [{ isOver }, drop] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver()
    }),
    drop: (item, monitor) => {
      if (selectedAssignment?._id && groupId && item.dataType === "tests") {
        console.log("dropped item", item);
        addTestToDifferentiation({ type: type.toLowerCase(), testId: item?.id, masteryRange, title: item?.title });
      }
    }
  });

  useEffect(() => {
    if (data[0]?.masteryRange) setMasteryRange(data[0].masteryRange);
  }, [data]);

  useEffect(() => {
    if (!isFetchingWork) {
      setSelectedRows([]);
    }
  }, [isFetchingWork]);

  const getProgressBar = percentage => {
    if (!percentage && percentage !== 0) return null;
    const dataObj = {
      trailColor: borderGrey,
      strokeColor: themeColorLighter,
      percent: percentage || 0,
      format: percent => `${percent}%`
    };

    const { trailColor, strokeColor, percent, format } = dataObj;
    return (
      <div style={{ width: "120px" }}>
        <ProgressBar
          strokeWidth={10}
          trailColor={trailColor}
          strokeColor={strokeColor}
          percent={percent}
          format={format}
        />
      </div>
    );
  };

  const getSlider = () => {
    if (type === "REVIEW") {
      return (
        <>
          <StyledSlider min={1} value={masteryRange[1]} onChange={value => handleSliderChange([0, value])} />
          <span>{`Below ${masteryRange[1]}%`}</span>
        </>
      );
    }
    if (type === "PRACTICE") {
      return (
        <>
          <StyledSlider range value={masteryRange} onChange={value => handleSliderChange(value)} />
          <span>{`Between ${masteryRange[0]}% and ${masteryRange[1]}%`}</span>
        </>
      );
    }
    if (type === "CHALLENGE") {
      return (
        <>
          <StyledSlider
            reverse
            value={100 - masteryRange[0] + 1}
            onChange={value => handleSliderChange([100 - value, 100])}
            min={1}
            tipFormatter={value => 100 - value}
          />
          <span>{`Above ${masteryRange[0] - 1}%`}</span>
        </>
      );
    }
  };

  const handleRowSelect = selectionType => {
    if (selectionType === "UNSELECT") {
      setSelectedRows([]);
    } else {
      const keyArray = [];
      data.forEach((row, i) => {
        if (row.status === "RECOMMENDED") {
          keyArray.push(i);
        }
      });
      setSelectedRows(keyArray);
    }
  };

  const columns = [
    {
      title: () => (
        <TableSelect>
          <span onClick={() => handleRowSelect("SELECT")}>Select All</span>
          <span onClick={() => handleRowSelect("UNSELECT")}>Unselect All</span>
        </TableSelect>
      ),
      dataIndex: "standardIdentifier",
      key: "standardIdentifier",
      render: (s, record) => {
        return record.testId ? <ResouceIcon type="tests" /> : <Tag marginRight="10px">{s}</Tag>;
      }
    },
    {
      title: "",
      dataIndex: "description",
      key: "description"
    },

    {
      title: "AVG. Mastery",
      dataIndex: "averageMastery",
      key: "averageMastery",
      render: p => getProgressBar(p)
    },
    {
      title: "NOT STARTED",
      dataIndex: "notStartedCount",
      key: "notStartedCount",
      width: "130px",
      render: s => (s !== undefined ? `${s} Students` : null)
    },
    {
      title: "",
      key: "status",
      dataIndex: "status",
      render: s => <Tag>{s}</Tag>
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: selectedRowKeys => {
      setSelectedRows(selectedRowKeys);
    },
    getCheckboxProps: record => ({
      disabled: record.status === "ADDED"
    })
  };

  const getResourceTitle = () => {
    if (type === "REVIEW") {
      return `Review #${workStatusData.length + 1} - ${selectedAssignment.title}`;
    }
    if (type === "PRACTICE") {
      return `Practice #${workStatusData.length + 1} - ${selectedAssignment.title}`;
    }
    if (type === "CHALLENGE") {
      return `Challenge #${workStatusData.length + 1} - ${selectedAssignment.title}`;
    }
  };

  const handleAdd = () => {
    if (!selectedRows.length) return message.error("Please select atleast one standard to add.");
    if (!filteredStudentList.length)
      return message.error("Please select the mastery range which is having atleast 1 student.");

    const groups = groupBy(selectedRows.map(x => data[x]), x => (x.testId ? "tests" : "standards"));

    const recommendations = [];
    if (groups.standards) {
      const standardIdentifiers = groups.standards.map(x => x.standardIdentifier);
      const obj = {
        assignmentId: selectedAssignment._id,
        groupId,
        standardIdentifiers,
        type,
        masteryRange: {
          min: masteryRange[0],
          max: masteryRange[1]
        },
        resourceTitle: getResourceTitle()
      };

      recommendations.push(obj);
    }

    if (groups.tests) {
      const testIds = groups.tests.map(x => x.testId);
      const obj = {
        assignmentId: selectedAssignment._id,
        groupId,
        testIds,
        type,
        masteryRange: {
          min: masteryRange[0],
          max: masteryRange[1]
        },
        resourceTitle: getResourceTitle()
      };
      recommendations.push(obj);
    }

    if (recommendations.length) {
      addRecommendations(recommendations);
    }
  };

  return (
    <TableContainer highlighted={isOver} data-cy={`table-${type}`} ref={drop}>
      <TableHeader>
        <span>{type === "REVIEW" ? "Review Work" : type === "PRACTICE" ? "Practice Work" : "Challenge Work"}</span>
        <span>
          <span>Mastery Range</span>
          <>{getSlider()}</>
        </span>
        <span>
          <IconUser />
          &nbsp;&nbsp;{filteredStudentList.length}
        </span>
        <span>
          {/* Hiding the button for now
          
          <EduButton isGhost height="30px">
            Replace
          </EduButton> */}
          <EduButton height="30px" onClick={handleAdd}>
            Add
          </EduButton>
        </span>
      </TableHeader>
      <StyledTable
        columns={columns}
        rowSelection={rowSelection}
        dataSource={data}
        pagination={false}
        loading={isFetchingWork}
      />
    </TableContainer>
  );
};

export default WorkTable;
