import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import { message } from "antd";
import { ProgressBar, EduButton } from "@edulastic/common";
import { IconUser } from "@edulastic/icons";
import { themeColorLighter, borderGrey } from "@edulastic/colors";
import { TableContainer, StyledTable, TableHeader, Tag, StyledSlider, TableSelect } from "./style";

const WorkTable = ({
  type,
  addRecommendations,
  selectedAssignment,
  groupId,
  differentiationStudentList,
  data = [],
  isFetchingWork
}) => {
  /** Drop handle to accept dropped items from manage content (yet to be implemented) */
  const [{ isOver }, drop] = useDrop({
    accept: "",
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

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

  useEffect(() => {
    if (data[0]?.masteryRange) setMasteryRange(data[0].masteryRange);
  }, [data]);

  useEffect(() => {
    if (!isFetchingWork) {
      setSelectedRows([]);
    }
  }, [isFetchingWork]);

  const getProgressBar = percentage => {
    const dataObj = {
      trailColor: borderGrey,
      strokeColor: themeColorLighter,
      percent: percentage || 0,
      format: percent => `${percent}%`
    };

    const { trailColor, strokeColor, percent, format } = dataObj;
    return (
      <ProgressBar
        strokeWidth={10}
        trailColor={trailColor}
        strokeColor={strokeColor}
        percent={percent}
        format={format}
      />
    );
  };

  const getSlider = () => (
    <>
      <StyledSlider range value={masteryRange} onChange={value => handleSliderChange(value)} />
      <span>{`Between ${masteryRange[0]}% and ${masteryRange[1]}%`}</span>
    </>
  );

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
      dataIndex: "identifier",
      key: "identifier",
      render: s => <Tag marginRight="10px">{s}</Tag>
    },
    {
      title: "",
      dataIndex: "description",
      key: "description"
    },
    /** Hiding these two columns for now 
    {
      title: "AVG. Mastery",
      dataIndex: "averageMastery",
      key: "averageMastery",
      render: p => <div style={{ width: "120px" }}>{getProgressBar(p)}</div>
    },
    {
      title: "NOT STARTED",
      dataIndex: "notStarted",
      key: "notStarted",
      render: s => `${s} Students`
    }, */
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
      return `Review ${selectedAssignment.title}`;
    }
    if (type === "PRACTICE") {
      return `Practice ${selectedAssignment.title}`;
    }
    if (type === "CHALLENGE") {
      return `Challenge ${selectedAssignment.title}`;
    }
  };

  const handleAdd = () => {
    if (!selectedRows.length) return message.error("Please select atleast one standard to add.");
    const standardIdentifiers = selectedRows.map(i => data[i].identifier);
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
    addRecommendations(obj);
  };

  return (
    <TableContainer ref={drop}>
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
