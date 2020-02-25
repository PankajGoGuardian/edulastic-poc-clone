import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal, Button, Radio, Select, message } from "antd";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { isEmpty } from "lodash";

import { FlexContainer } from "@edulastic/common";
import { lightGreySecondary, black, white, secondaryTextColor, titleColor, greyishBorder, themeColor } from "@edulastic/colors";
import { fetchClassListAction, fetchStudentListAction, dropPlaylistAction } from "../ducks";


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
      {
        item.type === "class" ?
          (<IconWrapper fontSize="13" title="CLASS LEVEL ACCESS"><i className="fa fa-users" aria-hidden="true" /></IconWrapper>) :
          (<IconWrapper fontSize="13" title="STUDENT LEVEL ACCESS"> <i className="fa fa-user" aria-hidden="true" /></IconWrapper>)
      }
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
    dropPlaylistSource: {
      classList = [],
      studentList = []
    } = {},
    districtId,
    fetchClassListAction,
    fetchStudentListAction,
    dropPlaylistAction,
    destinationCurriculumSequence: {
      _id,
      title,
      description
    } = {}
  } = props;

  useEffect(() => {
    if (isEmpty(classList)) fetchClassListAction(districtId);
  }, []);

  const [searchSource, setSearchSource] = useState("byClass");
  const [addedStudent, setAddedStudent] = useState([]);
  const [removedStudent, setRemovedStudent] = useState([]);
  const [addedClass, setAddedClass] = useState([]);
  const [removedClass, setRemovedClass] = useState([]);

  const changeSearchSource = e => setSearchSource(e.target.value);


  const handleSearchChange = (value, option) => {
    if (searchSource === "byClass") {
      const studentIds = value.map(x => studentList.find(y => y.classId === x)?.id);
      setAddedStudent(prev => prev.filter(x => !studentIds.includes(x.id)));
      setRemovedClass(prev => addedClass.length > 0 && addedClass.length !== option.length ? prev.concat(addedClass[addedClass.length - 1]?.id) : prev);
      setAddedClass(option.map(x => ({ id: x.key, name: x?.props?.children, type: "class" })));
    } else {
      const classIds = value.map(x => studentList.find(y => y.id === x)?.classId);
      setAddedClass(prev => prev.filter(x => !classIds.includes(x.id)));
      setRemovedStudent(prev => addedStudent.length > 0 && addedStudent.length !== option.length ? prev.concat(addedStudent[addedStudent.length - 1]?.id) : prev);
      setAddedStudent(option.map(x => ({ id: x.key, name: x?.props?.children, type: "student", classId: x?.props?.classId })));
    }
  }

  const onItemDelete = item => {
    if (item.type === "class") {
      setAddedClass(prev => prev.filter(x => x.id !== item.id));
      setRemovedClass(prev => prev.concat(item.id));
    } else {
      setAddedStudent(prev => prev.filter(x => x.id !== item.id));
      setRemovedStudent(prev => prev.concat(item.id));
    }
  }

  const dropPlaylist = () => {
    const payload = {
      playlistId: _id,
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
    }
    if (dropPlaylistAction(payload)) {
      message.success("DropPlaylist Successful");
      closeModal();
    }
  }

  const addedSource = (searchSource === "byClass" ? addedClass : addedStudent);
  const source = searchSource === "byClass" ? classList : studentList;
  const addedData = [...addedClass, ...addedStudent];

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
          placeholder={searchSource === "byClass" ? "SEARCH BY CLASS NAME" : "SEARCH BY STUDENT NAME"}
          style={{ width: "100%" }}
          mode="multiple"
          cache="false"
          value={addedSource.map(x => x.id)}
          onChange={(value, option) => handleSearchChange(value, option)}
          onSelect={classId => fetchStudentListAction({ districtId, classId })}
          getPopupContainer={node => node.parentNode}
          filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
        >
          {source.map(data => (
            <Select.Option key={data.id} value={data.id} classId={data?.classId}>
              {data.name}
            </Select.Option>
          ))}
        </Select>

        <br /><br />

        <Radio.Group onChange={changeSearchSource} value={searchSource}>
          <Radio value="byClass">By Class</Radio>
          <Radio value="byStudent">By Student</Radio>
        </Radio.Group>

        <br /><br />

        <Title>WHO HAS DROP ACCESS</Title>
        <DroppedList>
          {
            addedData.map(x => <DroppedItem key={x.id} onDelete={onItemDelete} item={x} />)
          }
        </DroppedList>
      </>

    </StyledPurchaseLicenseModal>
  );
};

export default connect(
  state => ({
    districtId: state?.user?.user?.districtId,
    dropPlaylistSource: state?.curriculumSequence?.dropPlaylistSource,
    destinationCurriculumSequence: state?.curriculumSequence?.destinationCurriculumSequence
  }),
  {
    fetchClassListAction,
    fetchStudentListAction,
    dropPlaylistAction
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

  .ant-modal-close-x{
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
  .ant-select-selected-icon{
    display: none;
  }

  .ant-modal-close-icon{
    display: block;
    margin-right: 30px;
    margin-top: 25px;
    transform: scale(1.2);
  }
  
  .ant-select-selection__choice{
    display: none;
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

    i{
        color: ${({ show }) => show ? themeColor : greyishBorder}; 
        font-size: ${({ fontSize }) => fontSize}px;
    }
`;