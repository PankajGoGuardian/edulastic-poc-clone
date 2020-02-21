import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal, Button, Radio, Select } from "antd";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { isEmpty } from "lodash";

import { FlexContainer } from "@edulastic/common";
import { lightGreySecondary, black, white, secondaryTextColor, titleColor, greyishBorder, themeColor } from "@edulastic/colors";
import { fetchClassAndStudentListAction } from "../ducks";


const getFooterComponent = props => (
  <FlexContainer width="450px">
    <ThemeButton onClick={() => { }} inverse>
            DONE
    </ThemeButton>
  </FlexContainer>
);

const DroppedItem = ({ onDelete, item }) => (
  <FlexContainer justifyContent="space-between" height="28px">
    <ItemName>{item.value}</ItemName>
    <ActionWrapper>
      {
                item.type === "class" ?
                    (<IconWrapper fontSize="13"><i className="fa fa-users" aria-hidden="true" /></IconWrapper>) :
                    (<IconWrapper fontSize="13"> <i className="fa fa-user" aria-hidden="true" /></IconWrapper>)
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
        dropPlaylistSource: { classList = [], studentList = [] } = {},
        districtId,
        fetchClassAndStudentListAction
    } = props;

    useEffect(() => {
        if (isEmpty(classList) || isEmpty(studentList)) fetchClassAndStudentListAction(districtId);
    }, []);

    const [searchSource, setSearchSource] = useState("byClass");
    const [addedStudent, setAddedStudent] = useState([]);
    const [removedStudent, setRemovedStudent] = useState([]);
    const [addedClass, setAddedClass] = useState([]);
    const [removedClass, setRemovedClass] = useState([]);

    const changeSearchSource = e => setSearchSource(e.target.value);

    const addedClassIds = addedClass.map(y => y.id);
    const addedStudentIds = addedStudent.map(y => y.id);

    const OPTIONS = searchSource === "byClass" ? classList.filter(x => !addedClassIds.includes(x.classId)) : studentList.filter(x => !addedStudentIds.includes(x.studentId));

    const addedData = [...addedClass, ...addedStudent];

    const handleSearchChange = (value, option) => {
        if (searchSource === "byClass") {
            setAddedClass(prev => prev.concat({ id: option[0].key, value, type: "class" }));
            setRemovedClass(prev => prev.filter(x => x.id !== option[0].key));
        } else {
            setAddedStudent(prev => prev.concat({ id: option[0].key, value, type: "student" }));
            setRemovedStudent(prev => prev.filter(x => x.id !== option[0].key));
        }
    }

    const onItemDelete = item => {
        if (item.type === "class") {
            setAddedClass(prev => prev.filter(x => x.id !== item.id));
            setRemovedClass(prev => prev.concat(item));
        } else {
            setAddedStudent(prev => prev.filter(x => x.id !== item.id));
            setRemovedStudent(prev => prev.concat(item));
        }
    }

    return (
      <StyledPurchaseLicenseModal
        visible={visible}
        title={<h3 style={{ fontWeight: 700 }}>DropPlaylist</h3>}
        onCancel={closeModal}
        footer={[getFooterComponent()]}
        centered
      >
        <>
          <p>Dropping a playlist will let other teachers/students see the playlist and follow along.</p>

          <br />
          <Title>CLASS/STUDENT</Title>
          <Select
            mode="multiple"
            placeholder="Search by name"
            value={[]}
            onChange={(value, option) => handleSearchChange(value, option)}
            getPopupContainer={node => node.parentNode}
            style={{
                        width: "100%",
                        height: "40px",
                        background: lightGreySecondary,
                        border: `1px solid ${greyishBorder}`,
                        lineHeight: "40px"
                    }}
            filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
          >
            {OPTIONS.map(item => (
              <Select.Option
                key={searchSource === "byClass" ? item.classId : item.studentId}
                value={searchSource === "byClass" ? item.className : `${item.firstName || ""} ${item.lastName || ""}`}
              >
                {searchSource === "byClass" ? item.className : `${item.firstName || ""} ${item.lastName || ""}`}
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
        dropPlaylistSource: state?.curriculumSequence?.dropPlaylistSource
    }),
    {
        fetchClassAndStudentListAction
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