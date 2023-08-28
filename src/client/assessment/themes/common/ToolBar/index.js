import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty } from 'lodash'
import { questionType } from '@edulastic/constants'
import { EduIf } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  IconMagnify,
  IconCloudUpload,
  IconEduReferenceSheet,
} from '@edulastic/icons'
import LineReader from '../../../../common/components/LineReader'
import { ActionButton } from './ActionButton'
import {
  CursorIcon,
  InRulerIcon,
  ToolBarContainer,
  CloseIcon,
  ProtactorIcon,
  ScratchPadIcon,
  ButtonWithStyle,
} from './styled-components'
import { CalculatorIconWrapper } from './CalculatorIconWrapper'
import { getCalcTypeSelector } from '../../../selectors/test'

const CROSS_OUT_QUES = [
  questionType.MULTIPLE_CHOICE,
  questionType.CHOICE_MATRIX,
]

const ToolBar = ({
  settings,
  calcTypes,
  tool = [],
  qType,
  handleMagnifier,
  openReferenceModal,
  isShowReferenceModal,
  canShowReferenceMaterial,
  enableMagnifier,
  toggleUserWorkUploadModal,
  changeTool,
  hasDrawingResponse,
  isPremiumContentWithoutAccess = false,
  t: translate,
}) => {
  const { showMagnifier, enableScratchpad, isTeacherPremium } = settings

  const isDisableCrossBtn = useMemo(() => {
    return !CROSS_OUT_QUES.includes(qType)
  }, [qType])

  const toolbarHandler = (value) => () => {
    changeTool(value)
  }

  return (
    <ToolBarContainer>
      <ActionButton
        disabled={isPremiumContentWithoutAccess}
        title={translate('toolbar.pointer')}
        icon={<CursorIcon />}
        active={tool.includes(0)}
        onClick={toolbarHandler(0)}
        hidden
      />
      <ActionButton
        disabled={isPremiumContentWithoutAccess}
        title={translate('toolbar.ruler')}
        icon={<InRulerIcon />}
        active={tool.includes(1)}
        onClick={toolbarHandler(1)}
        hidden
      />
      <EduIf condition={!isEmpty(calcTypes)}>
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title={translate('toolbar.calculator')}
          aria-label={translate('toolbar.calculator')}
          icon={
            <CalculatorIconWrapper isMultiCalculators={calcTypes.length > 1} />
          }
          active={tool.includes(2)}
          onClick={toolbarHandler(2)}
        />
      </EduIf>
      <EduIf condition={canShowReferenceMaterial}>
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title={translate('toolbar.refMaterial')}
          aria-label={translate('toolbar.refMaterial')}
          icon={<IconEduReferenceSheet height="22" width="20" />}
          active={isShowReferenceModal}
          onClick={openReferenceModal}
        />
      </EduIf>
      <ActionButton
        title={
          isDisableCrossBtn
            ? translate('toolbar.crossDisabled')
            : translate('toolbar.cross')
        }
        icon={<CloseIcon />}
        active={tool.includes(3)}
        onClick={toolbarHandler(3)}
        disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
        aria-label={
          isDisableCrossBtn
            ? translate('toolbar.crossDisabled')
            : translate('toolbar.cross')
        }
      />
      <ActionButton
        disabled={isPremiumContentWithoutAccess}
        title={translate('toolbar.protactor')}
        aria-label={translate('toolbar.protactor')}
        icon={<ProtactorIcon />}
        active={tool.includes(4)}
        onClick={toolbarHandler(4)}
        hidden
      />
      <EduIf condition={enableScratchpad && !hasDrawingResponse}>
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title={translate('toolbar.scratchPad')}
          aria-label={translate('toolbar.scratchPad')}
          icon={<ScratchPadIcon />}
          active={tool.includes(5)}
          onClick={toolbarHandler(5)}
        />
      </EduIf>
      <EduIf condition={showMagnifier}>
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title={translate('toolbar.magnify')}
          aria-label={translate('toolbar.magnify')}
          icon={<IconMagnify />}
          active={enableMagnifier}
          onClick={handleMagnifier}
        />
      </EduIf>
      <EduIf condition={isTeacherPremium}>
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title={translate('toolbar.uploadWork')}
          aria-label={translate('toolbar.uploadWork')}
          icon={<IconCloudUpload />}
          onClick={toggleUserWorkUploadModal}
        />
      </EduIf>
      <LineReader btnComponent={ButtonWithStyle} />
    </ToolBarContainer>
  )
}

ToolBar.propTypes = {
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  calcTypes: getCalcTypeSelector(state),
})

const enhance = compose(withNamespaces('header'), connect(mapStateToProps))

export default enhance(ToolBar)
