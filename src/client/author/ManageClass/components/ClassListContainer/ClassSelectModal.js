import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Select, Input, message } from "antd";
import selectsData from "../../../TestPage/components/common/selectsData";
import { StyledSelect } from "./styled";
import { getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import { themeColorLight } from "@edulastic/colors";

const ClassListModal = ({
  visible,
  close,
  groups,
  courseList,
  syncClass,
  selectedGroups,
  syncClassLoading,
  updateGoogleCourseList,
  state
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  // clear selected class while modal changes
  useEffect(() => {
    const selRows = [];
    groups.forEach((gr, index) => {
      if (!selectedGroups.includes(gr.enrollmentCode)) selRows.push(index);
    });
    setSelectedRows(selRows);
  }, [visible]);

  const handleStandardsChange = (index, key, value, options) => {
    let standardSets = options.map(option => {
      return { _id: option.props.value, name: option.props.children };
    });
    handleChange(index, "standardSets", standardSets);
    handleChange(index, key, value);
  };

  const handleCourseChange = (index, option) => {
    let course = { id: option.props.value, name: option.props.children };
    handleChange(index, "course", course);
  };

  // add keys to  each group. antd table selection works based on keys.
  groups = groups.map((group, index) => ({ ...group, key: index }));

  // for antd row selection
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: rows => {
      setSelectedRows(rows);
    },
    getCheckboxProps: record => ({
      // eslint-disable-next-line max-len
      disabled: selectedGroups.includes(record.enrollmentCode), // Column configuration not to be checked
      name: record.name
    })
  };

  const handleChange = (index, key, value) => {
    updateGoogleCourseList({ index, key, value });
  };

  const columns = [
    {
      title: "Class Code",
      key: "enrollmentCode",
      width: "5%",
      dataIndex: "enrollmentCode"
    },
    {
      title: "Class Name",
      key: "name",
      width: "20%",
      dataIndex: "name",
      render: (name, row, ind) => (
        <Input
          style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: "100%" }}
          title={name}
          value={name}
          disabled={selectedGroups.includes(row.enrollmentCode)}
          onChange={e => handleChange(ind, "name", e.target.value)}
        />
      )
    },
    {
      title: "Grade",
      key: "grades",
      width: "15%",
      dataIndex: "grades",
      render: (_, row, ind) => (
        <StyledSelect
          disabled={selectedGroups.includes(row.enrollmentCode)}
          value={row.grades || []}
          mode="multiple"
          placeholder="Please select any grade"
          onChange={val => handleChange(ind, "grades", val)}
        >
          {selectsData.allGrades.map(allGrade => {
            return (
              <Select.Option value={allGrade.value} key={allGrade.value}>
                {allGrade.text}
              </Select.Option>
            );
          })}
        </StyledSelect>
      )
    },
    {
      title: "Subject",
      key: "subject",
      width: "15%",
      dataIndex: "subject",
      render: (_, row, ind) => (
        <StyledSelect
          disabled={selectedGroups.includes(row.enrollmentCode)}
          value={row.subject || ""}
          placeholder="Please select any subject"
          onChange={val => {
            handleChange(ind, "standards", []);
            handleChange(ind, "standardSets", []);
            handleChange(ind, "subject", val);
          }}
        >
          {selectsData.allSubjects.map(allSubject => {
            return (
              <Select.Option value={allSubject.value} key={allSubject.value}>
                {allSubject.text}
              </Select.Option>
            );
          })}
        </StyledSelect>
      )
    },
    {
      title: "Standards",
      key: "standards",
      width: "30%",
      dataIndex: "standards",
      render: (_, row, ind) => {
        const standardsList = getFormattedCurriculumsSelector(state, { subject: row.subject });
        return (
          <StyledSelect
            showSearch
            filterOption={(input, option) =>
              option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={selectedGroups.includes(row.enrollmentCode)}
            mode="multiple"
            value={row.standards || []}
            placeholder="Please select any Standard"
            onChange={(val, options) => {
              handleStandardsChange(ind, "standards", val, options);
            }}
          >
            {standardsList.map(standard => {
              return (
                <Select.Option value={standard.value} key={standard.value} disabled={standard.disabled}>
                  {standard.text}
                </Select.Option>
              );
            })}
          </StyledSelect>
        );
      }
    },
    {
      title: "Course",
      key: "course",
      width: "15%",
      dataIndex: "course",
      render: (_, row, ind) => (
        <StyledSelect
          showSearch
          filterOption={(input, option) =>
            option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          disabled={selectedGroups.includes(row.enrollmentCode)}
          value={row.courseId || []}
          placeholder="Please select any Course"
          onChange={(val, option) => {
            handleCourseChange(ind, option);
            handleChange(ind, "courseId", val);
          }}
        >
          {courseList &&
            courseList.map(course => {
              return (
                <Select.Option value={course._id} key={course._id}>
                  {course.name}
                </Select.Option>
              );
            })}
        </StyledSelect>
      )
    }
  ];

  const addGroups = () => {
    // eslint-disable-next-line max-len
    const selected = groups.filter((_, index) => selectedRows.includes(index));

    if (selected && selected.length) {
      syncClass(selected);
    } else {
      message.error("Please select a class to Sync.");
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={close}
      onOk={addGroups}
      width={"70vw"}
      okText="Sync"
      okButtonProps={{
        style: { "background-color": themeColorLight, "border-color": themeColorLight },
        loading: syncClassLoading,
        shape: "round"
      }}
      cancelButtonProps={{ style: { "border-color": themeColorLight }, shape: "round" }}
    >
      <Table
        columns={columns}
        dataSource={groups}
        bordered
        rowSelection={rowSelection}
        pagination={(groups && groups.length > 10) || false}
      />
    </Modal>
  );
};

ClassListModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  selectedGroups: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  syncClassLoading: PropTypes.bool,
  updateGoogleCourseList: PropTypes.func,
  close: PropTypes.func.isRequired,
  syncClass: PropTypes.func.isRequired
};
export default ClassListModal;
