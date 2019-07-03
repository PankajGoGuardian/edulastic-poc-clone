import React from "react";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";
import { darkGrey, blue } from "@edulastic/colors";
import { IconHeart, IconShare, IconWorldWide, IconCopy, IconDescription } from "@edulastic/icons";
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
  IconWrapper
} from "./styled";

export default class ViewModal extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    assign: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
  };

  render() {
    const { isShow, close, item, assign, isPlaylist, onDuplicate, onEdit, status } = this.props;
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
      _source
    } = item;

    return (
      <Modal open={isShow} onClose={close}>
        <ModalTitle>{title}</ModalTitle>
        <ModalContainer>
          <ModalColumn>
            <Image src={thumbnail} />

            <AssessmentNameLabel>Assignment Name</AssessmentNameLabel>
            <AssessmentName>{title}</AssessmentName>

            <DescriptionLabel>Description</DescriptionLabel>
            <Description>{description}</Description>

            <TagsLabel>Tags</TagsLabel>
            <TagsConatiner>{tags && tags.map((tag, index) => <TagGrade key={index}>{tag}</TagGrade>)}</TagsConatiner>

            <GradeLabel>Grade</GradeLabel>
            <GradeConatiner>
              {grades && grades.map((grade, index) => <TagGrade key={index}>{grade}</TagGrade>)}
            </GradeConatiner>

            <SubjectLabel>Subject</SubjectLabel>
            {subjects && subjects.map((subject, index) => <Subject key={index}>{subject}</Subject>)}

            <Footer>
              <FooterIcon>
                <IconWorldWide color={darkGrey} width={14} height={14} /> &nbsp;
                <IconText>{sharing[0] ? sharing[0].type : ""}</IconText>
              </FooterIcon>
              <FooterIcon rotate>
                <IconShare color={darkGrey} width={14} height={14} /> &nbsp;
                {analytics && <IconText>{analytics.usage || 0} </IconText>}
              </FooterIcon>
              <FooterIcon>
                <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
                {analytics && <IconText>{analytics.likes || 0}</IconText>}
              </FooterIcon>
            </Footer>
          </ModalColumn>
          <ModalColumn>
            <ButtonContainer>
              <ButtonComponent
                onClick={() => {
                  onEdit();
                }}
              >
                <IconWrapper>
                  <IconDescription color={blue} />
                </IconWrapper>
                DETAILS
              </ButtonComponent>
              <ButtonComponent
                onClick={() => {
                  onDuplicate();
                }}
              >
                <IconWrapper>
                  <IconCopy color={blue} />
                </IconWrapper>
                DUPLICATE
              </ButtonComponent>
            </ButtonContainer>
            <ButtonContainer>
              <ButtonComponent size={"large"} bgColor={blue} onClick={status === "published" ? assign : onEdit}>
                {status === "published" ? "ASSIGN" : "EDIT"}
              </ButtonComponent>
            </ButtonContainer>
            <SummaryContainer>
              <SummaryTitle>Summary</SummaryTitle>
              <SummaryCardContainer>
                <SummaryCard>
                  <SummaryCardValue>
                    {isPlaylist ? _source.modules && _source.modules.length : summary.totalQuestions}
                  </SummaryCardValue>
                  <SummaryCardLabel>Questions</SummaryCardLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryCardValue>{summary.totalPoints}</SummaryCardValue>
                  <SummaryCardLabel>Points</SummaryCardLabel>
                </SummaryCard>
              </SummaryCardContainer>
              <SummaryList>
                <ListHeader>
                  <ListHeaderCell>SUMMARY</ListHeaderCell>
                  <ListHeaderCell>Qs</ListHeaderCell>
                  <ListHeaderCell>POINTS</ListHeaderCell>
                </ListHeader>
                {summary &&
                  summary.standards &&
                  summary.standards.map(
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
            </SummaryContainer>
          </ModalColumn>
        </ModalContainer>
      </Modal>
    );
  }
}
