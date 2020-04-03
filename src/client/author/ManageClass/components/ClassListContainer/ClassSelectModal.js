import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { themeColorLight } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
import { Select, Input, message } from "antd";
import selectsData from "../../../TestPage/components/common/selectsData";
import { StyledSelect, GoogleClassroomModal, GoogleClassroomTable, InstitutionSelectWrapper } from "./styled";
import { getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";

const ClassListModal = ({
  visible,
  close,
  groups,
  courseList,
  syncClass,
  selectedGroups,
  setShowBanner,
  syncClassLoading,
  updateGoogleCourseList,
  state,
  googleAllowedInstitutions
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedInstitution, setInstitution] = useState(undefined);
  // clear selected class while modal changes
  useEffect(() => {
    const selRows = [];
    groups.forEach((gr, index) => {
      if (!selectedGroups.includes(gr.enrollmentCode)) selRows.push(index);
    });
    setSelectedRows(selRows);
  }, [visible]);

  useEffect(() => {
    if (googleAllowedInstitutions.length === 1) setInstitution(googleAllowedInstitutions[0].institutionId);
  }, [googleAllowedInstitutions]);

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
      title: <b>{"GOOGLE CLASS CODE"}</b>,
      key: "enrollmentCode",
      width: "15%",
      dataIndex: "enrollmentCode",
      align: "left"
    },
    {
      title: <b>{"CLASS NAME"}</b>,
      key: "name",
      width: "15%",
      dataIndex: "name",
      align: "center",
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
      title: <b>{"GRADE"}</b>,
      key: "grades",
      width: "15%",
      dataIndex: "grades",
      align: "center",
      render: (_, row, ind) => (
        <StyledSelect
          disabled={selectedGroups.includes(row.enrollmentCode)}
          value={row.grades || []}
          mode="multiple"
          placeholder="Select Grades"
          onChange={val => handleChange(ind, "grades", val)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
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
      title: <b>{"SUBJECT"}</b>,
      key: "subject",
      width: "15%",
      dataIndex: "subject",
      align: "center",
      render: (_, row, ind) => (
        <StyledSelect
          style={{ minWidth: "80px" }}
          disabled={selectedGroups.includes(row.enrollmentCode)}
          value={row.subject || []}
          placeholder="Select Subject"
          onChange={val => {
            handleChange(ind, "standards", []);
            handleChange(ind, "standardSets", []);
            handleChange(ind, "subject", val);
          }}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {selectsData.allSubjects.map(allSubject => {
            return (
              allSubject.value && (
                <Select.Option value={allSubject.value} key={allSubject.value}>
                  {allSubject.text}
                </Select.Option>
              )
            );
          })}
        </StyledSelect>
      )
    },
    {
      title: <b>{"STANDARDS"}</b>,
      key: "standards",
      width: "20%",
      dataIndex: "standards",
      align: "center",
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
            placeholder="Select Standards"
            onChange={(val, options) => {
              handleStandardsChange(ind, "standards", val, options);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
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
      title: <b>{"COURSE"}</b>,
      key: "course",
      width: "20%",
      dataIndex: "course",
      align: "center",
      render: (_, row, ind) => (
        <StyledSelect
          showSearch
          filterOption={(input, option) =>
            option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          disabled={selectedGroups.includes(row.enrollmentCode)}
          value={row.courseId || []}
          placeholder="Select Course"
          onChange={(val, option) => {
            handleCourseChange(ind, option);
            handleChange(ind, "courseId", val);
          }}
          getPopupContainer={triggerNode => triggerNode.parentNode}
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
      if (!selectedInstitution) {
        return message.error("Please select an institution.");
      }
      syncClass({ classList: selected, institutionId: selectedInstitution });
      close();
      setShowBanner(true);
    } else {
      message.error("Please select a class to Sync.");
    }
  };

  return (
    <GoogleClassroomModal
      visible={visible}
      onCancel={close}
      onOk={addGroups}
      centered={true}
      title={
        <>
          <span>{"Import Classes and Students from Google"}</span>
          <p>The following classes will be imported from you Google Classroom account.</p>
          <p>
            Please enter/update class name, grade and subject to import and create classes in Edulastic. Once import is
            successful, Students accounts will be automatically created in Edulastic.{" "}
          </p>
          {googleAllowedInstitutions.length > 1 && (
            <>
              <InstitutionSelectWrapper>
                <label>
                  We found the account is linked to multiple Institutions. Please select the one for synced classes.
                </label>
                <StyledSelect
                  width="170px"
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Select Institution"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  value={selectedInstitution}
                  onChange={value => setInstitution(value)}
                >
                  {googleAllowedInstitutions.map(i => (
                    <Select.Option key={i.institutionId}>{i.institutionName}</Select.Option>
                  ))}
                </StyledSelect>
              </InstitutionSelectWrapper>
            </>
          )}
        </>
      }
      okText="IMPORT"
      cancelText="CANCEL"
      okButtonProps={{
        style: { "background-color": themeColorLight, "border-color": themeColorLight },
        loading: syncClassLoading,
        shape: "round"
      }}
      footer={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EduButton height="40px" isGhost onClick={close}>
            CANCEL
          </EduButton>
          <EduButton height="40px" onClick={addGroups} loading={syncClassLoading}>
            IMPORT
          </EduButton>
        </div>
      }
    >
      <GoogleClassroomTable
        style={{ width: "100%" }}
        columns={columns}
        dataSource={groups}
        bordered
        rowSelection={rowSelection}
        pagination={{ defaultPageSize: (groups && groups.length) || 10, hideOnSinglePage: true }}
      />
    </GoogleClassroomModal>
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
