import React, { useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FlexContainer } from '@edulastic/common'
import { difference } from 'lodash'
import loadable from '@loadable/component'
import { Spin } from 'antd'
import {
  getNeedsRenewal,
  getProducts,
  slice,
  getShowHeaderTrialModal,
  getItemBankSubscriptions,
  getSubscriptionDataSelector,
  getIsVerificationPending,
  trialPeriodTextSelector,
} from '../../author/Subscription/ducks'
// TODO: Change to SVG
import IMG from '../../author/Subscription/static/6.png'
import IMG_DATA_ANALYST from '../../author/Subscription/static/7.png'
import {
  PopoverCancel,
  PopoverDetail,
  PopoverTitle,
  UpgradeBtn,
  CloseButton,
  PremiumModal,
} from './styled'
import AuthorCompleteSignupButton from '../../common/components/AuthorCompleteSignupButton'
import {
  getInterestedSubjectsSelector,
  isPremiumUserSelector,
} from '../../author/src/selectors/user'
import { productsMetaData } from '../../author/src/components/common/PurchaseModals/ProductsMetaData'
import PurchaseFlowModals from '../../author/src/components/common/PurchaseModals'
import { getIsCpm } from '../../student/Login/ducks'

const TrialModal = loadable(() =>
  import(
    '../../author/Dashboard/components/Showcase/components/Myclasses/components/TrialModal'
  )
)

const descriptions = {
  default:
    'Get additional reports, options to assist students, collaborate with colleagues, anti-cheating tools and more.',
  bubble:
    'Get bubble sheet feature to take OMR exams, also gain access to additional reports, options to assist students, anti-cheating tools and many more.',
  report: `You don’t have an active Premium subscription to access reports. Upgrade to Premium/Enterprise to access reports.`,
}

const images = {
  default: IMG,
  IMG_DATA_ANALYST,
}

const getContent = ({
  onClose,
  needsRenewal,
  isPremiumUser,
  isPremiumTrialUsed,
  handleShowTrialModal,
  descriptionType = 'default',
  imageType = 'default',
}) => {
  const upgradeDescription =
    descriptions[descriptionType] || descriptionType || descriptions.default

  const upgradeImage = images[imageType] || images.default

  return (
    <FlexContainer width="475px" alignItems="flex-start">
      <CloseButton onClick={() => onClose()}>x</CloseButton>
      <img src={upgradeImage} width="165" height="135" alt="" />
      <FlexContainer
        flexDirection="column"
        width="280px"
        padding="15px 0 0 6px"
      >
        <PopoverTitle data-cy="upgradeTitle">
          Access Additional Features
        </PopoverTitle>
        <PopoverDetail data-cy="upgradeDescription">
          {upgradeDescription}
        </PopoverDetail>
        <FlexContainer padding="15px 0 15px 0" width="100%">
          {!isPremiumUser && !isPremiumTrialUsed ? (
            <>
              <Link to="/author/subscription">
                <PopoverCancel data-cy="upgradeButton">UPGRADE</PopoverCancel>
              </Link>
              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <UpgradeBtn data-cy="freeTrialButton" onClick={handleClick}>
                    TRY FOR FREE
                  </UpgradeBtn>
                )}
                onClick={handleShowTrialModal}
              />
            </>
          ) : (
            <>
              <PopoverCancel data-cy="cancelButton" onClick={() => onClose()}>
                {' '}
                NO, THANKS
              </PopoverCancel>
              <Link to="/author/subscription">
                <UpgradeBtn data-cy="upgradeButton">
                  {needsRenewal ? 'RENEW NOW' : 'UPGRADE'}
                </UpgradeBtn>
              </Link>
            </>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  )
}

export const PremiumPopover = ({ children, ...props }) => {
  const {
    descriptionType,
    imageType,
    target,
    onClose: _onClose,
    // from redux
    interestedSubjects,
    isCpm,
    isPremiumTrialUsed,
    isPremiumUser,
    itemBankSubscriptions,
    needsRenewal,
    products,
    setShowHeaderTrialModal,
    showHeaderTrialModal,
    startTrialAction,
    usedTrialItemBankIds,
    isVerificationPending,
    displayText,
  } = props

  const [productData, setProductData] = useState({})
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [trialAddOnProductIds, setTrialAddOnProductIds] = useState([])
  const [showTrialSubsConfirmation, setShowTrialSubsConfirmation] = useState(
    false
  )
  const [modalPos, setModalPos] = useState({})
  const [clickedBundleId, setClickedBundleId] = useState(null)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )

  const handleShowTrialModal = () => setShowHeaderTrialModal(true)

  const productItemBankIds = useMemo(() => {
    if (!products) return []
    return products
      .filter(({ type }) => type !== 'PREMIUM')
      .map((p) => p.linkedProductId)
  }, [products])

  const paidItemBankIds = useMemo(() => {
    if (!itemBankSubscriptions) return []

    return itemBankSubscriptions
      .filter(
        (subscription) =>
          // only include the itembanks which are sold as products
          !subscription.isTrial &&
          productItemBankIds.includes(subscription.itemBankId)
      )
      .map((subscription) => subscription.itemBankId)
  }, [itemBankSubscriptions])

  const defaultSelectedProductIds = productData.productId
    ? [productData.productId]
    : []

  const productsToShowInTrialModal = useMemo(() => {
    if (!showHeaderTrialModal || isTrialModalVisible) {
      return [productData.productId]
    }

    // if the product has paid subscription or the trial is used then its not available for trial.
    const allAvailableTrialItemBankIds = difference(productItemBankIds, [
      ...paidItemBankIds,
      ...usedTrialItemBankIds,
    ])

    const subjects = interestedSubjects.map((x) => x.toUpperCase())

    const getProductsKeysByInterestedSubject = Object.entries(
      productsMetaData
    ).reduce((a, [_key, _value]) => {
      if (subjects.includes(_value.filters)) {
        return a.concat(_key)
      }
      return a
    }, [])

    const allAvailableItemProductIds = products
      .filter(
        (product) =>
          allAvailableTrialItemBankIds.includes(product.linkedProductId) &&
          getProductsKeysByInterestedSubject.includes(product.name)
      )
      .map((p) => p?.id)

    return allAvailableItemProductIds
  }, [
    itemBankSubscriptions,
    products,
    showHeaderTrialModal,
    isTrialModalVisible,
  ])
  useEffect(() => {
    if (!target) return
    const rect = target.getBoundingClientRect?.()
    const screenWidth = document.body.clientWidth || window.innerWidth
    const newModalPos = {
      top: rect.bottom,
      right: `${Math.max(screenWidth - rect.left, 0)}px`,
    }
    setModalPos(newModalPos)
  }, [target])
  const onClose = (...args) => {
    if (isVerificationPending) return
    return _onClose(...args)
  }
  return (
    <>
      <PremiumModal
        onCancel={onClose}
        footer={null}
        closable={false}
        visible={!!target}
        style={{
          top: modalPos.top,
          animationDuration: '0s', // disable animation as it moves the modal first to center, then real position.
        }}
        right={modalPos.right}
      >
        <Spin spinning={isVerificationPending}>
          {getContent({
            onClose,
            needsRenewal,
            isPremiumUser,
            isPremiumTrialUsed,
            handleShowTrialModal,
            descriptionType,
            imageType,
          })}
        </Spin>
      </PremiumModal>

      <TrialModal
        addOnProductIds={productsToShowInTrialModal}
        isVisible={isTrialModalVisible || showHeaderTrialModal}
        toggleModal={setIsTrialModalVisible}
        isPremiumUser={isPremiumUser}
        isPremiumTrialUsed={isPremiumTrialUsed}
        setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
        startPremiumTrial={startTrialAction}
        products={products}
        setShowHeaderTrialModal={setShowHeaderTrialModal}
        setTrialAddOnProductIds={setTrialAddOnProductIds}
        displayText={displayText}
      />
      <PurchaseFlowModals
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        isConfirmationModalVisible={showTrialSubsConfirmation}
        setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
        defaultSelectedProductIds={defaultSelectedProductIds}
        setProductData={setProductData}
        trialAddOnProductIds={trialAddOnProductIds}
        clickedBundleId={clickedBundleId}
        setClickedBundleId={setClickedBundleId}
        isCpm={isCpm}
        interestedSubjects={interestedSubjects}
      />
    </>
  )
}

export default connect(
  (state) => ({
    isPremiumUser: isPremiumUserSelector(state),
    isPremiumTrialUsed: getSubscriptionDataSelector(state)?.isPremiumTrialUsed,
    needsRenewal: getNeedsRenewal(state),
    products: getProducts(state),
    displayText: trialPeriodTextSelector(state),
    showHeaderTrialModal: getShowHeaderTrialModal(state),
    itemBankSubscriptions: getItemBankSubscriptions(state),
    usedTrialItemBankIds: getSubscriptionDataSelector(state)
      ?.usedTrialItemBankIds,
    interestedSubjects: getInterestedSubjectsSelector(state),
    isCpm: getIsCpm(state),
    isVerificationPending: getIsVerificationPending(state),
  }),
  {
    setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
    startTrialAction: slice.actions.startTrialAction,
  }
)(PremiumPopover)
