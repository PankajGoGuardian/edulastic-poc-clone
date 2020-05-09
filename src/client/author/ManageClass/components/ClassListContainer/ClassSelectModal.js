import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { capitalize } from "lodash";

// components
import { Spin, Select, Input, message } from "antd";
import { EduButton } from "@edulastic/common";
import { IconClever, IconClose } from "@edulastic/icons";
import { StyledSelect, ClassListModal, ModalClassListTable, InstitutionSelectWrapper } from "./styled";

// constants
import selectsData from "../../../TestPage/components/common/selectsData";
const { allGrades, allSubjects } = selectsData;

const ClassSelectModal = ({
  type,
  visible,
  onSubmit,
  onCancel,
  loading,
  syncedIds = [],
  classListToSync,
  courseList,
  getStandardsListBySubject,
  refreshPage,
  allowedInstitutions
}) => {
  const [classListData, setClassListData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [institutionId, setInstitutionId] = useState("");

  // set classListData
  useEffect(() => {
    if (type === "clever") {
      setClassListData(
        classListToSync.map(c => ({
          name: c.name,
          cleverId: c.id,
          // course: "",
          // subject: "",
          grades: [],
          standards: [],
          standardSets: [],
          disabled: syncedIds.includes(c.id)
        }))
      );
    }
    if (type === "googleClassroom") {
      setClassListData(
        classListToSync.map(c => ({
          ...c,
          disabled: syncedIds.includes(c.enrollmentCode)
        }))
      );
    }
  }, [classListToSync]);

  useEffect(() => {
    if (allowedInstitutions?.length === 1) {
      setInstitutionId(allowedInstitutions[0].institutionId);
    }
  }, [allowedInstitutions]);

  const handleClassListSync = () => {
    const classList = classListData.filter((_, index) => selectedRows.includes(index));
    if (!classList?.length) {
      message.error("Please select a class to sync.");
    } else if (type === "googleClassroom" && !institutionId) {
      return message.error("Please select an institution.");
    } else {
      onSubmit({ classList, institutionId, refreshPage });
      onCancel();
    }
  };

  const getColumns = () => {
    const width = type === "googleClassroom" ? "15%" : "20%";
    const googleCode =
      type === "googleClassroom"
        ? [
            {
              title: <b>GOOGLE CLASS CODE</b>,
              key: "enrollmentCode",
              width,
              dataIndex: "enrollmentCode",
              align: "left"
            }
          ]
        : [];

    return [
      ...googleCode,
      {
        title: <b>CLASS NAME</b>,
        key: "name",
        width,
        dataIndex: "name",
        align: "center",
        render: (data, row, index) => (
          <Input
            title={data}
            value={data}
            disabled={row.disabled}
            onChange={e => {
              const classList = [...classListData];
              classList[index].name = e.target.value;
              setClassListData(classList);
            }}
          />
        )
      },
      {
        title: <b>GRADE</b>,
        key: "grades",
        width,
        dataIndex: "grades",
        align: "center",
        render: (data, row, index) => (
          <StyledSelect
            value={data}
            mode="multiple"
            placeholder="Select Grades"
            disabled={row.disabled}
            onChange={grades => {
              const classList = [...classListData];
              classList[index].grades = grades;
              setClassListData(classList);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {allGrades.map(grade => (
              <Select.Option value={grade.value} key={grade.value}>
                {grade.text}
              </Select.Option>
            ))}
          </StyledSelect>
        )
      },
      {
        title: <b>SUBJECT</b>,
        key: "subject",
        width,
        dataIndex: "subject",
        align: "center",
        render: (data, row, index) => (
          <StyledSelect
            style={{ minWidth: "80px" }}
            value={data}
            placeholder="Select Subject"
            disabled={row.disabled}
            onChange={subject => {
              const classList = [...classListData];
              classList[index].subject = capitalize(subject);
              classList[index].standards = [];
              classList[index].standardSets = [];
              setClassListData(classList);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {allSubjects.map(
              subject =>
                subject.value && (
                  <Select.Option value={subject.value} key={subject.value}>
                    {subject.text}
                  </Select.Option>
                )
            )}
          </StyledSelect>
        )
      },
      {
        title: <b>STANDARDS</b>,
        key: "standards",
        width,
        dataIndex: "standards",
        align: "center",
        render: (data, row, index) => {
          const standardsList = getStandardsListBySubject(row.subject);
          return (
            <StyledSelect
              showSearch
              filterOption={(input, option) =>
                option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              mode="multiple"
              value={data}
              placeholder="Select Standards"
              disabled={row.disabled}
              onChange={standards => {
                const classList = [...classListData];
                classList[index].standards = standards;
                classList[index].standardsList = standardsList
                  .filter(s => standards.includes(s.value))
                  .map(({ value, text }) => ({ _id: value, name: text }));
                setClassListData(classList);
              }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {standardsList.map(({ value, text, disabled }) => (
                <Select.Option value={value} key={value} disabled={disabled}>
                  {!value.toString().includes("-") ? (
                    text
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        borderRadius: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.65)"
                      }}
                    />
                  )}
                </Select.Option>
              ))}
            </StyledSelect>
          );
        }
      },
      {
        title: <b>COURSE</b>,
        key: "course",
        width,
        dataIndex: "courseId",
        align: "center",
        render: (data, row, index) => (
          <StyledSelect
            showSearch
            labelInValue
            filterOption={(input, option) =>
              option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={(data && { key: data }) || {}}
            placeholder="Select Course"
            disabled={row.disabled}
            onChange={course => {
              const classList = [...classListData];
              classList[index].courseId = course.key;
              if (type === "clever") {
                classList[index].course = course.key;
              } else if (type === "googleClassroom") {
                classList[index].course = { id: course.key, name: course.label };
              }
              setClassListData(classList);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {(courseList || []).map(course => (
              <Select.Option value={course._id} key={course._id}>
                {course.name}
              </Select.Option>
            ))}
          </StyledSelect>
        )
      }
    ];
  };

  const InstitutionSelection = () => (
    <InstitutionSelectWrapper>
      <label>We found the account is linked to multiple Institutions. Please select the one for synced classes.</label>
      <StyledSelect
        width="170px"
        showSearch
        filterOption={(input, option) =>
          option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        placeholder="Select Institution"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        value={institutionId}
        onChange={value => setInstitutionId(value)}
      >
        {allowedInstitutions.map(i => (
          <Select.Option key={i.institutionId}>{i.institutionName}</Select.Option>
        ))}
      </StyledSelect>
    </InstitutionSelectWrapper>
  );

  return (
    <ClassListModal
      visible={visible}
      onCancel={onCancel}
      centered
      title={
        <>
          <div>
            {type === "clever" && <IconClever height={20} width={20} style={{ position: "absolute", left: "20px" }} />}
            <span>Import Classes and Students from {type === "clever" ? "Clever" : "Google"}</span>
            <IconClose height={20} width={20} onClick={onCancel} style={{ cursor: "pointer" }} />
          </div>
          <p>
            The following classes will be imported from you {type === "clever" ? "Clever" : "Google Classroom"} account.
          </p>
          <p>
            Please enter/update class name, grade and subject to import and create classes in Edulastic. Once import is
            successful, Students accounts will be automatically created in Edulastic.
          </p>
          {type === "googleClassroom" && allowedInstitutions.length > 1 && <InstitutionSelection />}
        </>
      }
      footer={[
        <EduButton isGhost onClick={onCancel}>
          CANCEL
        </EduButton>,
        <EduButton onClick={handleClassListSync} loading={loading}>
          IMPORT
        </EduButton>
      ]}
      centered
    >
      {loading ? (
        <Spin />
      ) : (
        <ModalClassListTable
          columns={getColumns()}
          dataSource={classListData}
          bordered
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: setSelectedRows,
            getCheckboxProps: row => ({ disabled: row.disabled, name: row.name })
          }}
          pagination={{ defaultPageSize: classListData?.length || 10, hideOnSinglePage: true }}
        />
      )}
    </ClassListModal>
  );
};

ClassSelectModal.propTypes = {
  type: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  syncedIds: PropTypes.array.isRequired,
  classListToSync: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
export default ClassSelectModal;
