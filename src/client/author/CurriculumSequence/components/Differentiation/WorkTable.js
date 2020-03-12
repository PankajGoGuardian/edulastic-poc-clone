import React, { useState, useEffect } from "react";
import { ProgressBar, EduButton } from "@edulastic/common";
import { IconUser } from "@edulastic/icons";
import { themeColorLighter, borderGrey } from "@edulastic/colors";
import { TableContainer, StyledTable, TableHeader, Tag, StyledSlider, TableSelect } from "./style";

const dummyData = [
  {
    standard: { identifier: "4.NF.3a", name: "Creating equivalent Fractions" },
    averageMastery: 19,
    notStarted: 2,
    status: "Recommended"
  },
  {
    standard: { identifier: "4.NF.3b", name: "Creating equivalent Fractions and integers" },
    averageMastery: 10,
    notStarted: 3,
    status: "Added"
  },
  {
    standard: { identifier: "4.NF.3c", name: "Represnting Fractions" },
    averageMastery: 40,
    notStarted: 3,
    status: "Recommended"
  },
  {
    standard: { identifier: "4.NF.3d", name: "Addition and Substraction of Mixed Numbers" },
    averageMastery: 25,
    notStarted: 1,
    status: "Recommended"
  }
];

const WorkTable = ({ type, addRecommendations, masteryRange, changeMasteryRange }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  // const [masteryRange, setMasteryRange] = useState([0, 10]);

  //   useEffect(() => {
  //     if (type === "REVIEW") setMasteryRange([0, 69]);
  //     else if (type === "PRACTICE") setMasteryRange([70, 90]);
  //     else setMasteryRange([91, 100]);
  //   }, []);
  const getProgressBar = percentage => {
    const dataObj = {
      trailColor: borderGrey,
      strokeColor: themeColorLighter,
      percent: 0,
      format: percent => `${percent}%`
    };

    if (percentage) {
      dataObj.percent = percentage;
    } else if (type === "REVIEW") {
      dataObj.percent = 69;
      dataObj.format = () => "Below 70%";
    } else if (type === "CHALLENGE") {
      dataObj.trailColor = themeColorLighter;
      dataObj.strokeColor = borderGrey;
      dataObj.percent = 91;
      dataObj.format = () => "Above 90%";
    }

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

  const getSlider = () => {
    if (type === "REVIEW") {
      return (
        <>
          <StyledSlider value={masteryRange} onChange={value => changeMasteryRange(type, value)} />
          <span>{`Below ${+masteryRange + 1}%`}</span>
        </>
      );
    }
    if (type === "PRACTICE") {
      return (
        <>
          <StyledSlider range value={masteryRange} onChange={value => changeMasteryRange(type, value)} />
          <span>{`Between ${masteryRange[0]}% and ${masteryRange[1]}%`}</span>
        </>
      );
    }
    if (type === "CHALLENGE") {
      return (
        <>
          <StyledSlider reverse value={100 - masteryRange} onChange={value => changeMasteryRange(type, 100 - value)} />
          <span>{`Above ${masteryRange}%`}</span>
        </>
      );
    }
  };

  const handleRowSelect = selectionType => {
    if (selectionType === "UNSELECT") {
      setSelectedRows([]);
    } else {
      const keyArray = dummyData.map((_, i) => i);
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
      dataIndex: "standard",
      key: "standard",
      render: s => (
        <div>
          <Tag marginRight="10px">{s.identifier}</Tag>
          {s.name}
        </div>
      )
    },
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
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name
    })
  };

  const handleAdd = () => {
    addRecommendations();
  };

  return (
    <TableContainer>
      <TableHeader>
        <span>{type === "REVIEW" ? "Review Work" : type === "PRACTICE" ? "Practice Work" : "Challenge Work"}</span>
        <span>
          <span>Mastery Range</span>
          <>{getSlider()}</>
        </span>
        <span>
          <IconUser />
          &nbsp;&nbsp;1
        </span>
        <span>
          <EduButton isGhost height="30px">
            Replace
          </EduButton>
          <EduButton height="30px" onClick={handleAdd}>
            Add
          </EduButton>
        </span>
      </TableHeader>
      <StyledTable columns={columns} rowSelection={rowSelection} dataSource={dummyData} pagination={false} />
    </TableContainer>
  );
};

export default WorkTable;
