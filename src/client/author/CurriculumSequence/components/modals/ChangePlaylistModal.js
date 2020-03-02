import React from "react";
import styled from "styled-components";
import { Row, Col, Modal, Avatar, Tooltip } from "antd";
import { Card } from "@edulastic/common";
import { IconPlaylist, IconGraduationCap, IconBook } from "@edulastic/icons";
import { themeLightGrayColor, greyThemeDark1, lightGreen5 } from "@edulastic/colors";
import { EllipsisContainer } from "../CurriculumModuleRow";

// inline styles for playlist card
const cardHeaderRowStyle = { height: "60px", margin: "4px 0px 15px 0px" };
const cardHeaderStyle = { width: "calc(100% - 80px)", font: "Bold 14px/19px Open Sans", "letter-spacing": "1.4px" };
const cardIconStyle = { "margin-right": "8px", overflow: "unset", fill: themeLightGrayColor };
const cardTextStyle = { width: "calc(100% - 38px)", font: "Bold 11px/15px Open Sans", color: themeLightGrayColor };
// inline styles for side card
const sideIconStyle = { "margin-right": "45px" };
const sideCardStyle = {
  font: "11px/15px Open Sans",
  "font-weight": "600",
  "letter-spacing": "0.2px",
  color: lightGreen5
};

// logic for joining list of (list of strings)
const filteredJoin = listOfLists => listOfLists.map(list => (list || []).filter(item => !!item).join(", "));

// logic for title to initials
const titleToInitials = title =>
  title
    .split(" ")
    .map(item => {
      const matches = item.match(/[a-zA-Z]+/g);
      return matches ? matches[0][0] : "";
    })
    .join("")
    .toUpperCase();

// playlist card format
const PlaylistCard = ({
  _id,
  playlistId,
  title,
  grades: gradeList,
  subjects: subjectList,
  groupId,
  activePlaylistId,
  select
}) => {
  const [grades, subjects] = filteredJoin([gradeList, subjectList]);
  const pId = playlistId || _id;
  const active = activePlaylistId === pId;
  return (
    <StyledCard
      key={`select_playlist_${pId}`}
      onClick={() => select({ _id: pId, title, grades: gradeList, subjects: subjectList, groupId })}
    >
      <Row type="flex" align="middle" style={cardHeaderRowStyle}>
        <Avatar size={46} style={{ "margin-right": "20px", backgroundColor: active ? lightGreen5 : greyThemeDark1 }}>
          {titleToInitials(title).substring(0, 2)}
        </Avatar>
        <Tooltip placement="bottomLeft" title={title}>
          <EllipsisContainer style={cardHeaderStyle} color={active ? lightGreen5 : greyThemeDark1}>
            {title}
          </EllipsisContainer>
        </Tooltip>
      </Row>
      <Row type="flex" align="middle" justify="space-between">
        <StyledCol span={12}>
          <IconGraduationCap width={17} height={15} style={cardIconStyle} />
          <Tooltip placement="bottomLeft" title={`Grade ${grades}`}>
            <EllipsisContainer style={cardTextStyle}>Grade {grades}</EllipsisContainer>
          </Tooltip>
        </StyledCol>
        <StyledCol span={12}>
          <IconBook width={14} height={15} style={cardIconStyle} />
          <Tooltip placement="bottomLeft" title={subjects}>
            <EllipsisContainer style={cardTextStyle}>{subjects}</EllipsisContainer>
          </Tooltip>
        </StyledCol>
      </Row>
    </StyledCard>
  );
};

// dumb playlist modal
const ChangePlaylistModal = ({
  activePlaylistId,
  playlists,
  onChange,
  isStudent,
  onExplorePlaylists,
  ...modalStyles
}) => (
  <StyledModal {...modalStyles} width="calc(100vw - 80px)">
    <Row type="flex" justify="space-between">
      {isStudent ? (
        <StyledCol span={24}>
          {playlists.map(playlist => (
            <PlaylistCard {...playlist} select={onChange} activePlaylistId={activePlaylistId} />
          ))}
        </StyledCol>
      ) : (
        <>
          <StyledCol xs={12} sm={12} md={14} lg={15} xl={18}>
            {playlists.map(playlist => (
              <PlaylistCard {...playlist} select={onChange} activePlaylistId={activePlaylistId} />
            ))}
          </StyledCol>
          <StyledCol xs={12} sm={12} md={10} lg={9} xl={6} justify="flex-end">
            <StyledCard height={60} justify="center" style={sideCardStyle} onClick={onExplorePlaylists}>
              <Row type="flex" align="middle">
                <IconPlaylist width={18} height={18} style={sideIconStyle} color={lightGreen5} />
                EXPLORE PLAY LISTS &gt;&gt;
              </Row>
            </StyledCard>
          </StyledCol>
        </>
      )}
    </Row>
  </StyledModal>
);

export default ChangePlaylistModal;

const StyledCard = styled(Card)`
  margin: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: ${props => props.width || 290}px;
  max-width: ${props => props.width || 290}px;
  min-height: ${props => props.height || 150}px;
  max-height: ${props => props.height || 150}px;
  .ant-card-body {
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    padding: 20px 27px;
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${props => props.justify || "flex-start"};
`;

const StyledModal = styled(Modal)`
  left: 40px;
  top: 40px;
  .ant-modal-content {
    background-color: transparent;
    box-shadow: unset;
    .ant-modal-close {
      display: none;
    }
  }
}
`;
