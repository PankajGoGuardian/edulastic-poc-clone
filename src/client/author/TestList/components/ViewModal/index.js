import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";
import { darkGrey, themeColor, backgrounds } from "@edulastic/colors";
import { IconHeart, IconShare, IconWorldWide, IconCopy, IconDescription } from "@edulastic/icons";
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
  IconWrapper
} from "./styled";
import { getInterestedCurriculumsSelector } from "../../../src/selectors/user";
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
      onEdit,
      status,
      interestedCurriculums,
      windowWidth
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
      _source
    } = item;

    const titleModified = title?.length > 25 ? `${title.slice(0, 24)?.trim()}...` : title;
    const modalStyles = {
      modal: {
        background: backgrounds.primary,
        padding: "20px 29px 28px",
        maxWidth: windowWidth < 768 ? "100%" : windowWidth < 1200 ? "650px" : "920px",
        borderRadius: "5px"
      }
    };

    return (
      <Modal open={isShow} onClose={close} styles={modalStyles}>
        <ModalTitle>
          <Tooltip title={title}>{titleModified}</Tooltip>
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
                onClick={() => {
                  onEdit();
                }}
              >
                <IconWrapper>
                  <IconDescription color={themeColor} />
                </IconWrapper>
                DETAILS
              </ButtonComponent>
              <ButtonComponent
                onClick={() => {
                  onDuplicate();
                }}
              >
                <IconWrapper>
                  <IconCopy color={themeColor} />
                </IconWrapper>
                DUPLICATE
              </ButtonComponent>
            </ButtonContainer>
            {(permission !== "VIEW" || status === "published") && (
              <ButtonContainer>
                <ButtonComponent size={"large"} bgColor={themeColor} onClick={status === "published" ? assign : onEdit}>
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
                <IconText>{sharing[0] ? sharing[0].type : "Public Library"}</IconText>
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
    interestedCurriculums: getInterestedCurriculumsSelector(state)
  }),
  {}
)(ViewModal);
