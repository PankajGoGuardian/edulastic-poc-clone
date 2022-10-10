import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { get } from 'lodash'
import { white } from '@edulastic/colors'
import {
  HeaderTabs,
  withWindowSizes,
  EduButton,
  showBlockerPopup,
} from '@edulastic/common'
import { StyledTabs } from '@edulastic/common/src/components/HeaderTabs'
import { HeaderMidContainer } from '@edulastic/common/src/components/MainHeader'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import {
  IconCheck,
  IconClose,
  IconEraseText,
  IconEye,
  IconMetadata,
  IconPencilEdit,
  IconPreview,
  IconSaveNew,
  IconExpand,
  IconCollapse,
} from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { roleuser } from '@edulastic/constants'
import { clearEvaluationAction } from '../../../../../assessment/actions/evaluation'
import { Tooltip } from '../../../../../common/utils/helpers'
import { getCurrentQuestionSelector } from '../../../../sharedDucks/questions'
import {
  getPassageUpdateInProgressSelector,
  getTestItemsSavingSelector,
} from '../../../../ItemDetail/ducks'
import { clearAnswersAction } from '../../../actions/answers'
import { MAX_TAB_WIDTH } from '../../../constants/others'
import {
  Container,
  CustomButton,
  HeadIcon,
  MenuItem,
  MenuList,
  MobileBottom,
  MobileContainer,
  MobileSecondContainer,
  MobileTopRight,
  RightSide,
} from './styled_components'
import { getUserRole } from '../../../selectors/user'
import { checkDynamicParameters } from '../../../../../assessment/utils/variables'
import { generateVariableAction } from '../../../../QuestionEditor/ducks'

class ButtonBar extends Component {
  handleDynamicParameter = (nextAction) => {
    const { cQuestion, generateDynamicVariables } = this.props
    const variableEnabled = get(cQuestion, 'variable.enabled', false)
    if (variableEnabled) {
      const variables = get(cQuestion, 'variable.variables', {})
      const { invalid, errMessage } = checkDynamicParameters(
        variables,
        cQuestion?.validation,
        cQuestion?.type
      )
      if (invalid) {
        showBlockerPopup(errMessage)
      } else {
        generateDynamicVariables({ nextAction })
      }
    } else if (typeof nextAction === 'function') {
      nextAction()
    }
  }

  handleTabClick = (view) => () => {
    const {
      onChangeView,
      clearEvaluation,
      onSaveScrollTop,
      changePreviewTab,
    } = this.props

    onChangeView(view)

    if (view !== 'edit' && onSaveScrollTop) {
      onSaveScrollTop(window.pageYOffset)
    }

    if (view === 'preview') {
      changePreviewTab('clear')
    }

    if (view === 'edit') {
      clearEvaluation()
    }
  }

  handleMenuClick = (view) => () => {
    const { view: currentView, showMetaData } = this.props

    if (currentView === view) {
      return
    }

    if (showMetaData && currentView === 'edit' && view !== 'edit') {
      this.handleDynamicParameter(this.handleTabClick(view))
    } else {
      this.handleTabClick(view)()
    }
  }

  setClearPreviewTab = () => {
    const { changePreviewTab, clearAnswers } = this.props
    clearAnswers()
    changePreviewTab('clear')
  }

  handleSavePublishItem = () => {
    const { onSaveAndPublish } = this.props
    this.handleDynamicParameter(onSaveAndPublish)
  }

  handlePublishItem = () => {
    const { onPublishTestItem } = this.props
    this.handleDynamicParameter(onPublishTestItem)
  }

  handleSave = () => {
    const { onSave } = this.props
    this.handleDynamicParameter(onSave)
  }

  render() {
    const {
      t,
      onCancel,
      windowWidth,
      changePreviewTab,
      onEnableEdit,
      showPublishButton,
      view,
      isTestFlow,
      hasAuthorPermission,
      itemStatus,
      renderExtra,
      renderRightSide,
      withLabels,
      disableSave,
      showMetaData,
      showAuditTrail = false,
      permissions,
      qTitle,
      userRole,
      showSaveAndPublishButton,
      loadingComponents,
      onCloseEditModal,
      onToggleFullModal,
      isInModal,
      passageUpdateInProgress = false,
      testItemSavingInProgress = false,
    } = this.props
    return (
      <>
        {windowWidth > MAX_TAB_WIDTH ? (
          <Container>
            <HeaderMidContainer style={{ width: '100%' }}>
              <StyledTabs selectedKeys={[view]}>
                {hasAuthorPermission && (
                  <HeaderTabs
                    id={getFormattedAttrId(`${qTitle}-edit`)}
                    dataCy="editButton"
                    isActive={view === 'edit'}
                    icon={
                      <IconPencilEdit
                        color={white}
                        width={18}
                        height={16}
                        aria-hidden="true"
                      />
                    }
                    linkLabel="Edit Mode"
                    onClickHandler={this.handleMenuClick('edit')}
                  />
                )}
                <HeaderTabs
                  id={getFormattedAttrId(`${qTitle}-preview-mode`)}
                  dataCy="previewButton"
                  isActive={view === 'preview'}
                  icon={
                    <IconEye
                      color={white}
                      width={18}
                      height={16}
                      aria-hidden="true"
                    />
                  }
                  linkLabel="Preview mode"
                  onClickHandler={this.handleMenuClick('preview')}
                />
                {showMetaData && (
                  <HeaderTabs
                    id={getFormattedAttrId(`${qTitle}-metadata`)}
                    dataCy="metadataButton"
                    isActive={view === 'metadata'}
                    icon={
                      <IconMetadata
                        color={white}
                        width={18}
                        height={16}
                        aria-hidden="true"
                      />
                    }
                    linkLabel="Meta data"
                    onClickHandler={this.handleMenuClick('metadata')}
                  />
                )}
                {hasAuthorPermission &&
                  showAuditTrail &&
                  !!permissions.length && (
                    <HeaderTabs
                      id={getFormattedAttrId(`${qTitle}-auditTrail`)}
                      dataCy="auditTrailButton"
                      isActive={view === 'auditTrail'}
                      icon={
                        <IconPencilEdit
                          color={white}
                          width={18}
                          height={16}
                          aria-hidden="true"
                        />
                      }
                      linkLabel="Audit trail"
                      onClickHandler={this.handleMenuClick('auditTrail')}
                    />
                  )}
              </StyledTabs>
            </HeaderMidContainer>

            {hasAuthorPermission && (
              <RightSide>
                {renderRightSide()}
                {(showPublishButton || showPublishButton === undefined) &&
                  (itemStatus === 'draft' ? (
                    <>
                      {isTestFlow && !onCloseEditModal && (
                        <EduButton
                          isBlue
                          data-cy="saveCancel"
                          onClick={onCancel}
                        >
                          <IconClose aria-hidden="true" />
                          CANCEL
                        </EduButton>
                      )}
                      <Tooltip title="Save">
                        <EduButton
                          isBlue
                          id={getFormattedAttrId(`${qTitle}-save`)}
                          disabled={disableSave}
                          data-cy="saveButton"
                          onClick={this.handleSave}
                          loading={
                            passageUpdateInProgress || testItemSavingInProgress
                          }
                        >
                          <IconSaveNew aria-hidden="true" />
                          SAVE
                        </EduButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {isTestFlow && !onCloseEditModal && (
                        <EduButton isBlue onClick={onCancel}>
                          <IconClose aria-hidden="true" />
                          CANCEL
                        </EduButton>
                      )}
                      <EduButton
                        isBlue
                        disabled={disableSave}
                        data-cy="saveButton"
                        onClick={this.handleSave}
                        id={getFormattedAttrId(`${qTitle}-save`)}
                        loading={
                          passageUpdateInProgress || testItemSavingInProgress
                        }
                      >
                        <IconSaveNew aria-hidden="true" />
                        SAVE
                      </EduButton>
                      {!isTestFlow && showSaveAndPublishButton && (
                        <EduButton
                          loading={
                            loadingComponents.includes('saveAndPublishItem') ||
                            testItemSavingInProgress
                          }
                          isBlue
                          disabled={disableSave}
                          data-cy="saveAndPublishItem"
                          onClick={this.handleSavePublishItem}
                        >
                          PUBLISH
                        </EduButton>
                      )}
                    </>
                  ))}
                {showPublishButton &&
                  itemStatus === 'draft' &&
                  !isTestFlow &&
                  userRole !== roleuser.EDULASTIC_CURATOR && (
                    <EduButton
                      isBlue
                      disabled={disableSave}
                      data-cy="publishItem"
                      onClick={this.handlePublishItem}
                      loading={testItemSavingInProgress}
                    >
                      PUBLISH
                    </EduButton>
                  )}
                {!(showPublishButton || showPublishButton === undefined) && (
                  <EduButton
                    isBlue
                    data-cy="editItem"
                    onClick={onEnableEdit}
                    width="98px"
                  >
                    EDIT
                  </EduButton>
                )}
                {renderExtra()}
                {!!onToggleFullModal && (
                  <EduButton
                    isBlue
                    IconBtn
                    data-cy="expandbutton"
                    onClick={onToggleFullModal}
                  >
                    {isInModal ? <IconExpand /> : <IconCollapse />}
                  </EduButton>
                )}
                {onCloseEditModal && (
                  <EduButton
                    isBlue
                    IconBtn
                    data-cy="closeEditModal"
                    onClick={onCloseEditModal}
                  >
                    <IconClose />
                  </EduButton>
                )}
              </RightSide>
            )}
            {!hasAuthorPermission && <RightSide>{renderExtra()}</RightSide>}
          </Container>
        ) : (
          <MobileContainer>
            <MobileTopRight>
              <CustomButton
                id={getFormattedAttrId(`${qTitle}-save`)}
                disabled={disableSave}
                data-cy="saveButton"
                onClick={this.handleSave}
                className="btn-save"
              >
                <IconSaveNew color={white} width={18} height={16} />
              </CustomButton>
            </MobileTopRight>
            <MobileBottom>
              <MenuList selectedKeys={[view]}>
                <MenuItem
                  id={getFormattedAttrId(`${qTitle}-edit`)}
                  onClick={() => this.handleMenuClick('edit')}
                  className={view === 'edit' && 'active'}
                  data-cy="editButton"
                >
                  <HeadIcon>
                    <IconPencilEdit color={white} width={18} height={16} />
                  </HeadIcon>
                  {withLabels ? 'Edit Mode' : ''}
                </MenuItem>
                <MenuItem
                  id={getFormattedAttrId(`${qTitle}-preview-mode`)}
                  onClick={() => this.handleMenuClick('preview')}
                  className={view === 'preview' && 'active'}
                  data-cy="previewButton"
                >
                  <HeadIcon>
                    <IconPreview color={white} width={18} height={16} />
                  </HeadIcon>
                  {withLabels ? 'Preview mode' : ''}
                </MenuItem>

                <MenuItem
                  id={getFormattedAttrId(`${qTitle}-metadata`)}
                  data-cy="metadataButton"
                  className={view === 'metadata' && 'active'}
                  onClick={this.handleMenuClick('metadata')}
                >
                  <HeadIcon>
                    <IconMetadata color={white} width={18} height={16} />
                  </HeadIcon>
                  Meta data
                </MenuItem>
              </MenuList>
            </MobileBottom>
            {view === 'preview' && (
              <MobileSecondContainer>
                <EduButton
                  height="32px"
                  isGhost
                  onClick={() => changePreviewTab('check')}
                >
                  <IconCheck color={white} width={16} height={16} />
                  {t('component.questioneditor.buttonbar.checkanswer')}
                </EduButton>
                <EduButton
                  height="32px"
                  isGhost
                  onClick={() => changePreviewTab('show')}
                >
                  <IconEye color={white} width={16} height={16} />
                  {t('component.questioneditor.buttonbar.showanswers')}
                </EduButton>
                <EduButton
                  height="32px"
                  isGhost
                  onClick={() => this.setClearPreviewTab()}
                >
                  <IconEraseText color={white} width={16} height={16} />
                  {t('component.questioneditor.buttonbar.clear')}
                </EduButton>
              </MobileSecondContainer>
            )}
          </MobileContainer>
        )}
      </>
    )
  }
}

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  clearAnswers: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isTestFlow: PropTypes.bool,
  onEnableEdit: PropTypes.func,
  clearEvaluation: PropTypes.func.isRequired,
  renderExtra: PropTypes.func,
  renderRightSide: PropTypes.func,
  withLabels: PropTypes.bool,
  onSaveScrollTop: PropTypes.func.isRequired,
  disableSave: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  hasAuthorPermission: PropTypes.bool,
  showMetaData: PropTypes.bool,
  showAuditTrail: PropTypes.bool,
  permissions: PropTypes.object.isRequired,
  passageUpdateInProgress: PropTypes.bool,
  testItemSavingInProgress: PropTypes.bool,
}

ButtonBar.defaultProps = {
  renderRightSide: () => {},
  onEnableEdit: () => {},
  renderExtra: () => null,
  disableSave: false,
  showMetaData: false,
  showAuditTrail: false,
  isTestFlow: false,
  withLabels: false,
  hasAuthorPermission: true,
  passageUpdateInProgress: false,
  testItemSavingInProgress: false,
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => {
      const {
        multipartItem,
        isPassageWithQuestions,
        canAddMultipleItems,
        data = {},
      } = get(state, ['itemDetail', 'item'], {})
      const isMultipart =
        multipartItem ||
        isPassageWithQuestions ||
        canAddMultipleItems ||
        data.questions?.length > 1
      return {
        permissions: get(state, ['user', 'user', 'permissions'], []),
        qTitle: isMultipart
          ? 'compination-multipart'
          : getCurrentQuestionSelector(state)?.title,
        cQuestion: getCurrentQuestionSelector(state),
        userRole: getUserRole(state),
        multipartItem,
        loadingComponents: get(state, ['authorUi', 'currentlyLoading'], []),
        passageUpdateInProgress: getPassageUpdateInProgressSelector(state),
        testItemSavingInProgress: getTestItemsSavingSelector(state),
      }
    },
    {
      clearAnswers: clearAnswersAction,
      clearEvaluation: clearEvaluationAction,
      generateDynamicVariables: generateVariableAction,
    }
  )
)

export default enhance(ButtonBar)
