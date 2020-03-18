import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal, Button, Radio, message } from "antd";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { isEmpty, uniqBy } from "lodash";

import { FlexContainer, EduButton } from "@edulastic/common";
import {
  lightGreySecondary,
  black,
  white,
  secondaryTextColor,
  titleColor,
  greyishBorder,
  themeColor
} from "@edulastic/colors";
import {
  fetchClassListAction,
  fetchStudentListAction,
  dropPlaylistAction,
  fetchPlaylistDroppedAccessList
} from "../../ducks";
import Selector from "./Selector";
import { StyledRadioGroup } from "./styled";

const getFooterComponent = ({ dropPlaylist }) => (
  <FlexContainer width="450px">
    <EduButton height="42px" data-cy="done-drop-playlist" onClick={dropPlaylist} inverse>
      DONE
    </EduButton>
  </FlexContainer>
);

const DroppedItem = ({ onDelete, item }) => (
  <FlexContainer justifyContent="space-between" height="28px">
    <FlexContainer style={{ textTransform: "uppercase" }}>
      {item.type === "class" ? (
        <IconWrapper fontSize="13" title="CLASS LEVEL ACCESS">
          <i className="fa fa-users" aria-hidden="true" />
        </IconWrapper>
      ) : (
        <IconWrapper fontSize="13" title="STUDENT LEVEL ACCESS">
          {" "}
          <i className="fa fa-user" aria-hidden="true" />
        </IconWrapper>
      )}
      <ItemName>{item.name}</ItemName>
    </FlexContainer>
    <ActionWrapper>
      <IconWrapper
        fontSize="16"
        data-cy={`remove-${item.name}`}
        onClick={() => onDelete(item)}
        title={item.type === "class" ? "REVOKE CLASS ACCESS" : "REVOKE STUDENT ACCESS"}
        show
      >
        <i className="fa fa-times" aria-hidden="true" />
      </IconWrapper>
    </ActionWrapper>
  </FlexContainer>
);

const DropPlaylistModal = props => {
  const {
    visible = false,
    closeModal,
    dropPlaylistSource: { classList = [], studentList = [] } = {},
    droppedAccessData,
    districtId,
    fetchClassListAction,
    fetchPlaylistDroppedAccessList,
    fetchStudentListAction,
    dropPlaylistAction,
    destinationCurriculumSequence: { _id: playlistId, title, description, grades, subjects } = {},
    classListFetching,
    studentListFetching
  } = props;

  const [mode, setMode] = useState("");
  const [searchBy, setSearchSource] = useState("byClass");
  const [addedStudent, setAddedStudent] = useState([]);
  const [removedStudent, setRemovedStudent] = useState([]);
  const [addedClass, setAddedClass] = useState([]);
  const [removedClass, setRemovedClass] = useState([]);
  const [prevAddedClasses, setPrevAddedClasses] = useState(droppedAccessData?.classList);
  const [prevAddedStudents, setPrevAddedStudents] = useState(droppedAccessData?.studentList);

  useEffect(() => {
    if (isEmpty(classList)) fetchClassListAction(districtId);
  }, []);

  useEffect(() => {
    if (visible) {
      fetchPlaylistDroppedAccessList({ districtId, playlistId });
    }
  }, [visible]);

  useEffect(() => {
    setPrevAddedClasses(
      droppedAccessData?.classList?.map(x => ({
        id: x?._id,
        name: x?.name,
        type: "class"
      }))
    );
    setPrevAddedStudents(
      droppedAccessData?.studentList?.map(x => ({
        id: x?._id,
        name: x?.name,
        classId: x?.groupId,
        type: "student"
      }))
    );
  }, [droppedAccessData]);

  useEffect(() => {
    if (mode === "edit") {
      if (searchBy === "byClass") {
        const classIds = addedClass?.map(x => x.id);
        setRemovedClass(prev => prev?.filter(x => !classIds?.includes(x)));
      } else {
        const studentIds = addedStudent?.map(x => x.id);
        setRemovedStudent(prev => prev?.filter(x => !studentIds?.includes(x)));
      }
    }
  }, [addedClass, addedStudent, mode]);

  const changeSearchSource = e => setSearchSource(e.target.value);

  const handleClassChange = (value, option) => {
    setMode("edit");
    const studentIds = value.flatMap(x => studentList?.filter(y => y?.classId === x?.key)?.map(z => z?.id));
    setAddedStudent(prev => prev.filter(x => !studentIds?.includes(x?.id)));
    setAddedClass(value.map(x => ({ id: x?.key, name: x?.label, type: "class" })));
  };

  const handleStudentChange = (value, option) => {
    setMode("edit");
    const studentClassMap = addedStudent.reduce((acc, student) => {
      if (student.type === "student") {
        acc[student.id] = student.classId;
      }
      return acc;
    }, {});
    setAddedStudent(
      value.map((x, i) => ({
        id: x?.key,
        name: x?.label,
        type: "student",
        classId: option[i]?.props?.classId || studentClassMap[(x?.key)]
      }))
    );
  };

  const onItemDelete = item => {
    setMode("delete");
    if (item?.type === "class") {
      setAddedClass(prev => prev.filter(x => x?.id !== item?.id));
      setRemovedClass(prev => prev.concat(item?.id));
      setPrevAddedClasses(prev => prev.filter(x => x?.id !== item?.id));
    } else {
      setAddedStudent(prev => prev.filter(x => x?.id !== item?.id));
      setRemovedStudent(prev => prev.concat(item?.id));
      setPrevAddedStudents(prev => prev.filter(x => x?.id !== item?.id));
    }
  };

  const filterClasses = () => {
    const classIds = addedStudent.flatMap(x => studentList?.filter(y => y?.id === x.id)?.map(z => z?.classId));
    return addedClass.filter(x => !classIds?.includes(x?.id));
  };

  const dropPlaylist = () => {
    const payload = {
      playlistId,
      title,
      description,
      grades,
      subjects,
      grantAccess: {
        classList: uniqBy([...prevAddedClasses, ...filterClasses()], "id"),
        studentList: uniqBy([...prevAddedStudents, ...addedStudent], "id")
      },
      revokeAccess: {
        classList: removedClass,
        studentList: removedStudent
      }
    };
    if (dropPlaylistAction(payload)) {
      message.success("Playlist dropped successfully");
      closeModal();
    }
  };

  const fetchStudents = ({ key }) => {
    if (!studentList.some(x => x.classId === key)) {
      fetchStudentListAction({ districtId, classId: key });
    }
  };

  const filterNewlyAddedClass = () => {
    const addedClassIds = prevAddedClasses.map(x => x?.id);
    return addedClass.filter(c => !addedClassIds.includes(c.id)).map(x => ({ key: x.id, label: x.name }));
  };

  const filterNewlyAddedStudents = () => {
    const addedStudentIds = prevAddedStudents.map(x => x?.id);
    return addedStudent.filter(c => !addedStudentIds.includes(c.id)).map(x => ({ key: x.id, label: x.name }));
  };

  const addedData = uniqBy([...prevAddedClasses, ...filterClasses(), ...prevAddedStudents, ...addedStudent], "id");
  const addedClassIds = [...prevAddedClasses, ...filterClasses()].map(x => x?.id);
  const addedStudentIds = [...prevAddedStudents, ...addedStudent].map(x => x?.id);

  const filterStudents = () => {
    const ids = addedClass.map(x => x?.id);
    return studentList.filter(x => ids.includes(x?.classId) && !addedStudentIds.includes(x?.id));
  };

  return (
    <StyledPurchaseLicenseModal
      visible={visible}
      title={<h3 style={{ fontWeight: 700 }}>DropPlaylist</h3>}
      onCancel={closeModal}
      footer={[getFooterComponent({ dropPlaylist })]}
      centered
    >
      <>
        <p style={{ marginBottom: "21px" }}>
          Dropping a playlist will let other teachers/students see the playlist and follow along.
        </p>
        <Selector
          onChange={handleClassChange}
          onSelect={fetchStudents}
          value={filterNewlyAddedClass()}
          options={classList.filter(x => !addedClassIds.includes(x?.id))}
          isLoading={classListFetching}
          label="CLASS"
          dataCy="selectClass"
        />
        <StyledRadioGroup
          onChange={changeSearchSource}
          value={searchBy}
          style={{ marginBottom: "32px", fontSize: "12px" }}
        >
          <Radio value="byClass">BY CLASS</Radio>
          <Radio value="byStudent">SPECIFIC STUDENT</Radio>
        </StyledRadioGroup>
        {searchBy !== "byClass" && (
          <Selector
            onChange={handleStudentChange}
            value={filterNewlyAddedStudents()}
            options={filterStudents()}
            isLoading={studentListFetching}
            label="STUDENT"
            dataCy="selectStudent"
          />
        )}
        <Title>WHO HAS DROP ACCESS</Title>
        <DroppedList>
          {addedData.map(x => (
            <DroppedItem key={x.id} onDelete={onItemDelete} item={x} />
          ))}
        </DroppedList>
      </>
    </StyledPurchaseLicenseModal>
  );
};

export default connect(
  state => ({
    districtId: state?.user?.user?.districtId,
    dropPlaylistSource: state?.curriculumSequence?.dropPlaylistSource?.searchSource,
    droppedAccessData: state?.curriculumSequence?.dropPlaylistSource?.droppedAccess,
    destinationCurriculumSequence: state?.curriculumSequence?.destinationCurriculumSequence,
    classListFetching: state?.curriculumSequence?.classListFetching,
    studentListFetching: state?.curriculumSequence?.studentListFetching
  }),
  {
    fetchClassListAction,
    fetchStudentListAction,
    dropPlaylistAction,
    fetchPlaylistDroppedAccessList
  }
)(DropPlaylistModal);

const StyledPurchaseLicenseModal = styled(Modal)`
  width: 560px !important;
  height: 580px;

  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer,
  .ant-modal-content {
    background: ${white};
    border: none;
    box-shadow: unset;
    color: ${titleColor};
  }

  .ant-modal-header {
    padding: 25px 30px;
  }

  .ant-modal-body {
    background: ${white};
    width: calc(100% - 60px);
    margin: auto;
    padding: 2px;
    font-size: 14px;
  }

  .ant-modal-footer {
    width: fit-content;
    margin: 6px auto;
    padding: 22px 10px;
  }

  .ant-modal-close-x {
    right: 100px;
  }

  svg {
    transform: scale(1.3);
    fill: ${black};
    top: 30px;
    right: 30px;
  }

  .ant-modal-close-icon {
    display: block;
    margin-right: 30px;
    margin-top: 25px;
    transform: scale(1.2);
  }

  .ant-select-arrow {
    top: 20px;
  }
  .ant-select-dropdown {
    min-height: 40px;
    .ant-select-selection--multiple .ant-select-arrow {
      top: 20px;
    }
    .anticon,
    .anticon-check {
      display: none;
    }
  }
`;

const Title = styled.h5`
  color: ${secondaryTextColor};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const ThemeButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${({ inverse }) => (inverse ? themeColor : "transparent")};
  border-color: ${themeColor};
  color: ${({ inverse }) => (inverse ? white : themeColor)};
  width: ${({ width }) => width || "200px"};
  height: 40px;
  padding: 8px;
  font-size: 11px;
  font-weight: 600;

  &:focus {
    color: ${({ inverse }) => (inverse ? white : themeColor)};
    background: ${({ inverse }) => (inverse ? themeColor : white)};
  }

  &:hover {
    color: ${white};
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;

const DroppedList = styled(PerfectScrollbar)`
  width: 100%;
  height: 200px;
  overflow: auto;
  background: ${lightGreySecondary};
  border: 1px solid ${greyishBorder};
  margin: auto;
  padding: 10px;
`;

const ItemName = styled.div`
  color: #444;
  font-weight: 600;
  font-size: 10px;
`;

const ActionWrapper = styled.div`
  margin: 8px;
  display: flex;
`;

const IconWrapper = styled.div`
  margin: 2px 10px;
  cursor: ${({ show }) => show && "pointer"};

  i {
    color: ${({ show }) => (show ? themeColor : greyishBorder)};
    font-size: ${({ fontSize }) => fontSize}px;
  }
`;
