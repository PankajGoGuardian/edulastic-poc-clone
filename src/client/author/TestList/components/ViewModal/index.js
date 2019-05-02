import React from "react";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";
import { darkGrey, blue } from "@edulastic/colors";
import { IconHeart, IconShare, IconWorldWide } from "@edulastic/icons";
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
  Button,
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
  SammaryMark
} from "./styled";

export default class ViewModal extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    assign: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
  };

  render() {
    const { isShow, close, item, assign } = this.props;
    const { title, description, tags, grades, subjects, analytics, testItems } = item;

    return (
      <Modal open={isShow} onClose={close}>
        <ModalTitle>{title}</ModalTitle>
        <ModalContainer>
          <ModalColumn>
            <Image />

            <AssessmentNameLabel>Assignemnt Name</AssessmentNameLabel>
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
                <IconText>Public Library</IconText>
              </FooterIcon>
              <FooterIcon>
                <IconShare color={darkGrey} width={14} height={14} /> &nbsp;
                {analytics && <IconText>{analytics.usage} 000</IconText>}
              </FooterIcon>
              <FooterIcon>
                <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
                {analytics && <IconText>{analytics.likes} 000</IconText>}
              </FooterIcon>
            </Footer>
          </ModalColumn>
          <ModalColumn>
            <ButtonContainer>
              <Button>TEST DETAILS</Button>
              <Button bgColor={blue} onClick={assign}>
                ASSIGN
              </Button>
            </ButtonContainer>
            <SummaryContainer>
              <SummaryTitle>Summary</SummaryTitle>
              <SummaryCardContainer>
                <SummaryCard>
                  <SummaryCardValue>{testItems.length}</SummaryCardValue>
                  <SummaryCardLabel>Questions</SummaryCardLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryCardValue>3</SummaryCardValue>
                  <SummaryCardLabel>Points</SummaryCardLabel>
                </SummaryCard>
              </SummaryCardContainer>
              <SummaryList>
                <ListHeader>
                  <ListHeaderCell>SUMMARY</ListHeaderCell>
                  <ListHeaderCell>Qs</ListHeaderCell>
                  <ListHeaderCell>POINTS</ListHeaderCell>
                </ListHeader>
                <ListRow>
                  <ListCell>
                    <SammaryMark>7.G.1</SammaryMark>
                  </ListCell>
                  <ListCell>4</ListCell>
                  <ListCell>4</ListCell>
                </ListRow>
              </SummaryList>
            </SummaryContainer>
          </ModalColumn>
        </ModalContainer>
      </Modal>
    );
  }
}
