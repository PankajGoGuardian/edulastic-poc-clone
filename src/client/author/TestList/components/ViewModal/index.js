import { darkGrey, white } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import {
  IconCopy,
  IconDescription,
  IconHeart,
  IconShare,
  IconTrashAlt,
  IconWorldWide,
  IconEye,
  IconPencilEdit,
  IconAssignment
} from "@edulastic/icons";
import { Icon, Select, Tooltip, Col, Row } from "antd";
import { find } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { StyledSelect } from "../../../../common/styled";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import Tags from "../../../src/components/common/Tags";
import {
  getCollectionsSelector,
  getInterestedCurriculumsSelector,
  getUserIdSelector,
  getUserRole
} from "../../../src/selectors/user";
import TestStatusWrapper from "../TestStatusWrapper/testStatusWrapper";
import {
  AssessmentName,
  AssessmentNameLabel,
  ButtonContainer,
  Description,
  DescriptionLabel,
  Footer,
  FooterIcon,
  GradeConatiner,
  GradeLabel,
  GroupName,
  GroupSummaryCard,
  GroupSummaryCardValue,
  IconText,
  Image,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
  ModalColumn,
  ModalContainer,
  ModalTitle,
  SammaryMark,
  SubjectLabel,
  SummaryCard,
  SummaryCardContainer,
  SummaryCardLabel,
  SummaryCardValue,
  SummaryContainer,
  SummaryList,
  SummaryTitle,
  TagsConatiner,
  TagsLabel,
  TestStatus,
  TestTitleWrapper
} from "./styled";

class ViewModal extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    assign: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isPlaylist: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    interestedCurriculums: PropTypes.array,
    windowWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.string,
    collections: PropTypes.array,
    allowDuplicate: PropTypes.bool.isRequired
  };

  static defaultProps = {
    interestedCurriculums: [],
    userId: "",
    collections: []
  };

  state = {
    editedCollections: null
  };

  modalRef = React.createRef();

  onCollectionsChange = (value, options) => {
    const newCollections = options.map(o => ({ _id: o.props.value, name: o.props.title }));
    this.setState({ editedCollections: newCollections });
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
      onReject,
      onApprove,
      status,
      windowWidth,
      userId,
      collections,
      allowDuplicate,
      userRole,
      previewLink,
      modalView = true,
      publicAccess = false
    } = this.props;
    const {
      title = "",
      description = "",
      tags = [],
      grades = [],
      subjects = [],
      thumbnail = "",
      analytics = [],
      itemGroups = [],
      summary = {},
      sharing = [],
      permission,
      _source,
      authors,
      sharedWith,
      collections: _collections = [],
      isDocBased
    } = item;

    const { editedCollections } = this.state;

    const modalStyles = {
      modal: {
        background: white,
        padding: "20px 40px",
        width: windowWidth < 768 ? "100%" : windowWidth < 1200 ? "750px" : "920px",
        maxWidth: "unset",
        borderRadius: "5px"
      }
    };

    const gradesMap = {
      K: "Kindergarten",
      1: "Grade 1",
      2: "Grade 2",
      3: "Grade 3",
      4: "Grade 4",
      5: "Grade 5",
      6: "Grade 6",
      7: "Grade 7",
      8: "Grade 8",
      9: "Grade 9",
      10: "Grade 10",
      11: "Grade 11",
      12: "Grade 12",
      O: "Other"
    };

    const selectedGrades = grades.map(grade => gradesMap[grade]);

    const isEdulasticCurator = userRole === roleuser.EDULASTIC_CURATOR;

    const isDeleteAllowed =
      !!find(authors, o => o._id === userId) ||
      (sharedWith?.find(x => x._id === userId) && permission === "EDIT") ||
      isEdulasticCurator;

    const contanier = (
      <>
        <ModalTitle>
          <Tooltip title={title}>
            <TestTitleWrapper>{title}</TestTitleWrapper>
          </Tooltip>
          <TestStatusWrapper status={status}>
            {({ children, ...rest }) => (
              <TestStatus {...rest} view="tile">
                {children}
              </TestStatus>
            )}
          </TestStatusWrapper>
        </ModalTitle>
        <ModalContainer>
          <ModalColumn>
            <Image src={thumbnail} />
          </ModalColumn>
          <ModalColumn justify="center" ref={this.modalRef}>
            {!publicAccess && (
              <ButtonContainer>
                <EduButton
                  isGhost
                  height="40px"
                  width="100%"
                  style={{ justifyContent: "center" }}
                  data-cy="details-button"
                  onClick={() => {
                    onEdit();
                  }}
                >
                  <IconDescription />
                  <span>DETAILS</span>
                </EduButton>
                {allowDuplicate && !isEdulasticCurator && (
                  <EduButton
                    isGhost
                    height="40px"
                    width="100%"
                    style={{ justifyContent: "center" }}
                    data-cy="duplicate-button"
                    onClick={() => {
                      onDuplicate();
                    }}
                  >
                    <IconCopy />
                    <span>CLONE</span>
                  </EduButton>
                )}

                {status === "inreview" ? (
                  <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
                    <EduButton
                      isGhost
                      height="40px"
                      width="100%"
                      style={{ justifyContent: "center" }}
                      data-cy="reject-button"
                      onClick={() => {
                        onReject();
                      }}
                    >
                      <Icon type="stop" />
                      <span>REJECT</span>
                    </EduButton>
                  </FeaturesSwitch>
                ) : null}
                {isDeleteAllowed ? (
                  <EduButton
                    isGhost
                    height="40px"
                    width="100%"
                    style={{ justifyContent: "center" }}
                    data-cy="delete-button"
                    onClick={() => onDelete()}
                  >
                    <IconTrashAlt />
                    <span>DELETE</span>
                  </EduButton>
                ) : null}
              </ButtonContainer>
            )}
            {!publicAccess && (
              <ButtonContainer>
                {status === "inreview" || status === "rejected" ? (
                  <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
                    <EduButton
                      isGhost
                      height="40px"
                      data-cy="approve-button"
                      onClick={() => {
                        onApprove(editedCollections !== null ? editedCollections : _collections);
                      }}
                    >
                      <Icon type="check" />
                      <span>Approve</span>
                    </EduButton>
                  </FeaturesSwitch>
                ) : null}
              </ButtonContainer>
            )}
            <ButtonContainer className={publicAccess ? "public-access-btn-wrapper" : ""}>
              <EduButton
                height="40px"
                width="100%"
                isGhost
                noHover
                justifyContent="center"
                data-cy="preview-button"
                onClick={previewLink}
              >
                {!publicAccess && <IconEye />}
                Preview
              </EduButton>
              {publicAccess && (
                <EduButton height="40px" width="100%" justifyContent="center" data-cy="assign-button" onClick={assign}>
                  <span>ASSIGN</span>
                </EduButton>
              )}
              {(permission !== "VIEW" || status === "published") && !isEdulasticCurator && !publicAccess && (
                <EduButton
                  height="40px"
                  width="100%"
                  justifyContent="center"
                  data-cy="edit/assign-button"
                  onClick={status === "published" ? assign : onEdit}
                >
                  {status === "published" ? (
                    <>
                      <IconAssignment />
                      <span>ASSIGN</span>
                    </>
                  ) : (
                    <>
                      <IconPencilEdit height={14} />
                      <span>EDIT</span>
                    </>
                  )}
                </EduButton>
              )}
            </ButtonContainer>
            {status === "inreview" || status === "rejected" ? (
              <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
                <ButtonContainer>
                  <StyledSelect
                    mode="multiple"
                    size="medium"
                    style={{ width: "100%" }}
                    value={
                      editedCollections !== null ? editedCollections.map(o => o._id) : _collections.map(o => o._id)
                    }
                    filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
                    getPopupContainer={() => this.modalRef.current}
                    onChange={this.onCollectionsChange}
                  >
                    {collections.map(({ _id, name }) => (
                      <Select.Option key={_id} value={_id} title={name}>
                        {name}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </ButtonContainer>
              </FeaturesSwitch>
            ) : null}
          </ModalColumn>
          <ModalColumn>
            <AssessmentNameLabel>Test Name</AssessmentNameLabel>
            <AssessmentName>{title}</AssessmentName>

            <DescriptionLabel>Description</DescriptionLabel>
            <Description>{description}</Description>

            <Row gutter={10}>
              <Col span={12}>
                <GradeLabel>Grade</GradeLabel>
                <GradeConatiner>
                  {grades && <Tags isGrayTags tags={selectedGrades} show={2} key="grades" />}
                </GradeConatiner>
              </Col>
              <Col span={12}>
                <SubjectLabel>Subject</SubjectLabel>
                {subjects && <Tags isGrayTags tags={subjects} show={1} key="subjects" />}
              </Col>
            </Row>

            <TagsLabel>Tags</TagsLabel>
            <TagsConatiner>{tags && <Tags isCustomTags tags={tags} show={2} key="tags" />}</TagsConatiner>

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
                    {isPlaylist
                      ? _source.modules && _source.modules.length
                      : /**
                         * for doc based, we need to consider questions as items
                         */
                        (isDocBased ? summary.totalQuestions : summary.totalItems) || 0}
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
              {/* one group with AUTOSELECT or multiple groups can be considered as publisher test */}
              {summary?.groupSummary?.length > 1 || itemGroups?.[0]?.type === "AUTOSELECT" ? (
                summary?.groupSummary?.map((group, i) => {
                  const standards = group?.standards?.filter(x => !x.isEquivalentStandard)?.map(x => x.identifier);
                  return (
                    <>
                      <GroupName>{itemGroups[i]?.groupName}</GroupName>
                      <SummaryCardContainer>
                        <GroupSummaryCard>
                          <GroupSummaryCardValue>{group.totalItems}</GroupSummaryCardValue>
                          <SummaryCardLabel>Items</SummaryCardLabel>
                        </GroupSummaryCard>
                        <GroupSummaryCard>
                          <Tags tags={standards} key="standards" show={2} isStandards />
                        </GroupSummaryCard>
                      </SummaryCardContainer>
                    </>
                  );
                })
              ) : (
                <SummaryList>
                  <ListHeader>
                    <ListHeaderCell>SUMMARY</ListHeaderCell>
                    <ListHeaderCell>Qs</ListHeaderCell>
                    <ListHeaderCell>POINTS</ListHeaderCell>
                  </ListHeader>
                  {!!summary?.standards?.length &&
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
              )}
            </PerfectScrollbar>
          </ModalColumn>
        </ModalContainer>
      </>
    );

    if (modalView) {
      return (
        <Modal open={isShow} onClose={close} styles={modalStyles}>
          {contanier}
        </Modal>
      );
    }
    return contanier;
  }
}

export default connect(
  state => ({
    userId: getUserIdSelector(state),
    collections: getCollectionsSelector(state),
    userRole: getUserRole(state)
  }),
  {}
)(ViewModal);
