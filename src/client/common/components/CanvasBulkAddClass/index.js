import { OnWhiteBgLogo, notification } from "@edulastic/common";
import { IconCanvasBook } from "@edulastic/icons";
import { Select } from "antd";
import { get, groupBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { receiveSearchCourseAction } from "../../../author/Courses/ducks";
import { getThumbnail } from "../../../author/ManageClass/components/ClassSectionThumbnailsBySubjectGrade";
import { getDictCurriculumsAction } from "../../../author/src/actions/dictionaries";
import { getFormattedCurriculumsSelector } from "../../../author/src/selectors/dictionaries";
import selectsData from "../../../author/TestPage/components/common/selectsData";
import { setSignUpStatusAction, signupSuccessAction } from "../../../student/Login/ducks";
import { bulkSyncCanvasClassAction, joinSchoolFailedAction } from "../../../student/Signup/duck";
import { getCanvasAllowedInstitutionPoliciesSelector } from "../../../author/src/selectors/user";
import { StyledSelect } from "../../../author/ManageClass/components/ClassListContainer/styled";
import {
  Button,
  ButtonContainer,
  CanvasClassTable,
  ClassNameWrapper,
  Container,
  HeadingWrapper,
  LogoWrapper,
  StyledModal
} from "./styled";

const CanvasBulkAddClass = ({
  receiveSearchCourse,
  getDictCurriculums,
  state,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  user,
  bulkSyncCanvasClass,
  bulkSyncCanvasStatus,
  courseList,
  isFetchingCanvasData,
  signupSuccess,
  institutionId,
  setSignUpStatus,
  joinSchoolFailed,
  fromManageClass,
  canvasAllowedInstitutions,
  onCancel = () => {}
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [institution, setInstitution] = useState();

  useEffect(() => {
    getDictCurriculums();
    receiveSearchCourse({ districtId: user?.districtIds?.[0] });
    if (!fromManageClass) {
      setInstitution(institutionId);
    } else {
      setInstitution(canvasAllowedInstitutions[0].institutionId);
    }
  }, []);

  useEffect(() => {
    if (institution) {
      getCanvasCourseListRequest(institution);
    }
  }, [institution]);

  useEffect(() => {
    if (canvasCourseList.length) {
      const allCourseIds = canvasCourseList.map(c => c.id);
      getCanvasSectionListRequest({ allCourseIds, institution });
    }
  }, [canvasCourseList]);

  useEffect(() => {
    if (bulkSyncCanvasStatus === "INPROGRESS") setShowModal(true);
    else if (bulkSyncCanvasStatus === "FAILED") setShowModal(false);
  }, [bulkSyncCanvasStatus]);

  useEffect(() => {
    if (canvasCourseList.length && canvasSectionList.length) {
      setIsLoading(true);
      const sectionsGroupedByCourseId = groupBy(canvasSectionList, "course_id");
      const allClasses = Object.keys(sectionsGroupedByCourseId).flatMap(courseId => {
        const sectionList = sectionsGroupedByCourseId[courseId];
        const course = canvasCourseList.find(c => +c.id === +courseId);
        const sectionClasses = sectionList.map(s => {
          const thumbnail = getThumbnail();
          return {
            districtId: user?.districtIds?.[0],
            grades: [],
            institutionId: institution,
            name: s.name,
            owners: [user._id],
            parent: { id: user._id },
            standardSets: [],
            subject: "",
            courseId: "",
            thumbnail,
            type: "class",
            canvasCode: course.id,
            canvasCourseName: course.name,
            canvasCourseSectionCode: s.id,
            canvasCourseSectionName: s.name,
            ...(s.alreadySynced ? { alreadySynced: true } : {})
          };
        });
        return sectionClasses;
      });
      setClasses(allClasses);

      // setting all the table rows as checked by default
      const allClassKeys = allClasses
        .filter(c => !c.alreadySynced)
        .map(c => `${c.canvasCode}_${c.canvasCourseSectionCode}`);
      setSelectedRows(allClassKeys);

      setIsLoading(false);
    }
  }, [canvasCourseList, canvasSectionList]);

  const handleChange = (index, key, value) => {
    const updatedclasses = classes.map((clazz, i) => {
      if (i === index) {
        return {
          ...clazz,
          [key]: value,
          ...(key === "subject" ? { standardSets: [] } : {})
        };
      }
      return clazz;
    });
    setClasses(updatedclasses);
  };

  const handleStandardsChange = (index, key, value, options) => {
    const standardSets = options.map(option => ({
      id: option.props.value,
      name: option.props.children
    }));
    handleChange(index, "standardSets", standardSets);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: rows => {
      setSelectedRows(rows);
    },
    getCheckboxProps: record => ({
      name: record.name,
      disabled: !!record.alreadySynced
    })
  };

  const handleFinish = () => {
    if (!selectedRows.length) {
      notification({ messageKey: "pleaseSelectAtleastOneCanvasCourseSectionToSync" });
      return;
    }
    let selectedClasses = classes.filter(c => selectedRows.includes(`${c.canvasCode}_${c.canvasCourseSectionCode}`));

    // setting default grades as Other (O) if grade is not selected by the user.
    selectedClasses = selectedClasses.map(c => ({ ...c, grades: c.grades.length > 0 ? c.grades : ["O"] }));

    bulkSyncCanvasClass({ bulkSyncData: selectedClasses });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    if (fromManageClass) {
      return onCancel();
    }
    const { currentSignUpState, ...rest } = user;
    signupSuccess(rest);
  };

  const handleGoBack = () => {
    setSignUpStatus(1);
    joinSchoolFailed({});
  };

  const activeCourseList = useMemo(() => courseList.filter(c => +c.active === 1), [courseList]);

  const columns = [
    {
      title: <b>CANVAS CLASS SECTION</b>,
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <ClassNameWrapper>
          <p>{`Course: ${record.canvasCourseName}`}</p>
          <p>{`Section: ${record.canvasCourseSectionName}`}</p>
        </ClassNameWrapper>
      )
    },
    {
      title: <b>GRADE</b>,
      dataIndex: "grades",
      width: "250px",
      key: "grades",
      render: (_, row, index) => (
        <Select
          style={{ width: "100%" }}
          value={row.grades || []}
          mode="multiple"
          placeholder="Select Grades"
          onChange={val => handleChange(index, "grades", val)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          disabled={!!row.alreadySynced}
        >
          {selectsData.allGrades.map(allGrade => (
            <Select.Option value={allGrade.value} key={allGrade.value}>
              {allGrade.text}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: <b>SUBJECT</b>,
      key: "subject",
      width: "15%",
      dataIndex: "subject",
      align: "center",
      render: (_, row, ind) => (
        <Select
          style={{ width: "100%" }}
          value={row.subject || undefined}
          placeholder="Select Subject"
          onChange={val => {
            handleChange(ind, "subject", val);
          }}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          disabled={!!row.alreadySynced}
        >
          {selectsData.allSubjects.map(
            allSubject =>
              allSubject.value && (
                <Select.Option value={allSubject.value} key={allSubject.value}>
                  {allSubject.text}
                </Select.Option>
              )
          )}
        </Select>
      )
    },
    {
      title: <b>STANDARDS</b>,
      key: "standardSets",
      width: "20%",
      dataIndex: "standardSets",
      align: "center",
      render: (_, row, ind) => {
        const standardsList = getFormattedCurriculumsSelector(state, { subject: row.subject });
        return (
          <Select
            showSearch
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            mode="multiple"
            value={row.standardSets.map(s => s.id) || []}
            placeholder="Select Standards"
            onChange={(val, options) => {
              handleStandardsChange(ind, "standardSets", val, options);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            disabled={!!row.alreadySynced}
          >
            {standardsList.map(standard => (
              <Select.Option value={standard.value} key={standard.value} disabled={standard.disabled}>
                {standard.text}
              </Select.Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: <b>COURSE</b>,
      key: "course",
      width: "20%",
      dataIndex: "course",
      align: "center",
      render: (_, row, ind) => (
        <Select
          showSearch
          filterOption={(input, option) =>
            option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: "100%" }}
          value={row.courseId || undefined}
          placeholder="Select Course"
          onChange={val => handleChange(ind, "courseId", val)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          disabled={!!row.alreadySynced}
        >
          {activeCourseList &&
            activeCourseList.map(course => (
              <Select.Option value={course._id} key={course._id}>
                {course.name}institution
              </Select.Option>
            ))}
        </Select>
      )
    }
  ];

  return (
    <Container fromManageClass={fromManageClass}>
      <LogoWrapper>
        <OnWhiteBgLogo />
      </LogoWrapper>
      <LogoWrapper>
        <IconCanvasBook height="75px" width="75px" />
      </LogoWrapper>
      <HeadingWrapper>
        <p>Imported Classes from Canvas</p>
      </HeadingWrapper>
      <div>
        <p>
          Following classes are imported from your canvas account. Please select Course to create class in Edulastic.
        </p>
      </div>
      {canvasAllowedInstitutions.length > 1 && (
        <div>
          <label>
            We found the account is linked to multiple Institutions. Please select the one for synced
            classes.&nbsp;&nbsp;
          </label>
          <StyledSelect
            width="170px"
            showSearch
            filterOption={(input, option) =>
              option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="Select Institution"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            value={institution}
            onChange={value => setInstitution(value)}
          >
            {canvasAllowedInstitutions.map(i => (
              <Select.Option key={i.institutionId}>{i.institutionName}</Select.Option>
            ))}
          </StyledSelect>
        </div>
      )}
      <CanvasClassTable
        rowKey={record => `${record.canvasCode}_${record.canvasCourseSectionCode}`}
        columns={columns}
        dataSource={classes}
        rowSelection={rowSelection}
        pagination={false}
        bordered
        loading={isFetchingCanvasData || isLoading}
      />
      <ButtonContainer justifyContent="space-around">
        {fromManageClass ? (
          <Button onClick={handleFinish}>Sync</Button>
        ) : (
          <>
            <Button onClick={handleGoBack} back>
              Back
            </Button>
            <Button onClick={handleFinish}>Finish</Button>
          </>
        )}
      </ButtonContainer>
      {showModal && (
        <StyledModal
          title={bulkSyncCanvasStatus === "SUCCESS" ? <h4>Success</h4> : null}
          visible={showModal}
          footer={bulkSyncCanvasStatus === "SUCCESS" ? [<Button onClick={handleClose}>Close</Button>] : null}
          centered
          maskClosable={false}
        >
          <h4>
            {bulkSyncCanvasStatus === "INPROGRESS"
              ? "Syncing with Canvas Course..."
              : "Class successfully synced with Canvas Course."}
          </h4>
        </StyledModal>
      )}
    </Container>
  );
};

export default connect(
  state => ({
    state,
    courseList: get(state, "coursesReducer.searchResult"),
    bulkSyncCanvasStatus: get(state, "signup.bulkSyncCanvasStatus", false),
    isFetchingCanvasData: get(state, "manageClass.isFetchingCanvasData", false),
    canvasAllowedInstitutions: getCanvasAllowedInstitutionPoliciesSelector(state)
  }),
  {
    getDictCurriculums: getDictCurriculumsAction,
    receiveSearchCourse: receiveSearchCourseAction,
    bulkSyncCanvasClass: bulkSyncCanvasClassAction,
    signupSuccess: signupSuccessAction,
    setSignUpStatus: setSignUpStatusAction,
    joinSchoolFailed: joinSchoolFailedAction
  }
)(CanvasBulkAddClass);
