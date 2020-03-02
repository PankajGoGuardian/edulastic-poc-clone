import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal, Button, Radio, Select, message, Spin } from "antd";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { isEmpty } from "lodash";

import { FlexContainer } from "@edulastic/common";
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

const getFooterComponent = ({ dropPlaylist }) => (
  <FlexContainer width="450px">
    <ThemeButton onClick={dropPlaylist} inverse>
      DONE
    </ThemeButton>
  </FlexContainer>
);

const DroppedItem = ({ onDelete, item }) => (
  <FlexContainer justifyContent="space-between" height="28px">
    <ItemName>{item.name}</ItemName>
    <ActionWrapper>
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
      <IconWrapper
        fontSize="16"
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
    destinationCurriculumSequence: { _id: playlistId, title, description } = {},
    classListFetching,
    studentListFetching
  } = props;

  const [mode, setMode] = useState("");
  const [searchBy, setSearchSource] = useState("byClass");
  const [addedStudent, setAddedStudent] = useState([]);
  const [removedStudent, setRemovedStudent] = useState([]);
  const [addedClass, setAddedClass] = useState([]);
  const [removedClass, setRemovedClass] = useState([]);

  useEffect(() => {
    if (isEmpty(classList)) fetchClassListAction(districtId);
  }, []);

  useEffect(() => {
    if (visible) {
      fetchPlaylistDroppedAccessList({ districtId, playlistId });
    }
  }, [visible]);

  useEffect(() => {
    setAddedClass(
      droppedAccessData?.classList?.map(x => ({
        id: x?._id,
        name: x?.name,
        type: "class"
      }))
    );

    setAddedStudent(
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

  const handleSearchChange = (value, option) => {
    setMode("edit");
    if (searchBy === "byClass") {
      const studentIds = value.flatMap(x => studentList?.filter(y => y?.classId === x?.key)?.map(z => z?.id));
      setAddedStudent(prev => prev.filter(x => !studentIds?.includes(x?.id)));
      setAddedClass(value.map(x => ({ id: x?.key, name: x?.label, type: "class" })));
    } else {
      const classIds = value.flatMap(x => studentList?.filter(y => y?.id === x.key)?.map(z => z?.classId));
      setAddedClass(prev => prev.filter(x => !classIds?.includes(x?.id)));
      setAddedStudent(
        value.map((x, i) => ({ id: x?.key, name: x?.label, type: "student", classId: option[i]?.props?.classId }))
      );
    }
  };

  const onItemDelete = item => {
    setMode("delete");
    if (item?.type === "class") {
      setAddedClass(prev => prev.filter(x => x?.id !== item?.id));
      setRemovedClass(prev => prev.concat(item?.id));
    } else {
      setAddedStudent(prev => prev.filter(x => x?.id !== item?.id));
      setRemovedStudent(prev => prev.concat(item?.id));
    }
  };

  const dropPlaylist = () => {
    const payload = {
      playlistId,
      title,
      description,
      grantAccess: {
        classList: addedClass,
        studentList: addedStudent
      },
      revokeAccess: {
        classList: removedClass,
        studentList: removedStudent
      }
    };
    if (dropPlaylistAction(payload)) {
      message.success("DropPlaylist Successful");
      closeModal();
    }
  };

  const fetchStudents = ({ key }) => {
    if (searchBy === "byClass" && !studentList.some(x => x.classId === key)) {
      fetchStudentListAction({ districtId, classId: key });
    }
  };

  const addedSource = searchBy === "byClass" ? addedClass : addedStudent;
  const source = searchBy === "byClass" ? classList : studentList;
  const addedData = [...addedClass, ...addedStudent];
  const isLoading = searchBy === "byClass" ? classListFetching : studentListFetching;

  return (
    <StyledPurchaseLicenseModal
      visible={visible}
      title={<h3 style={{ fontWeight: 700 }}>DropPlaylist</h3>}
      onCancel={closeModal}
      footer={[getFooterComponent({ dropPlaylist })]}
      centered
    >
      <>
        <p>Dropping a playlist will let other teachers/students see the playlist and follow along.</p>

        <br />
        <Title>CLASS/STUDENT</Title>
        <Select
          placeholder={searchBy === "byClass" ? "SEARCH BY CLASS NAME" : "SEARCH BY STUDENT NAME"}
          style={{ width: "100%" }}
          mode="multiple"
          value={addedSource.map(x => ({ key: x.id, label: x.name }))}
          onChange={(value, option) => handleSearchChange(value, option)}
          onSelect={fetchStudents}
          getPopupContainer={node => node.parentNode}
          filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
          notFoundContent={isLoading ? <Spin /> : "Not found"}
          labelInValue
        >
          {source.map(data => (
            <Select.Option key={data.id} value={data.id} classId={data?.classId}>
              {data.name}
            </Select.Option>
          ))}
        </Select>

        <br />
        <br />

        <Radio.Group style={{ display: "flex" }} onChange={changeSearchSource} value={searchBy}>
          <Radio style={{ width: "50%" }} value="byClass">
            <label style={{ paddingLeft: "15px", fontWeight: "600" }}>BY CLASS</label>
          </Radio>
          <Radio style={{ width: "100%" }} value="byStudent">
            <label style={{ paddingLeft: "15px", fontWeight: "600" }}>SPECIFIC STUDENTS</label>
          </Radio>
        </Radio.Group>

        <br />
        <br />

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

  .anticon,
  .anticon-check,
  .ant-select-selected-icon {
    display: none;
  }

  .ant-modal-close-icon {
    display: block;
    margin-right: 30px;
    margin-top: 25px;
    transform: scale(1.2);
  }

  .ant-select-selection__choice {
    display: none;
  }
  .ant-select-selection__placeholder {
    display: block !important;
  }

  .ant-select-dropdown {
    min-height: 40px;
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
  font-size: 12px;
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
