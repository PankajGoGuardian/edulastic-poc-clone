import React, { useState, useEffect } from "react";
import { Button, Select } from "antd";
import { EduButton,notification } from "@edulastic/common";
import styled from "styled-components";
import { backgroundGrey2, green, themeColorTagsBg } from "@edulastic/colors";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

const CanvasSyncModal = ({
  visible,
  handleCancel,
  syncClassLoading,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  syncClassWithCanvas,
  canvasCode,
  canvasCourseSectionCode,
  user,
  groupId,
  institutionId
}) => {
  const [course, setCourse] = useState(canvasCode);
  const [section, setSection] = useState(canvasCourseSectionCode);
  const [idDisabled, setIsDisabled] = useState(!!canvasCode && !!canvasCourseSectionCode);

  useEffect(() => {
    getCanvasCourseListRequest(institutionId);
    if (course && section) {
      getCanvasSectionListRequest({ institutionId, allCourseIds: [course] });
    }
  }, []);

  const handleCourseChange = value => {
    getCanvasSectionListRequest({ institutionId, allCourseIds: [value] });
    setCourse(value);
    setSection("");
  };

  useEffect(() => {
    if (!course && canvasCourseList.length) handleCourseChange(canvasCourseList[0].id);
  }, [canvasCourseList]);

  useEffect(() => {
    if (!section && canvasSectionList.length) setSection(canvasSectionList[0].id);
  }, [canvasSectionList]);

  const handleSync = () => {
    if (!course || !section) {
      return notification({ msg: "bothCourseandSectionRequired"});
    }

    const { id: canvasCourseCode, name: canvasCourseName } = canvasCourseList.find(({ id }) => id === course);

    const { id: sectionId, name: sectionName } = canvasSectionList.find(({ id }) => id === section);

    const data = {
      userId: user._id,
      groupId,
      canvasCourseCode,
      canvasCourseName,
      sectionId,
      sectionName,
      institutionId,
      districtId: user?.districtIds?.[0]
    };
    syncClassWithCanvas(data);
  };

  const Title = <h4>Select Canvas Course & Section</h4>;
  const Footer = [
    ...(!!canvasCode && !!canvasCourseSectionCode
      ? [
        <Button disabled={syncClassLoading} onClick={() => setIsDisabled(false)}>
          Change deatils
        </Button>
        ]
      : []),
    <EduButton disabled={syncClassLoading} isGhost onClick={handleCancel}>
      Cancel
    </EduButton>,
    <EduButton type="primary" loading={syncClassLoading} onClick={handleSync}>
      {syncClassLoading ? "Syncing..." : "Sync"}
    </EduButton>
  ];

  return (
    <StyledModal visible={visible} title={Title} footer={Footer} centered onCancel={handleCancel}>
      <FieldWrapper>
        <label>Course</label>
        <Select
          placeholder="Select a Course"
          value={+course}
          onChange={handleCourseChange}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          disabled={idDisabled}
        >
          {canvasCourseList.map(c => (
            <Select.Option key={c.id} value={+c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </FieldWrapper>
      <FieldWrapper>
        <label>Section</label>
        <Select
          placeholder="Select a Section"
          value={+section}
          onChange={value => {
            setSection(value);
          }}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          disabled={idDisabled}
        >
          {canvasSectionList.map(s => (
            <Select.Option key={s.id} value={+s.id}>
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </FieldWrapper>
    </StyledModal>
  );
};

export default CanvasSyncModal;

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-header {
      padding-bottom: 5px;
      h4 {
        font-weight: ${({ theme }) => theme.semiBold};
      }
    }
    .ant-modal-body {
      display: block;
    }
  }
`;

const FieldWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
  label {
    display: block;
    margin-bottom: 5px;
    text-align: left;
    text-transform: uppercase;
    font-size: ${({ theme }) => theme.smallFontSize};
    font-weight: ${({ theme }) => theme.semiBold};
  }
  .ant-select {
    width: 100%;
    .ant-select-selection {
      background: ${backgroundGrey2};
      border-radius: 2px;
      .ant-select-selection__rendered {
        min-height: 35px;
        line-height: 35px;
        font-weight: 500;
        .ant-select-selection__choice {
          background: ${themeColorTagsBg};
          color: ${green};
          font-size: ${({ theme }) => theme.smallFontSize};
          font-weight: ${({ theme }) => theme.semiBold};
        }
      }
    }
  }
`;
