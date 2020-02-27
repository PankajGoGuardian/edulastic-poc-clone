import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { get, groupBy } from "lodash";
import {
  CanvasClassTable,
  Logo,
  Container,
  LogoWrapper,
  HeadingWrapper,
  ButtonContainer,
  Button,
  StyledModal,
  ClassNameWrapper
} from "./styled";
import selectsData from "../../../author/TestPage/components/common/selectsData";
import { getDictCurriculumsAction } from "../../../author/src/actions/dictionaries";
import { getFormattedCurriculumsSelector } from "../../../author/src/selectors/dictionaries";
import { receiveSearchCourseAction } from "../../../author/Courses/ducks";
import { getThumbnail } from "../../../author/ManageClass/components/ClassSectionThumbnailsBySubjectGrade";
import { bulkSyncCanvasClassAction } from "../../../student/Signup/duck";

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
  isBulkSyncingCanvas
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    getDictCurriculums();
    receiveSearchCourse({ districtId: user.districtId });
    getCanvasCourseListRequest();
  }, []);

  useEffect(() => {
    if (canvasCourseList.length) {
      const allCourseIds = canvasCourseList.map(c => c.id);
      getCanvasSectionListRequest(allCourseIds);
    }
  }, [canvasCourseList]);

  useEffect(() => {
    if (isBulkSyncingCanvas) setShowModal(true);
  }, [isBulkSyncingCanvas]);

  useEffect(() => {
    if (canvasCourseList.length && canvasSectionList.length) {
      const sectionsGroupedByCourseId = groupBy(canvasSectionList, "course_id");
      const allClasses = Object.keys(sectionsGroupedByCourseId).flatMap(courseId => {
        const sectionList = sectionsGroupedByCourseId[courseId];
        const course = canvasCourseList.find(c => +c.id === +courseId);
        const sectionClasses = sectionList.map(s => {
          const thumbnail = getThumbnail();
          return {
            districtId: user.districtId,
            grades: [],
            institutionId: user.institutionIds[0],
            name: s.name,
            owners: [user._id],
            parent: { id: user._id },
            standardSets: [],
            subject: "",
            thumbnail,
            type: "class",
            canvasCode: course.id,
            canvasCourseName: course.name,
            canvasCourseSectionCode: s.id,
            canvasCourseSectionName: s.name,
            students: s.students
          };
        });
        return sectionClasses;
      });
      setClasses(allClasses);
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
      _id: option.props.value,
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
      name: record.name
    })
  };

  const handleFinish = () => {
    const selectedClasses = classes.filter(c =>
      selectedRows.includes(`${c.canvasCode}_${c.canvasCourseSectionCode}`)
    );
    bulkSyncCanvasClass(selectedClasses);
    setShowModal(true);
  };

  const columns = [
    {
      title: <b>CANVAS CLASS SECTION</b>,
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <ClassNameWrapper>
          <p>{record.canvasCourseName}</p>
          <p>{record.canvasCourseSectionName}</p>
        </ClassNameWrapper>
      )
    },
    {
      title: <b>GRADE</b>,
      dataIndex: "grades",
      key: "grades",
      width: "400px",
      render: (_, row, index) => (
        <Select
          style={{ width: "100%" }}
          value={row.grades || []}
          mode="multiple"
          placeholder="Select Grades"
          onChange={val => handleChange(index, "grades", val)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
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
          value={row.subject || null}
          placeholder="Select Subject"
          onChange={val => {
            handleChange(ind, "subject", val);
          }}
          getPopupContainer={triggerNode => triggerNode.parentNode}
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
              option.props.children &&
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            mode="multiple"
            value={row.standardSets.map(s => s._id) || []}
            placeholder="Select Standards"
            onChange={(val, options) => {
              handleStandardsChange(ind, "standardSets", val, options);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {standardsList.map(standard => (
              <Select.Option
                value={standard.value}
                key={standard.value}
                disabled={standard.disabled}
              >
                {standard.text}
              </Select.Option>
            ))}
          </Select>
        );
      }
    }
  ];

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <HeadingWrapper>
        <p>Imported Classes from Canvas</p>
      </HeadingWrapper>
      <div>
        <p>
          Following classes are imported from your canvas account. Please select Course to create
          class in Edulastic.
        </p>
      </div>
      <CanvasClassTable
        rowKey={record => `${record.canvasCode}_${record.canvasCourseSectionCode}`}
        columns={columns}
        dataSource={classes}
        rowSelection={rowSelection}
        pagination={false}
        bordered
      />
      <ButtonContainer>
        <Button onClick={handleFinish}>Finish</Button>
      </ButtonContainer>
      {showModal && (
        <StyledModal
          visible={showModal}
          onCancel={() => setShowModal(false)}
          title={<h3>TITLE</h3>}
          footer={null}
          centered
          maskClosable={false}
        >
          <h4>Syncing with Canvas Course...</h4>
        </StyledModal>
      )}
    </Container>
  );
};

export default connect(
  state => ({
    state,
    courseList: get(state, "coursesReducer.searchResult"),
    isBulkSyncingCanvas: get(state, "signup.bulkSyncingCanvas", false)
  }),
  {
    getDictCurriculums: getDictCurriculumsAction,
    receiveSearchCourse: receiveSearchCourseAction,
    bulkSyncCanvasClass: bulkSyncCanvasClassAction
  }
)(CanvasBulkAddClass);
