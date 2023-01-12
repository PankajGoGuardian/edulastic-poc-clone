import { uniqBy } from 'lodash'
import {
  cardTitleColor,
  darkGrey,
  fadedBlack,
  themeColor,
} from '@edulastic/colors'
import {
  CheckboxLabel,
  MathFormulaDisplay,
  PremiumTag,
  LikeIconStyled,
  EduButton,
  FlexContainer,
  EduIf,
} from '@edulastic/common'
import { test } from '@edulastic/constants'
import {
  IconClose,
  IconEye,
  IconHeart,
  IconId,
  IconUser,
  IconDynamic,
  IconUsers,
  IconPlus,
} from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Col } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import TestPreviewModal from '../../../Assignments/components/Container/TestPreviewModal'
import {
  getAuthorCollectionMap,
  flattenPlaylistStandards,
  showPremiumLabelOnContent,
} from '../../../dataUtils'
import {
  ViewButton as ViewButtonContainer,
  ViewButtonStyled,
  AddRemoveButton,
} from '../../../ItemList/components/Item/styled'
import Tags from '../../../src/components/common/Tags'
import {
  isCoTeacherSelector,
  getCollectionsSelector,
  getUserId,
  getCollectionsToAddContent,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
} from '../../../src/selectors/user'
import {
  approveOrRejectSingleTestRequestAction,
  getSelectedTestsSelector,
  toggleTestLikeAction,
} from '../../ducks'
import { EllipsisWrapper, ViewButton } from '../Item/styled'
import TestStatusWrapper from '../TestStatusWrapper/testStatusWrapper'
import ViewModal from '../ViewModal'
import {
  Author,
  AuthorName,
  CardId,
  CardIdWrapper,
  Container,
  ContentWrapper,
  Description,
  Footer,
  Header,
  IconText,
  IconWrapper,
  Inner,
  ItemInformation,
  ListCard,
  Outer,
  Stars,
  StyledLinkExt,
  StyledModuleName,
  TagsWrapper,
  TestStatus,
  ViewButtonWrapper,
  DynamicIconWrapper,
  AddRemove,
} from './styled'
import { allowDuplicateCheck } from '../../../src/utils/permissionCheck'
import { sharedTypeMap } from '../Item/Item'
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../../../student/Login/ducks'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'
import { getIsPreviewModalVisibleSelector } from '../../../../assessment/selectors/test'
import { DeleteItemModal } from '../DeleteItemModal/deleteItemModal'
import { duplicateTestRequestAction } from '../../../TestPage/ducks'

const certifiedUserIcon = getAuthorCollectionMap(true, 30, 30, "author's name")
  .edulastic_certified.icon
const certifiedIcon = getAuthorCollectionMap(true, 30, 30, 'certified test')
  .edulastic_certified.icon

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    authorName: PropTypes.string,
    owner: PropTypes.object,
    testItemId: PropTypes.string,
    orgCollections: PropTypes.array.isRequired,
    isPreviewModalVisible: PropTypes.bool,
  }

  static defaultProps = {
    authorName: '',
    owner: {},
    isPreviewModalVisible: false,
    testItemId: '',
  }

  state = {
    isOpenModal: false,
    isDeleteModalOpen: false,
  }

  moveToItem = (e) => {
    e && e.stopPropagation()
    const { history, item, mode, isPlaylist } = this.props
    if (mode === 'embedded') return
    if (isPlaylist) {
      history.push(`/author/playlists/${item._id}#review`)
    } else {
      const tab = item.title ? 'review' : 'description'
      history.push({
        pathname: `/author/tests/tab/${tab}/id/${item._id}`,
        state: {
          editTestFlow: true,
        },
      })
    }
  }

  duplicate = (cloneOption) => {
    const { item, duplicateTest } = this.props
    const { _id, title } = item || {}
    if (_id && title) {
      duplicateTest({
        _id,
        title,
        redirectToNewTest: true,
        cloneItems: cloneOption,
      })
    }
  }

  closeModal = () => {
    this.setState({ isOpenModal: false })
  }

  assignTest = (e) => {
    e && e.stopPropagation()
    const {
      history,
      item,
      toggleAdminAlertModal,
      emailVerified,
      verificationTS,
      isDefaultDA,
      toggleVerifyEmailModal,
      isFreeAdmin,
      isSAWithoutSchools,
    } = this.props
    let expiryDate
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
    }
    if (isFreeAdmin || isSAWithoutSchools) toggleAdminAlertModal()
    else if (expiryDate && expiryDate < Date.now() && !isDefaultDA) {
      toggleVerifyEmailModal(true)
    } else
      history.push({
        pathname: `/author/assignments/${item._id}`,
        state: {
          from: 'testLibrary',
          fromText: 'Test Library',
          toUrl: '/author/tests',
        },
      })
  }

  openModal = () => {
    this.setState({ isOpenModal: true })
  }

  hidePreviewModal = () => {
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(false)
    this.setState({ currentTestId: '' })
  }

  showPreviewModal = (testId) => {
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(true)
    this.setState({ currentTestId: testId })
  }

  onApprove = (newCollections = []) => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequest,
    } = this.props
    approveOrRejectSingleTestRequest({
      testId,
      status: 'published',
      collections: newCollections,
    })
  }

  onReject = () => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequest,
    } = this.props
    approveOrRejectSingleTestRequest({ testId, status: 'rejected' })
  }

  handleLikeTest = (e) => {
    e.stopPropagation()
    const { item, toggleTestLikeRequest, isTestLiked } = this.props
    toggleTestLikeRequest({
      contentId: item._id,
      contentType: 'TEST',
      toggleValue: !isTestLiked,
      versionId: item.versionId,
    })
  }

  handleAddRemoveToCart = (item, isInCart) => (evt) => {
    const { onRemoveFromCart, onAddToCart } = this.props
    if (evt) {
      evt.stopPropagation()
    }
    if (isInCart) {
      onRemoveFromCart(item)
    } else {
      onAddToCart(item)
    }
  }

  onDeleteModelCancel = () => {
    this.setState({ isDeleteModalOpen: false })
  }

  onDelete = async (e) => {
    e && e.stopPropagation()
    this.setState({ isDeleteModalOpen: true })
  }

  render() {
    const {
      item: {
        title,
        tags = [],
        _source = {},
        status: testStatus,
        description,
        thumbnail,
        collections = [],
        sharedType,
      },
      item,
      authorName,
      owner: isOwner = false,
      testItemId,
      windowWidth,
      isPlaylist,
      isTestAdded,
      mode,
      removeTestFromPlaylist,
      addTestToPlaylist,
      standards,
      handleCheckboxAction,
      checked,
      moduleTitle,
      selectedTests = [],
      t: translate,
      isCoTeacher,
      orgCollections = [],
      currentUserId,
      isTestLiked,
      isPreviewModalVisible,
    } = this.props
    const { analytics = [] } = isPlaylist ? _source : item
    const likes = analytics?.[0]?.likes || '0'
    const usage = analytics?.[0]?.usage || '0'
    const standardsIdentifiers = isPlaylist
      ? flattenPlaylistStandards(_source?.modules)
      : standards.map((_item) => _item.identifier)
    const { isOpenModal, currentTestId, isDeleteModalOpen } = this.state
    const thumbnailData = isPlaylist ? _source.thumbnail : thumbnail
    const isInCart = !!selectedTests.find((o) => o._id === item._id)
    const allowDuplicate =
      allowDuplicateCheck(
        collections,
        orgCollections,
        isPlaylist ? 'playList' : 'test'
      ) || isOwner

    const showPremiumTag =
      showPremiumLabelOnContent(
        isPlaylist ? _source.collections : collections,
        orgCollections
      ) &&
      !isCoTeacher &&
      !(_source?.createdBy?._id === currentUserId)

    const isDynamicTest =
      !isPlaylist &&
      (item?.testCategory === test.testCategoryTypes.DYNAMIC_TEST ||
        // TODO: fallback conditions to be removed after migration for testCategory
        item?.itemGroups?.some(
          (group) =>
            group.type === test.ITEM_GROUP_TYPES.AUTOSELECT ||
            group.deliveryType === test.ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        ))

    let collectionName = 'PRIVATE'
    if (collections?.length > 0 && orgCollections.length > 0) {
      let filteredCollections = orgCollections?.filter((c) =>
        collections?.find((i) => i._id === c._id)
      )
      filteredCollections = uniqBy(filteredCollections, '_id')
      if (filteredCollections?.length > 0)
        collectionName = filteredCollections?.map((c) => c.name).join(', ')
    } else if (
      collections?.length &&
      collections?.find((o) => o.name === 'Edulastic Certified')
    ) {
      collectionName = 'Edulastic Certified'
    } else if (sharedType) {
      // sharedType comes as number when "Shared with me" filter is selected
      if (!Number.isNaN(+sharedType)) {
        collectionName = sharedTypeMap[+sharedType]
      } else {
        collectionName = sharedType
      }
    }
    const cardTitle = (
      <Header src={thumbnailData}>
        {isPlaylist && <Stars size="small" />}
      </Header>
    )
    const isCertified = !!collections.find(
      (o) => o.name === 'Edulastic Certified'
    )

    return (
      <Container>
        <EduIf condition={isOpenModal}>
          <ViewModal
            isShow={isOpenModal}
            close={this.closeModal}
            item={item}
            status={testStatus}
            onEdit={this.moveToItem}
            onDuplicate={this.duplicate}
            onReject={this.onReject}
            onApprove={this.onApprove}
            assign={this.assignTest}
            isPlaylist={isPlaylist}
            windowWidth={windowWidth}
            allowDuplicate={allowDuplicate}
            onDelete={this.onDelete}
            previewLink={() => this.showPreviewModal(item._id)}
            isDynamicTest={isDynamicTest}
            handleLikeTest={this.handleLikeTest}
            isTestLiked={isTestLiked}
            collectionName={collectionName}
          />
        </EduIf>
        <EduIf condition={isPreviewModalVisible && currentTestId}>
          <TestPreviewModal
            isModalVisible={isPreviewModalVisible}
            testId={currentTestId}
            showStudentPerformance
            closeTestPreviewModal={this.hidePreviewModal}
            resetOnClose={() => {
              this.setState({ currentTestId: '' })
            }}
            unmountOnClose
          />
        </EduIf>
        <EduIf condition={isDeleteModalOpen}>
          <DeleteItemModal
            isVisible={isDeleteModalOpen}
            onCancel={this.onDeleteModelCancel}
            testId={item._id}
            test={item}
            view="testLibrary"
          />
        </EduIf>
        <ContentWrapper>
          <Col span={24}>
            <Outer>
              <FlexContainer
                width="100%"
                justifyContent="flex-start"
                onClick={
                  isPlaylist
                    ? (e) => this.moveToItem(e)
                    : mode === 'embedded'
                    ? ''
                    : this.openModal
                }
              >
                <ListCard title={cardTitle} />

                <Inner>
                  <StyledLinkExt data-cy="test-title" title={title}>
                    {isPlaylist ? _source.title : title}
                  </StyledLinkExt>
                  <Description data-cy="test-description">
                    <EllipsisWrapper view="list">
                      <EduIf condition={isPlaylist}>
                        <MathFormulaDisplay
                          dangerouslySetInnerHTML={{
                            __html: _source.description,
                          }}
                        />
                      </EduIf>
                      <EduIf condition={!isPlaylist}>{description}</EduIf>
                    </EllipsisWrapper>
                  </Description>
                </Inner>
              </FlexContainer>
              <EduIf condition={!isPlaylist && mode === 'embedded'}>
                <ViewButtonWrapper span={6}>
                  <EduIf condition={!isTestAdded && mode === 'embedded'}>
                    <ViewButton
                      onClick={() =>
                        addTestToPlaylist({
                          ...item,
                          standardIdentifiers: standardsIdentifiers,
                        })
                      }
                    >
                      ADD
                    </ViewButton>
                    <ViewButton
                      isTestAdded={isTestAdded}
                      onClick={() => this.showPreviewModal(item._id)}
                    >
                      VIEW
                    </ViewButton>
                  </EduIf>
                  <EduIf condition={isTestAdded && mode === 'embedded'}>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.showPreviewModal(item._id)}
                      title="Preview"
                    >
                      <IconEye color={themeColor} width={60} />
                    </div>
                    <StyledModuleName>
                      <span style={{ width: '100%', textAlign: 'center' }}>
                        {moduleTitle}
                      </span>
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeTestFromPlaylist(item._id)}
                      >
                        <IconClose color={fadedBlack} width={10} />
                      </div>
                    </StyledModuleName>
                  </EduIf>
                  <CheckboxLabel
                    onChange={(e) =>
                      handleCheckboxAction(e, {
                        _id: item._id,
                        title: item.title,
                      })
                    }
                    checked={checked}
                  />
                </ViewButtonWrapper>
              </EduIf>
              <EduIf condition={isPlaylist}>
                <ViewButtonContainer
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <EduButton
                    style={{ marginRight: '10px' }}
                    isGhost
                    data-cy="view"
                    onClick={(e) => this.moveToItem(e)}
                  >
                    Details
                  </EduButton>
                  <AddRemove selectedToCart={checked}>
                    <CheckboxLabel
                      style={{ display: 'none' }}
                      onChange={(e) => handleCheckboxAction(e, item._id)}
                      checked={checked}
                    />
                    <EduIf condition={checked}>
                      <IconClose />
                    </EduIf>
                    <EduIf condition={!checked}>
                      <IconPlus />
                    </EduIf>
                  </AddRemove>
                </ViewButtonContainer>
              </EduIf>
              <EduIf
                condition={!isPlaylist && mode !== 'embedded' && isCoTeacher}
              >
                <ViewButtonContainer>
                  <ViewButtonStyled
                    data-cy="view"
                    onClick={() => this.showPreviewModal(item._id)}
                  >
                    <IconEye aria-hidden focusable={false} />
                    {translate('component.itemlist.preview')}
                  </ViewButtonStyled>
                  <AddRemoveButton
                    data-cy="addRemoveButton"
                    onClick={this.handleAddRemoveToCart(item, isInCart)}
                    selectedToCart={isInCart}
                  >
                    <EduIf condition={isInCart}>
                      <IconClose aria-label="remove test from cart" />
                    </EduIf>
                    <EduIf condition={!isInCart}>
                      <IconPlus aria-label="add test to cart" />
                    </EduIf>
                  </AddRemoveButton>
                </ViewButtonContainer>
              </EduIf>
            </Outer>
          </Col>

          <Footer span={24}>
            <TagsWrapper data-cy="test-standards" span={12}>
              <Tags tags={tags} show={1} key="tags" />
              <EduIf condition={tags.length && standardsIdentifiers.length}>
                <span style={{ marginRight: '10px' }} />
              </EduIf>
              <Tags
                tags={standardsIdentifiers}
                show={1}
                key="standards"
                isStandards
              />
              <TestStatusWrapper
                status={testStatus || _source?.status}
                checkUser={false}
              >
                {({ children, ...rest }) => (
                  <TestStatus
                    data-cy="test-status"
                    style={{
                      marginLeft:
                        tags.length ||
                        (standardsIdentifiers && standardsIdentifiers.length)
                          ? '10px'
                          : 0,
                    }}
                    {...rest}
                  >
                    {children}
                  </TestStatus>
                )}
              </TestStatusWrapper>
              <EduIf condition={isCertified}>{certifiedIcon}</EduIf>
              <EduIf condition={isDynamicTest}>
                <DynamicIconWrapper title="SmartBuild Test. Every student might get different items in assignment">
                  <IconDynamic color={themeColor} />
                </DynamicIconWrapper>
              </EduIf>
            </TagsWrapper>

            <ItemInformation span={12}>
              <ContentWrapper type="flex" align="middle" justify="end">
                <EduIf condition={showPremiumTag}>
                  <PremiumTag />
                </EduIf>
                <EduIf condition={!!authorName}>
                  <Author>
                    <EduIf condition={isCertified}>{certifiedUserIcon}</EduIf>
                    <EduIf condition={!isCertified}>
                      <IconUser
                        color={cardTitleColor}
                        aria-label="author's name"
                      />
                    </EduIf>{' '}
                    &nbsp;
                    <AuthorName data-cy="test-author-name" title={authorName}>
                      {authorName}
                    </AuthorName>
                  </Author>
                </EduIf>
                <CardIdWrapper>
                  <IconId aria-label="Unique Test Id" /> &nbsp;
                  <CardId data-cy="test-id">{testItemId}</CardId>
                </CardIdWrapper>
                <IconWrapper>
                  <IconUsers
                    color={darkGrey}
                    width={14}
                    height={14}
                    aria-label="Followers"
                  />
                  &nbsp;
                  <IconText>{usage}</IconText>
                </IconWrapper>
                <EduIf condition={!isPlaylist}>
                  <LikeIconStyled
                    isLiked={isTestLiked}
                    onClick={this.handleLikeTest}
                    style={{ marginLeft: '20px' }}
                  >
                    <IconHeart
                      color={isTestLiked ? '#ca481e' : darkGrey}
                      width={14}
                      height={14}
                      aria-label="Likes"
                    />
                    <IconText>{likes}</IconText>
                  </LikeIconStyled>
                </EduIf>
              </ContentWrapper>
            </ItemInformation>
          </Footer>
        </ContentWrapper>
      </Container>
    )
  }
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      selectedTests: getSelectedTestsSelector(state),
      orgCollections: getCollectionsSelector(state),
      isCoTeacher: isCoTeacherSelector(state),
      currentUserId: getUserId(state),
      collectionToWrite: getCollectionsToAddContent(state),
      isFreeAdmin: isFreeAdminSelector(state),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      isPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
    }),
    {
      approveOrRejectSingleTestRequest: approveOrRejectSingleTestRequestAction,
      toggleTestLikeRequest: toggleTestLikeAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
      duplicateTest: duplicateTestRequestAction,
    }
  )
)

export default enhance(ListItem)
