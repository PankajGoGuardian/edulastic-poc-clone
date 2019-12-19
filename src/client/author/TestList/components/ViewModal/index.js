import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";
import { find } from "lodash";
import { darkGrey, themeColor, backgrounds } from "@edulastic/colors";
import { IconHeart, IconShare, IconWorldWide, IconCopy, IconDescription, IconTrashAlt } from "@edulastic/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Tooltip } from "antd";
import {
  ModalTitle,
  ModalContainer,
  ModalColumn,
  Image,
  AssessmentNameLabel,
  AssessmentName,
  DescriptionLabel,
  Description,
  TagsLabel,
  TagsConatiner,
  GradeLabel,
  GradeConatiner,
  SubjectLabel,
  Subject,
  Footer,
  FooterIcon,
  IconText,
  TagGrade,
  ButtonContainer,
  ButtonComponent,
  SummaryContainer,
  SummaryTitle,
  SummaryCardContainer,
  SummaryCard,
  SummaryCardLabel,
  SummaryCardValue,
  SummaryList,
  ListHeader,
  ListRow,
  ListHeaderCell,
  ListCell,
  SammaryMark,
  TestStatus,
  IconWrapper,
  TestTitleWrapper
} from "./styled";
import { getInterestedCurriculumsSelector, getUserIdSelector } from "../../../src/selectors/user";
import { getInterestedStandards } from "../../../dataUtils";

class ViewModal extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    assign: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
  };

  render() {
    const {
      isShow,
      close,
      item,
      assign,
      isPlaylist,
      onDuplicate,
      onDelete,
      onEdit,
      status,
      interestedCurriculums,
      windowWidth,
      userId
    } = this.props;
    const {
      title = "",
      description = "",
      tags = [],
      grades = [],
      subjects = [],
      thumbnail = "",
      analytics = [],
      testItems = [],
      scoring = {},
      summary = {},
      sharing = [],
      permission,
      _source,
      authors
    } = item;

    const modalStyles = {
      modal: {
        background: backgrounds.primary,
        padding: "20px 29px 28px",
        width: windowWidth < 768 ? "100%" : windowWidth < 1200 ? "750px" : "920px",
        maxWidth: "unset",
        borderRadius: "5px"
      }
    };
    const isDeleteAllowed = !!find(authors, o => o._id === userId);

    return (
      <Modal open={isShow} onClose={close} styles={modalStyles}>
        <ModalTitle>
          <Tooltip title={title}>
            <TestTitleWrapper>{title}</TestTitleWrapper>
          </Tooltip>
          <TestStatus view="tile" status={status}>
            {status}
          </TestStatus>
        </ModalTitle>
        <ModalContainer>
          <ModalColumn>
            <Image src={thumbnail} />
          </ModalColumn>
          <ModalColumn justify="center">
            <ButtonContainer>
              <ButtonComponent
                data-cy="details-button"
                onClick={() => {
                  onEdit();
                }}
              >
                <IconWrapper>
                  <IconDescription color={themeColor} />
                </IconWrapper>
                <span>DETAILS</span>
              </ButtonComponent>
              <ButtonComponent
                data-cy="duplicate-button"
                onClick={() => {
                  onDuplicate();
                }}
              >
                <IconWrapper>
                  <IconCopy color={themeColor} />
                </IconWrapper>
                <span>DUPLICATE</span>
              </ButtonComponent>
              {isDeleteAllowed ? (
                <ButtonComponent data-cy="delete-button" onClick={() => onDelete()}>
                  <IconWrapper>
                    <IconTrashAlt color={themeColor} />
                  </IconWrapper>
                  <span>DELETE</span>
                </ButtonComponent>
              ) : null}
            </ButtonContainer>
            {(permission !== "VIEW" || status === "published") && (
              <ButtonContainer>
                <ButtonComponent
                  data-cy="edit/assign-button"
                  size={"large"}
                  bgColor={themeColor}
                  onClick={status === "published" ? assign : onEdit}
                >
                  {status === "published" ? "ASSIGN" : "EDIT"}
                </ButtonComponent>
              </ButtonContainer>
            )}
          </ModalColumn>
          <ModalColumn>
            <AssessmentNameLabel>Test Name</AssessmentNameLabel>
            <AssessmentName>{title}</AssessmentName>

            <DescriptionLabel>Description</DescriptionLabel>
            <Description>{description}</Description>

            <TagsLabel>Tags</TagsLabel>
            <TagsConatiner>
              {tags && tags.map(({ tagName }, index) => <TagGrade key={index}>{tagName}</TagGrade>)}
            </TagsConatiner>

            <GradeLabel>Grade</GradeLabel>
            <GradeConatiner>
              {grades && grades.map((grade, index) => <TagGrade key={index}>{grade}</TagGrade>)}
            </GradeConatiner>

            <SubjectLabel>Subject</SubjectLabel>
            {subjects && subjects.map((subject, index) => <Subject key={index}>{subject}</Subject>)}

            <Footer>
              <FooterIcon>
                <IconWorldWide color={darkGrey} width={14} height={14} />
                <IconText>
                  {sharing[0] ? sharing[0].type : item.status === "draft" ? "Private Library" : "Public Library"}
                </IconText>
              </FooterIcon>
              <FooterIcon rotate>
                <IconShare color={darkGrey} width={14} height={14} />
                {analytics && <IconText>{analytics.usage || 0} </IconText>}
              </FooterIcon>
              <FooterIcon>
                <IconHeart color={darkGrey} width={14} height={14} />
                {analytics && <IconText>{analytics.likes || 0}</IconText>}
              </FooterIcon>
            </Footer>
          </ModalColumn>
          <ModalColumn>
            <SummaryContainer>
              <SummaryTitle>Summary</SummaryTitle>
              <SummaryCardContainer>
                <SummaryCard>
                  <SummaryCardValue>
                    {isPlaylist ? _source.modules && _source.modules.length : summary.totalItems || 0}
                  </SummaryCardValue>
                  <SummaryCardLabel>Items</SummaryCardLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryCardValue>{summary.totalPoints}</SummaryCardValue>
                  <SummaryCardLabel>Points</SummaryCardLabel>
                </SummaryCard>
              </SummaryCardContainer>
            </SummaryContainer>
            <PerfectScrollbar>
              <SummaryList>
                <ListHeader>
                  <ListHeaderCell>SUMMARY</ListHeaderCell>
                  <ListHeaderCell>Qs</ListHeaderCell>
                  <ListHeaderCell>POINTS</ListHeaderCell>
                </ListHeader>
                {summary &&
                  getInterestedStandards(summary, interestedCurriculums).map(
                    data =>
                      !data.isEquivalentStandard && (
                        <ListRow>
                          <ListCell>
                            <SammaryMark>{data.identifier}</SammaryMark>
                          </ListCell>
                          <ListCell>{data.totalQuestions}</ListCell>
                          <ListCell>{data.totalPoints}</ListCell>
                        </ListRow>
                      )
                  )}
                {summary?.noStandards?.totalQuestions > 0 && (
                  <ListRow>
                    <ListCell>
                      <SammaryMark>No Standard</SammaryMark>
                    </ListCell>
                    <ListCell>{summary.noStandards.totalQuestions}</ListCell>
                    <ListCell>{summary.noStandards.totalPoints}</ListCell>
                  </ListRow>
                )}
              </SummaryList>
            </PerfectScrollbar>
          </ModalColumn>
        </ModalContainer>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    userId: getUserIdSelector(state)
  }),
  {}
)(ViewModal);
