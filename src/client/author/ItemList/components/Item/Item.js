import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  IconPlus,
  IconEye,
  IconDown,
  IconVolumeUp,
  IconNoVolume,
  IconDynamic,
  IconClose,
  IconPassage,
  IconRubric,
} from '@edulastic/icons'
import { get } from 'lodash'
import { Row, Icon, Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { question, test as testConstants, roleuser } from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import {
  MathFormulaDisplay,
  PremiumTag,
  helpers,
  WithResources,
  EduButton,
  notification,
  LikeIconStyled,
  FlexContainer,
} from '@edulastic/common'
import { testItemsApi } from '@edulastic/api'

import CollectionTag from '@edulastic/common/src/components/CollectionTag/CollectionTag'
import {
  getTestItemAuthorName,
  getQuestionType,
  getTestItemAuthorIcon,
  showPremiumLabelOnContent,
  isPremiumContent,
} from '../../../dataUtils'
import { MAX_TAB_WIDTH } from '../../../src/constants/others'
import Standards from './Standards'
import Stimulus from './Stimulus'
import {
  Container,
  Categories,
  CategoryContent,
  CategoryName,
  Detail,
  DetailCategory,
  Text,
  Label,
  LabelText,
  Question,
  QuestionContent,
  TypeCategory,
  ViewButton,
  ViewButtonStyled,
  CheckboxWrapper,
  HeartIcon,
  ShareIcon,
  IdIcon,
  MoreInfo,
  Details,
  AddRemoveBtn,
  AddRemoveButton,
  AddRemoveBtnPublisher,
  PassageTitle,
  PassageTitleContainer,
  StyledRow,
  PassageInfo,
  PassageIconContainer,
} from './styled'
import {
  setAndSavePassageItemsAction,
  getPassageItemsCountSelector,
  setPassageItemsAction,
  isDynamicTestSelector,
  hasSectionsSelector,
} from '../../../TestPage/ducks'
import { getUserFeatures } from '../../../../student/Login/ducks'
import PassageConfirmationModal from '../../../TestPage/components/PassageConfirmationModal/PassageConfirmationModal'
import Tags from '../../../src/components/common/Tags'
import appConfig from '../../../../../app-config'
import SelectGroupModal from '../../../TestPage/components/AddItems/SelectGroupModal'
import {
  getCollectionsSelector,
  isPublisherUserSelector,
  getUserRole,
} from '../../../src/selectors/user'
import {
  TestStatus,
  DynamicIconWrapper,
} from '../../../TestList/components/ListItem/styled'
import { toggleTestItemLikeAction } from '../../ducks'
import TestStatusWrapper from '../../../TestList/components/TestStatusWrapper/testStatusWrapper'
import { WithToolTip } from './AddOrRemove'
import { getAllRubricNames } from '../../../src/utils/util'
import getItemStimulus from '../../../utils/itemStimulus'

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = testConstants

// render single item
class Item extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenedDetails: false,
      passageConfirmModalVisible: false,
      selectedId: '',
    }
  }

  moveToItem = () => {
    const { history, item, t } = this.props
    history.push({
      pathname: `/author/items/${item._id}/item-detail`,
      state: {
        backText: t('component.itemAdd.backToItemList'),
        backUrl: '/author/items',
        itemDetail: true,
      },
    })
  }

  handleToggleItemToCart = (item) => async () => {
    const { onToggleToCart, setPassageItems } = this.props
    if (item.passageId) {
      let passageItems = await testItemsApi.getPassageItems(item.passageId)
      // filtering inactive items from passage | EV-29823
      passageItems = passageItems.filter((testItem) => testItem?.active)
      setPassageItems(passageItems)

      if (passageItems.length > 1) {
        return this.setState({
          passageConfirmModalVisible: true,
        })
      }
    }
    onToggleToCart(item)
  }

  get description() {
    const { item } = this.props
    return get(item, 'rows[0].widgets[0].entity.stimulus', '')
  }

  get itemStimulus() {
    const { item } = this.props
    const stimulus = getItemStimulus(item)
    return helpers.sanitizeForReview(stimulus)
  }

  get getRubricNames() {
    const { item } = this.props
    const allRubricNames = getAllRubricNames(item)
    const namesCount = allRubricNames.length
    if (namesCount) {
      if (namesCount > 3) {
        return `${allRubricNames.slice(0, 3).join(', ')} +${namesCount - 3}`
      }
      return allRubricNames.join(', ')
    }
    return ''
  }

  handleStimulusClick = () => {
    const {
      features,
      item,
      userId,
      history,
      openPreviewModal,
      isDynamicTest,
    } = this.props
    const owner = item.authors && item.authors.some((x) => x._id === userId)
    // Author can only edit if owner
    if (features.isPublisherAuthor && owner) {
      if (isDynamicTest) {
        return notification({
          msg: 'Editing is disabled for test items in SmartBuild',
        })
      }
      return history.push(`/author/items/${item._id}/item-detail`)
    }
    openPreviewModal()
  }

  handleLike = (isLiked) => {
    const { toggleTestItemLikeRequest, item } = this.props
    toggleTestItemLikeRequest({
      contentId: item._id,
      contentType: 'TESTITEM',
      toggleValue: !isLiked,
      versionId: item.versionId,
    })
  }

  renderDetails = () => {
    const { item, windowWidth, collections, isPublisherUser } = this.props
    const questions = get(item, 'data.questions', [])
    const isRubricAttached = questions.some((q) => q?.rubrics)
    const getAllTTS = questions
      .filter((_item) => _item.tts)
      .map((_item) => _item.tts)
    const isItemLiked = item?.alreadyLiked || false
    const dok = (questions.find((_item) => _item.depthOfKnowledge) || {})
      .depthOfKnowledge
    const details = [
      {
        name: 'DOK:',
        text: question.allDepthOfKnowledgeMap[dok]?.text,
        dataCy: 'itemDok',
      },
      {
        name: getTestItemAuthorIcon(item, collections),
        text: getTestItemAuthorName(item, collections),
        dataCy: 'authorName',
      },
      {
        name: <IdIcon />,
        text: item._id,
        type: 'id',
        dataCy: 'itemId',
      },
      {
        name: windowWidth > 1024 ? <ShareIcon /> : '',
        text: windowWidth > 1024 ? item?.analytics?.[0]?.usage || '0' : '',
      },
      {
        name: (
          <LikeIconStyled
            className="like-icon"
            isLiked={isItemLiked}
            title={isItemLiked ? 'Unlike' : 'Like'}
            isEnabled={isItemLiked}
            onClick={() => this.handleLike(isItemLiked)}
          >
            <HeartIcon />
          </LikeIconStyled>
        ),
        text: item?.analytics?.[0]?.likes || '0',
        type: 'like',
        dataCy: 'likeButton',
      },
    ]
    if (getAllTTS.length) {
      const ttsSuccess =
        getAllTTS.filter((_item) => _item.taskStatus !== 'COMPLETED').length ===
        0
      const ttsStatusSuccess = {
        name: ttsSuccess ? <IconVolumeUp /> : <IconNoVolume />,
        text: ' ',
      }
      details.push(ttsStatusSuccess)
    }

    if (isRubricAttached) {
      details.unshift({
        name: (
          <Tooltip title={this.getRubricNames}>
            <IconRubric className="rubric-icon" />
          </Tooltip>
        ),
        text: ' ',
        dataCy: 'rubricIcon',
      })
    }

    if (
      !isPublisherUser &&
      showPremiumLabelOnContent(item.collections, collections)
    ) {
      details.unshift({ name: <PremiumTag />, type: 'premium' })
    }

    return details.map(
      (detail, index) =>
        (detail.text || detail.type === 'premium') &&
        detail.text && (
          <DetailCategory
            isLiked={isItemLiked}
            data-cy={`${detail.dataCy}`}
            key={`DetailCategory_${index}`}
          >
            <CategoryName>{detail.name}</CategoryName>
            {detail.type !== 'premium' && (
              <CategoryContent>
                <Text title={detail.type === 'id' ? detail.text : ''}>
                  {detail.type === 'id'
                    ? detail.text.substr(detail.text.length - 6)
                    : detail.text}
                </Text>
              </CategoryContent>
            )}
          </DetailCategory>
        )
    )
  }

  toggleDetails = () => {
    const { isOpenedDetails } = this.state

    this.setState({
      isOpenedDetails: !isOpenedDetails,
    })
  }

  handleSelection = async (row) => {
    const {
      setTestItems,
      setDataAndSave,
      selectedRows,
      test,
      gotoSummary,
      setPassageItems,
      item,
      page,
      current,
    } = this.props
    if (!test.title?.trim().length && page !== 'itemList') {
      gotoSummary()
      return notification({ messageKey: 'nameShouldNotEmpty' })
    }

    let keys = []
    if (test.safeBrowser && !test.sebPassword) {
      return notification({ messageKey: 'enterValidPassword' })
    }

    this.setState({ selectedId: item._id })
    if (selectedRows !== undefined) {
      ;(selectedRows || []).forEach((selectedRow, index) => {
        keys[index] = selectedRow
      })
    }
    if (!keys.includes(row._id)) {
      keys[keys.length] = row._id
      if (item.passageId) {
        const passageItems = await testItemsApi.getPassageItems(item.passageId)
        setPassageItems(passageItems)
        if (passageItems.length > 1) {
          return this.setState({
            selectedId: '',
            passageConfirmModalVisible: true,
          })
        }
      }

      setDataAndSave({ addToTest: true, item, current })
      notification({ type: 'success', messageKey: 'itemAddedTest' })
    } else {
      keys = keys.filter((_item) => _item !== row._id)
      setDataAndSave({ addToTest: false, item: { _id: row._id }, current })
      notification({ type: 'success', messageKey: 'itemRemovedTest' })
    }
    setTestItems(keys)
    this.setState({ selectedId: '' })
  }

  handleAddRemove = (item, isAdd) => {
    const {
      test: { itemGroups },
      setCurrentGroupIndex,
      showSelectGroupIndexModal,
      currentGroupIndexValueFromStore,
    } = this.props
    const staticGroups = (itemGroups || []).filter(
      (g) => g.type === ITEM_GROUP_TYPES.STATIC
    )
    if (isAdd) {
      /**
       * For sections test if group index is known, directly add the item to respective index
       * without setting index in store
       * showSelectGroupIndexModal - this value is always "true" for all other tests except sections test
       */
      if (
        staticGroups?.length > 1 &&
        !showSelectGroupIndexModal &&
        typeof currentGroupIndexValueFromStore === 'number'
      ) {
        this.handleSelectGroupModalResponse(currentGroupIndexValueFromStore)
        return
      }
      if (staticGroups?.length === 1) {
        const index = itemGroups.findIndex(
          (g) => g.groupName === staticGroups[0].groupName
        )
        if (
          itemGroups[index]?.deliveryType ===
            ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
          item.itemLevelScoring === false
        ) {
          return notification({ type: 'warn', messageKey: 'itemCantBeAdded' })
        }
        setCurrentGroupIndex(index)
        this.handleSelection(item)
      } else if (staticGroups.length > 1) {
        this.setState({ showSelectGroupModal: true })
      } else {
        return notification({ type: 'warn', messageKey: 'noStaticGroupFound' })
      }
    } else {
      this.handleSelection(item)
    }
  }

  handleSelectGroupModalResponse = (index) => {
    const {
      item,
      setCurrentGroupIndex,
      test: { itemGroups },
    } = this.props
    if (
      itemGroups[index]?.type === ITEM_GROUP_TYPES.STATIC &&
      itemGroups[index]?.deliveryType ===
        ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
      item.itemLevelScoring === false
    ) {
      return notification({ type: 'warn', messageKey: 'thisItemCantBeAdded' })
    }
    if (index || index === 0) {
      setCurrentGroupIndex(index)
      this.handleSelection(item)
    }
    this.setState({ showSelectGroupModal: false })
  }

  get isAddOrRemove() {
    const { item, selectedRows } = this.props
    if (selectedRows && selectedRows.length) {
      return !selectedRows.includes(item?._id)
    }
    return true
  }

  isRemovingForAuthoring() {
    const { item, selectedRows } = this.props
    return selectedRows.includes(item?._id)
  }

  /**
   *  TODO: find a friggin better name for the handler!
   *  handles the user response from the Passage confirmation modal.
   *  {Bool} value: user wants to select all the items?
   */
  handleResponse = (value) => {
    const {
      setAndSavePassageItems,
      passageItems,
      page,
      openPreviewModal,
    } = this.props
    const removing = this.isRemovingForAuthoring()
    this.setState({ passageConfirmModalVisible: false })

    if (value) {
      // add all the passage items to test.
      notification({
        type: 'success',
        msg: removing
          ? `${passageItems.length} Item(s) removed from test`
          : `${passageItems.length} Item(s) added to test`,
      })
      return setAndSavePassageItems({ passageItems, page, remove: removing })
    }
    // open the modal for selecting  testItems manually.
    openPreviewModal()
  }

  get getPassageInfo() {
    const { item } = this.props
    const Title = item?.passageSource ? (
      <>
        <PassageTitle dangerouslySetInnerHTML={{ __html: item.passageTitle }} />{' '}
        by{' '}
        <PassageTitle
          dangerouslySetInnerHTML={{ __html: item.passageSource }}
        />
      </>
    ) : (
      <PassageTitle dangerouslySetInnerHTML={{ __html: item.passageTitle }} />
    )
    return (
      <FlexContainer flexDirection="column">
        <StyledRow>
          <PassageIconContainer md={1}>
            <IconPassage width={15.96} height={19.338} />
          </PassageIconContainer>
          <PassageTitleContainer md={23}>{Title}</PassageTitleContainer>
        </StyledRow>
        <StyledRow>
          {item?.passageItemsCount && (
            <PassageInfo md={7}>
              TOTAL PASSAGE QUESTIONS: {item.passageItemsCount}
            </PassageInfo>
          )}
          {item?.passageLexileValue && (
            <PassageInfo md={7}>
              LEXILE LEVEL: {item.passageLexileValue}
            </PassageInfo>
          )}
          {item?.passageFleschKincaid && (
            <PassageInfo md={7}>
              FLESCH-KINCAID: {item.passageFleschKincaid}
            </PassageInfo>
          )}
        </StyledRow>
      </FlexContainer>
    )
  }

  render() {
    const {
      item,
      t,
      windowWidth,
      selectedToCart,
      search,
      page,
      passageItemsCount,
      test,
      features,
      openPreviewModal,
      userRole,
      userId,
      collections,
      isDynamicTest,
      hasSections,
    } = this.props
    const owner = item.authors && item.authors.some((x) => x._id === userId)
    const {
      isOpenedDetails,
      selectedId,
      passageConfirmModalVisible,
      showSelectGroupModal,
    } = this.state
    const itemTypes = getQuestionType(item)
    const isPublisher = features.isCurator || features.isPublisherAuthor
    const staticGroups =
      test?.itemGroups?.filter((g) => g.type === ITEM_GROUP_TYPES.STATIC) || 0
    const groupName =
      staticGroups.length === 1
        ? 'Selected'
        : test?.itemGroups?.find(
            (grp) => !!grp.items.find((i) => i._id === item._id)
          )?.groupName || 'Section'
    const hideAddRemove = userRole === roleuser.EDULASTIC_CURATOR

    const isDynamicItem = item.data?.questions?.some(
      (q) => q?.variable?.enabled
    )
    const hasQuestions =
      Array.isArray(item?.data?.questions) && item.data.questions.length > 0

    return (
      <WithResources resources={[appConfig.jqueryPath]} fallBack={<span />}>
        <Container data-cy={item._id} className="fr-view">
          {passageConfirmModalVisible && (
            <PassageConfirmationModal
              visible={passageConfirmModalVisible}
              closeModal={() => {
                this.setState(() => ({ passageConfirmModalVisible: false }))
              }}
              itemsCount={passageItemsCount}
              handleResponse={this.handleResponse}
              removing={this.isRemovingForAuthoring()}
            />
          )}
          {showSelectGroupModal && (
            <SelectGroupModal
              visible={showSelectGroupModal}
              test={test}
              handleResponse={this.handleSelectGroupModalResponse}
            />
          )}
          <Question>
            <QuestionContent>
              {item?.isPassageWithQuestions &&
                item?.passageTitle &&
                this.getPassageInfo}
              <Stimulus
                onClickHandler={this.handleStimulusClick}
                stimulus={this.itemStimulus}
              />
              <MathFormulaDisplay
                dangerouslySetInnerHTML={{ __html: this.description }}
              />
            </QuestionContent>
            {windowWidth > MAX_TAB_WIDTH &&
              (page === 'itemList' ? (
                <ViewButton>
                  <EduButton
                    width="100px"
                    height="36px"
                    isGhost
                    onClick={openPreviewModal}
                    data-cy="view"
                  >
                    <IconEye />
                    <span>{t('component.item.view').toUpperCase()}</span>
                  </EduButton>
                  {!hideAddRemove && !hasQuestions ? (
                    <WithToolTip>
                      <AddRemoveButton
                        isGhost
                        IconBtn
                        selectedToCart={selectedToCart}
                        width="60px"
                        height="36px"
                        className="disabled"
                      >
                        {selectedToCart ? <IconClose /> : <IconPlus />}
                      </AddRemoveButton>
                    </WithToolTip>
                  ) : (
                    <AddRemoveButton
                      isGhost
                      IconBtn
                      selectedToCart={selectedToCart}
                      width="60px"
                      height="36px"
                      data-cy="addRemoveButton"
                      onClick={this.handleToggleItemToCart(item)}
                    >
                      {selectedToCart ? <IconClose /> : <IconPlus />}
                    </AddRemoveButton>
                  )}
                </ViewButton>
              ) : // to display the section name instead of remove button on selected items
              isPublisher || isDynamicTest || hasSections ? (
                <>
                  <EduButton
                    width="40px"
                    height="35px"
                    isGhost
                    iconBtn
                    onClick={openPreviewModal}
                    style={{
                      marginTop: '15px',
                      marginRight: '3px',
                      padding: '0px',
                    }}
                  >
                    <IconEye />
                  </EduButton>
                  <AddRemoveBtnPublisher
                    loading={selectedId === item._id}
                    onClick={() =>
                      this.handleAddRemove(item, this.isAddOrRemove)
                    }
                    isAddOrRemove={this.isAddOrRemove}
                    data-cy="addRemoveButton"
                  >
                    {this.isAddOrRemove ? 'ADD' : `${groupName}`}
                    {this.isAddOrRemove ? '' : <Icon type="close" />}
                  </AddRemoveBtnPublisher>
                </>
              ) : (
                <>
                  <EduButton
                    width="40px"
                    height="35px"
                    isGhost
                    iconBtn
                    onClick={openPreviewModal}
                    style={{
                      marginTop: '15px',
                      marginRight: '3px',
                      padding: 0,
                    }}
                  >
                    {/* found 17,3 values by trial & error */}
                    <IconEye />
                  </EduButton>
                  {!hasQuestions && (
                    <WithToolTip>
                      <AddRemoveBtn
                        style={{ width: '70px', height: '35px' }}
                        isAddOrRemove={this.isAddOrRemove}
                        className="disabled"
                        noHover
                        data-cy="addRemoveButton"
                      >
                        {this.isAddOrRemove ? 'ADD' : 'REMOVE'}
                      </AddRemoveBtn>
                    </WithToolTip>
                  )}
                  {hasQuestions && (
                    <AddRemoveBtn
                      style={{ width: '70px', height: '35px' }}
                      loading={selectedId === item._id}
                      onClick={() => {
                        this.handleAddRemove(item, this.isAddOrRemove)
                      }}
                      isAddOrRemove={this.isAddOrRemove}
                      data-cy="addRemoveButton"
                    >
                      {this.isAddOrRemove ? 'ADD' : 'REMOVE'}
                    </AddRemoveBtn>
                  )}
                </>
              ))}
          </Question>
          <Row type="flex" align="center">
            <Detail>
              <TypeCategory>
                {windowWidth > MAX_TAB_WIDTH && (
                  <Standards
                    data-cy="standards"
                    item={item}
                    search={search}
                    showAllInterestedCurriculums
                  />
                )}
                {windowWidth > MAX_TAB_WIDTH && (
                  <Tags data-cy="tags" tags={item.tags} key="tags" />
                )}
                <CategoryContent>
                  {isPremiumContent(item.collections || []) &&
                    showPremiumLabelOnContent(item.collections, collections) &&
                    !isPublisher &&
                    !owner && <PremiumTag />}
                  {itemTypes.map((itemType) => (
                    <Label data-cy="ques-type">
                      <LabelText>{itemType}</LabelText>
                    </Label>
                  ))}
                  <CollectionTag
                    data-cy="collection"
                    collectionName={item?.collectionName}
                  />
                </CategoryContent>
                {windowWidth > MAX_TAB_WIDTH && (
                  <TestStatusWrapper status={item.status}>
                    {({ children, ...rest }) => (
                      <TestStatus {...rest}>{children}</TestStatus>
                    )}
                  </TestStatusWrapper>
                )}
                {windowWidth > MAX_TAB_WIDTH && isDynamicItem && (
                  <DynamicIconWrapper title="Every student may get different values in their assignment">
                    <IconDynamic color={themeColor} />
                  </DynamicIconWrapper>
                )}
              </TypeCategory>
              {windowWidth > MAX_TAB_WIDTH && (
                <Categories>{this.renderDetails()}</Categories>
              )}
            </Detail>
            {windowWidth <= MAX_TAB_WIDTH &&
              (page === 'itemList' ? (
                <ViewButton>
                  <MoreInfo
                    onClick={this.toggleDetails}
                    isOpenedDetails={isOpenedDetails}
                  >
                    <IconDown />
                  </MoreInfo>
                  <ViewButtonStyled onClick={this.moveToItem}>
                    {t('component.item.view')}
                    <IconEye />
                  </ViewButtonStyled>
                  {!hideAddRemove && (
                    <CheckboxWrapper
                      selectedToCart={selectedToCart}
                      onClick={this.handleToggleItemToCart(item)}
                    >
                      {selectedToCart ? 'Remove' : <IconPlus />}
                    </CheckboxWrapper>
                  )}
                </ViewButton>
              ) : (
                <ViewButton>
                  <MoreInfo
                    onClick={this.toggleDetails}
                    isOpenedDetails={isOpenedDetails}
                  >
                    <IconDown />
                  </MoreInfo>
                  {/* to display the section name instead of remove button on selected items */}
                  {isPublisher || isDynamicTest || hasSections ? (
                    <AddRemoveBtnPublisher
                      loading={selectedId === item._id}
                      onClick={() => {
                        this.handleAddRemove(item, this.isAddOrRemove)
                      }}
                      isAddOrRemove={this.isAddOrRemove}
                      data-cy="addRemoveButton"
                    >
                      {this.isAddOrRemove ? 'ADD' : `${groupName}`}
                      {this.isAddOrRemove ? '' : <Icon type="close" />}
                    </AddRemoveBtnPublisher>
                  ) : (
                    <AddRemoveBtn
                      loading={selectedId === item._id}
                      onClick={() => {
                        this.handleAddRemove(item, this.isAddOrRemove)
                      }}
                      isAddOrRemove={this.isAddOrRemove}
                      data-cy="addRemoveButton"
                    >
                      {this.isAddOrRemove ? 'ADD' : 'REMOVE'}
                    </AddRemoveBtn>
                  )}
                </ViewButton>
              ))}
          </Row>
          {windowWidth <= MAX_TAB_WIDTH && (
            <Details isOpenedDetails={isOpenedDetails}>
              <Standards
                data-cy="standards"
                item={item}
                search={search}
                showAllInterestedCurriculums
              />
              <Tags tags={item.tags} key="tags" />
              <TestStatusWrapper>
                {({ children, ...rest }) => (
                  <TestStatus {...rest}>{children}</TestStatus>
                )}
              </TestStatusWrapper>
              {isDynamicItem && (
                <DynamicIconWrapper title="Every student may get different values in their assignment">
                  <IconDynamic color={themeColor} />
                </DynamicIconWrapper>
              )}
              <Categories>{this.renderDetails()}</Categories>
            </Details>
          )}
        </Container>
      </WithResources>
    )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  gotoSummary: PropTypes.func,
  showAnser: PropTypes.func.isRequired,
  openPreviewModal: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  onToggleToCart: PropTypes.func.isRequired,
  selectedToCart: PropTypes.bool,
  page: PropTypes.string.isRequired,
}

Item.defaultProps = {
  selectedToCart: false,
  gotoSummary: () => {},
}

const enhance = compose(
  withRouter,
  withNamespaces('author'),
  connect(
    (state) => ({
      passageItemsCount: getPassageItemsCountSelector(state),
      passageItems: state.tests.passageItems,
      features: getUserFeatures(state),
      collections: getCollectionsSelector(state),
      isPublisherUser: isPublisherUserSelector(state),
      userRole: getUserRole(state),
      isDynamicTest: isDynamicTestSelector(state),
      hasSections: hasSectionsSelector(state),
    }),
    {
      setAndSavePassageItems: setAndSavePassageItemsAction,
      setPassageItems: setPassageItemsAction,
      toggleTestItemLikeRequest: toggleTestItemLikeAction,
    }
  )
)

export default enhance(Item)
