import React from 'react'
import loadable from '@loadable/component'
import { darkGrey, white, greyThemeDark2 } from '@edulastic/colors'
import { EduButton, EduIf, LikeIconStyled, Progress } from '@edulastic/common'
import {
  roleuser,
  collections as collectionsConstant,
  test as testConstants,
} from '@edulastic/constants'
import TestsApi from '@edulastic/api/src/tests'
import {
  IconCopy,
  IconDescription,
  IconHeart,
  IconUsers,
  IconTrashAlt,
  IconWorldWide,
  IconEye,
  IconPencilEdit,
  IconAssignment,
  IconDynamic,
  IconShare,
  IconClose,
} from '@edulastic/icons'
import { Icon, Select, Tooltip, Col, Row, Spin } from 'antd'
import { find, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from 'react-redux'
import Modal from 'react-responsive-modal'
import { StyledSelect } from '../../../../common/styled'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import Tags from '../../../src/components/common/Tags'
import {
  getCollectionsSelector,
  getUserIdSelector,
  getUserRole,
  isPublisherUserSelector,
  getWritableCollectionsSelector,
  getInterestedCurriculumsSelector,
  getIsCurator,
} from '../../../src/selectors/user'
import TestStatusWrapper from '../TestStatusWrapper/testStatusWrapper'
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
  TestTitleWrapper,
  DynamicIconWrapper,
  ModalHeader,
  CloseButton,
  RightButtonContainer,
} from './styled'
import {
  allowContentEditCheck,
  isContentOfCollectionEditable,
} from '../../../src/utils/permissionCheck'
import {
  getInterestedStandards,
  hasUserGotAccessToPremiumItem,
} from '../../../dataUtils'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import ShareModal from '../../../src/components/common/ShareModal'

const CloneOptions = loadable(() => import('./CloneOptions'))

const { nonPremiumCollectionsToShareContent } = collectionsConstant
const { statusConstants } = testConstants
class ViewModal extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    assign: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isPlaylist: PropTypes.bool.isRequired,
    onDelete: PropTypes.func,
    onReject: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    interestedCurriculums: PropTypes.array,
    windowWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    userId: PropTypes.string,
    collections: PropTypes.array,
    allowDuplicate: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    interestedCurriculums: [],
    userId: '',
    collections: [],
    onDelete: () => {},
  }

  state = {
    editedCollections: null,
    showCloneOptions: false,
    summary: null,
    summaryLoading: false,
    showShareModal: false,
  }

  modalRef = React.createRef()

  onCollectionsChange = (value, options) => {
    const newCollections = options.map((o) => ({
      _id: o.props.value,
      name: o.props.title,
    }))
    this.setState({ editedCollections: newCollections })
  }

  handleModalClose = () => {
    const { close } = this.props
    this.setState({ showCloneOptions: false }, close)
  }

  hideCloneOptions = () => {
    this.setState({ showCloneOptions: false })
  }

  componentDidMount() {
    const { item, userId } = this.props
    if (!isEmpty(userId) && (item?.cw || item?.sharedType === 'PUBLIC')) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ summaryLoading: true, summary: null })
      TestsApi.getSummary(item._id)
        .then((summary) => {
          this.setState({ summary, summaryLoading: false })
        })
        .catch((e) => {
          console.warn('error loading tests', e)
          this.setState({ summaryLoading: false })
        })
    }
  }

  onShareModalChange = () => {
    this.setState((prevState) => ({
      showShareModal: !prevState.showShareModal,
    }))
  }

  render() {
    const {
      isShow,
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
      publicAccess = false,
      isPublisherUser,
      isDynamicTest,
      handleLikeTest,
      isTestLiked,
      collectionName,
      interestedCurriculums,
      writableCollections,
      isDemoPlaygroundUser,
      isCurator,
    } = this.props
    const {
      title = '',
      description = '',
      tags = [],
      grades = [],
      subjects: _subjects,
      thumbnail = '',
      analytics = [],
      itemGroups = [],
      alignment = [],
      permission,
      _source,
      authors,
      sharedWith,
      collections: _collections = [],
      isDocBased,
      derivedFromPremiumBankId = false,
    } = item
    let { summary = {} } = item
    if (this.state.summary) {
      summary = this.state.summary
    }
    const { editedCollections, showCloneOptions, showShareModal } = this.state

    const modalStyles = {
      modal: {
        background: white,
        padding: '20px 40px',
        width:
          windowWidth < 768 ? '100%' : windowWidth < 1200 ? '750px' : '920px',
        maxWidth: 'unset',
        borderRadius: '5px',
      },
    }

    const gradesMap = {
      TK: 'PreKindergarten',
      K: 'Kindergarten',
      1: 'Grade 1',
      2: 'Grade 2',
      3: 'Grade 3',
      4: 'Grade 4',
      5: 'Grade 5',
      6: 'Grade 6',
      7: 'Grade 7',
      8: 'Grade 8',
      9: 'Grade 9',
      10: 'Grade 10',
      11: 'Grade 11',
      12: 'Grade 12',
      O: 'Other',
    }

    const targetGrades = Array.isArray(grades) ? grades : [grades]
    const selectedGrades = targetGrades
      .map((grade) => gradesMap[grade])
      .filter((g) => g)
    const subjects = _subjects ? _subjects.filter((f) => !!f) : []
    const gradeSubject = { grades: targetGrades, subjects }
    const isEdulasticCurator = userRole === roleuser.EDULASTIC_CURATOR
    const premiumOrgCollections = collections.filter(
      ({ _id }) =>
        !Object.keys(nonPremiumCollectionsToShareContent).includes(_id)
    )
    const testItems = (itemGroups || []).flatMap(
      (itemGroup) => itemGroup.items || []
    )
    const hasPremiumQuestion = !!testItems.find((i) =>
      hasUserGotAccessToPremiumItem(i.collections, premiumOrgCollections)
    )
    const isCollectionContentEditable = isContentOfCollectionEditable(
      _collections,
      writableCollections
    )
    const isDeleteAllowed =
      !!find(authors, (o) => o._id === userId) ||
      (sharedWith?.find((x) => x._id === userId) && permission === 'EDIT') ||
      isEdulasticCurator ||
      isCollectionContentEditable

    const hasCollectionAccess = allowContentEditCheck(
      _collections,
      writableCollections
    )
    const interestedStandards = getInterestedStandards(
      summary,
      alignment,
      interestedCurriculums
    )
    const standards = interestedStandards?.map((x) => x.identifier)
    const owner = authors.some((o) => o._id === userId)
    const contanier = (
      <>
        <ModalHeader>
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
            <EduIf
              condition={
                (owner || isCurator) &&
                !isEdulasticCurator &&
                !derivedFromPremiumBankId
              }
            >
              <EduButton
                ml="5px"
                isGhost
                height="32px"
                width="32px"
                disabled={isDemoPlaygroundUser}
                title={
                  isDemoPlaygroundUser
                    ? 'This feature is not available in demo account.'
                    : ''
                }
                onClick={this.onShareModalChange}
                data-cy="share"
              >
                <IconShare />
              </EduButton>
            </EduIf>
          </ModalTitle>
          {modalView && (
            <>
              <RightButtonContainer>
                <CloseButton onClick={this.handleModalClose}>
                  <IconClose
                    data-cy="closeTestPopUp"
                    height="18px"
                    width="18px"
                  />
                </CloseButton>
              </RightButtonContainer>
            </>
          )}
        </ModalHeader>
        <ModalContainer>
          <ModalColumn data-cy="modalColumn">
            <Image src={thumbnail} />
          </ModalColumn>

          <ModalColumn justify="center" ref={this.modalRef}>
            {showCloneOptions ? (
              <CloneOptions
                fallback={<Progress />}
                hideOptions={this.hideCloneOptions}
                onDuplicate={onDuplicate}
                status={status}
              />
            ) : (
              <>
                {!publicAccess && (
                  <ButtonContainer>
                    <EduButton
                      isGhost
                      height="40px"
                      width="100%"
                      style={{ justifyContent: 'center' }}
                      data-cy="details-button"
                      onClick={() => {
                        onEdit()
                      }}
                    >
                      <IconDescription />
                      <span>DETAILS</span>
                    </EduButton>
                    <EduIf
                      condition={
                        allowDuplicate &&
                        !derivedFromPremiumBankId &&
                        !isEdulasticCurator
                      }
                    >
                      <EduButton
                        isGhost
                        height="40px"
                        width="100%"
                        style={{ justifyContent: 'center' }}
                        data-cy="duplicate-button"
                        disabled={isDemoPlaygroundUser}
                        title={
                          isDemoPlaygroundUser
                            ? 'This feature is not available in demo account.'
                            : ''
                        }
                        onClick={() => {
                          this.setState({ showCloneOptions: true })
                        }}
                      >
                        <IconCopy />
                        <span>CLONE</span>
                      </EduButton>
                    </EduIf>

                    {status === 'inreview' && hasCollectionAccess ? (
                      <FeaturesSwitch
                        inputFeatures="isCurator"
                        actionOnInaccessible="hidden"
                      >
                        <EduButton
                          isGhost
                          height="40px"
                          width="100%"
                          style={{ justifyContent: 'center' }}
                          data-cy="reject-button"
                          onClick={() => {
                            onReject()
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
                        style={{ justifyContent: 'center' }}
                        data-cy="delete-button"
                        onClick={() => onDelete()}
                      >
                        <IconTrashAlt />
                        <span>DELETE</span>
                      </EduButton>
                    ) : null}
                  </ButtonContainer>
                )}
                {!publicAccess && hasCollectionAccess && (
                  <ButtonContainer>
                    {status === 'inreview' || status === 'rejected' ? (
                      <FeaturesSwitch
                        inputFeatures="isCurator"
                        actionOnInaccessible="hidden"
                      >
                        <EduButton
                          isGhost
                          height="40px"
                          data-cy="approve-button"
                          onClick={() => {
                            onApprove(
                              editedCollections !== null
                                ? editedCollections
                                : _collections
                            )
                          }}
                        >
                          <Icon type="check" />
                          <span>Approve</span>
                        </EduButton>
                      </FeaturesSwitch>
                    ) : null}
                  </ButtonContainer>
                )}
                <ButtonContainer
                  className={publicAccess ? 'public-access-btn-wrapper' : ''}
                >
                  <EduButton
                    height="40px"
                    width="100%"
                    isGhost
                    justifyContent="center"
                    data-cy="preview-button"
                    onClick={previewLink}
                  >
                    {!publicAccess && <IconEye />}
                    Preview
                  </EduButton>
                  {publicAccess && (
                    <AuthorCompleteSignupButton
                      renderButton={(handleClick) => (
                        <EduButton
                          height="40px"
                          width="100%"
                          justifyContent="center"
                          data-cy="edit/assign-button"
                          onClick={handleClick}
                        >
                          <span>ASSIGN</span>
                        </EduButton>
                      )}
                      onClick={assign}
                    />
                  )}
                  {permission !== 'VIEW' &&
                    !isEdulasticCurator &&
                    !publicAccess &&
                    status !== 'published' &&
                    hasCollectionAccess && (
                      <EduButton
                        height="40px"
                        width="100%"
                        justifyContent="center"
                        data-cy="edit/assign-button"
                        onClick={onEdit}
                      >
                        <IconPencilEdit height={14} />
                        <span>EDIT</span>
                      </EduButton>
                    )}
                  {status === 'published' &&
                    !isEdulasticCurator &&
                    !publicAccess &&
                    !isPublisherUser && (
                      <AuthorCompleteSignupButton
                        renderButton={(handleClick) => (
                          <EduButton
                            height="40px"
                            width="100%"
                            justifyContent="center"
                            data-cy="edit/assign-button"
                            onClick={handleClick}
                          >
                            <IconAssignment />
                            <span>ASSIGN</span>
                          </EduButton>
                        )}
                        onClick={assign}
                      />
                    )}
                </ButtonContainer>
                {status === 'inreview' || status === 'rejected' ? (
                  <FeaturesSwitch
                    inputFeatures="isCurator"
                    actionOnInaccessible="hidden"
                  >
                    <ButtonContainer>
                      <StyledSelect
                        mode="multiple"
                        size="medium"
                        style={{ width: '100%' }}
                        value={
                          editedCollections !== null
                            ? editedCollections.map((o) => o._id)
                            : _collections.map((o) => o._id)
                        }
                        filterOption={(input, option) =>
                          option.props.title
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
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
              </>
            )}
          </ModalColumn>
          <ModalColumn>
            <div>
              <AssessmentNameLabel>Test Name</AssessmentNameLabel>
              {isDynamicTest && (
                <DynamicIconWrapper title="SmartBuild Test. Every student might get different items in assignment">
                  <IconDynamic color={greyThemeDark2} />
                  &nbsp;&nbsp; SMARTBUILD TEST
                </DynamicIconWrapper>
              )}
            </div>
            <AssessmentName data-cy="testcard-name">{title}</AssessmentName>

            <DescriptionLabel data-cy="testcard-description">
              Description
            </DescriptionLabel>
            <Description>{description}</Description>

            <Row gutter={10}>
              <Col span={12}>
                <GradeLabel>Grade</GradeLabel>
                <GradeConatiner data-cy="testcard-grades">
                  {!!selectedGrades.length && (
                    <Tags
                      isGrayTags
                      tags={selectedGrades}
                      show={2}
                      key="grades"
                    />
                  )}
                </GradeConatiner>
              </Col>
              <Col span={12} data-cy="testcard-subject">
                <SubjectLabel>Subject</SubjectLabel>
                {subjects && (
                  <Tags isGrayTags tags={subjects} show={1} key="subjects" />
                )}
              </Col>
            </Row>

            <TagsLabel>Tags</TagsLabel>
            <TagsConatiner data-cy="testcard-tags">
              {tags && <Tags isCustomTags tags={tags} show={2} key="tags" />}
            </TagsConatiner>

            <Footer>
              <FooterIcon>
                <IconWorldWide color={darkGrey} width={14} height={14} />
                <IconText data-cy="testcard-collection">
                  {collectionName}
                </IconText>
              </FooterIcon>
              <FooterIcon rotate>
                <IconUsers color={darkGrey} width={14} height={14} />
                {analytics && <IconText>{analytics[0]?.usage || 0} </IconText>}
              </FooterIcon>
              <LikeIconStyled
                isLiked={isTestLiked}
                onClick={handleLikeTest}
                style={{ marginLeft: '10px' }}
              >
                <IconHeart
                  color={isTestLiked ? '#ca481e' : darkGrey}
                  width={14}
                  height={14}
                />
                {analytics && <IconText>{analytics[0]?.likes || 0}</IconText>}
              </LikeIconStyled>
            </Footer>
          </ModalColumn>
          <ModalColumn>
            <SummaryContainer>
              <SummaryTitle>Summary</SummaryTitle>
              <SummaryCardContainer>
                <SummaryCard data-cy="testcard-total-items">
                  <SummaryCardValue>
                    {isPlaylist
                      ? _source.modules && _source.modules.length
                      : /**
                         * for doc based, we need to consider questions as items
                         */
                        (isDocBased
                          ? summary.totalQuestions
                          : summary.totalItems) || 0}
                  </SummaryCardValue>
                  <SummaryCardLabel>
                    {isDocBased ? 'Questions' : 'Items'}
                  </SummaryCardLabel>
                </SummaryCard>
                <SummaryCard data-cy="testcard-total-points">
                  <SummaryCardValue>{summary.totalPoints}</SummaryCardValue>
                  <SummaryCardLabel>Points</SummaryCardLabel>
                </SummaryCard>
              </SummaryCardContainer>
            </SummaryContainer>
            {this.state.summaryLoading ? (
              <Spin />
            ) : (
              <PerfectScrollbar>
                {item?.testCategory ===
                testConstants.testCategoryTypes.DYNAMIC_TEST ? (
                  summary?.groupSummary?.map((group, i) => {
                    return (
                      <>
                        <GroupName>{itemGroups[i]?.groupName}</GroupName>
                        <SummaryCardContainer>
                          <GroupSummaryCard>
                            <GroupSummaryCardValue>
                              {group.totalItems}
                            </GroupSummaryCardValue>
                            <SummaryCardLabel>Items</SummaryCardLabel>
                          </GroupSummaryCard>
                          <GroupSummaryCard>
                            <Tags
                              tags={standards}
                              key="standards"
                              show={2}
                              isStandards
                            />
                          </GroupSummaryCard>
                        </SummaryCardContainer>
                      </>
                    )
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
                        (data) =>
                          standards.includes(data.identifier) && (
                            <ListRow data-cy={data.identifier}>
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
                        <ListCell>
                          {summary.noStandards.totalQuestions}
                        </ListCell>
                        <ListCell>{summary.noStandards.totalPoints}</ListCell>
                      </ListRow>
                    )}
                  </SummaryList>
                )}
              </PerfectScrollbar>
            )}
          </ModalColumn>
          {showShareModal && (
            <ShareModal
              shareLabel="TEST URL"
              isVisible={showShareModal}
              testId={item._id}
              testVersionId={item.versionId}
              hasPremiumQuestion={hasPremiumQuestion}
              isPublished={status === statusConstants.PUBLISHED}
              onClose={this.onShareModalChange}
              gradeSubject={gradeSubject}
            />
          )}
        </ModalContainer>
      </>
    )

    if (modalView) {
      return (
        <Modal
          open={isShow}
          onClose={this.handleModalClose}
          styles={modalStyles}
          showCloseIcon={false}
        >
          {contanier}
        </Modal>
      )
    }
    return contanier
  }
}

export default connect(
  (state) => ({
    userId: getUserIdSelector(state),
    collections: getCollectionsSelector(state),
    userRole: getUserRole(state),
    isPublisherUser: isPublisherUserSelector(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    writableCollections: getWritableCollectionsSelector(state),
    isDemoPlaygroundUser: state?.user?.user?.isPlayground,
    isCurator: getIsCurator(state),
  }),
  {}
)(ViewModal)
