import { NumberInputStyled, notification, EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import produce from 'immer'
import { camelCase, isNumber, isUndefined, keyBy } from 'lodash'
import { roleuser } from '@edulastic/constants'
import React, { useEffect, useMemo } from 'react'
import {
  AddonList,
  FlexRow,
  NumberInputWrapper,
  StyledCheckbox,
  Total,
  StyledDiv,
} from './SubscriptionAddonModal/styled'

const TooltipComponent = (props) =>
  props.isTeacherPremium ? (
    <Tooltip title={props.title}>{props.children}</Tooltip>
  ) : (
    <>{props.children}</>
  )
const ProductsList = ({
  productsToshow,
  showMultiplePurchaseModal,
  setTotalPurchaseAmount,
  teacherPremium,
  quantities,
  setQuantities,
  selectedProductIds = [],
  setSelectedProductIds,
  isBuyMore,
  currentItemId,
  subsLicenses = [],
  isRequestingQuote,
  isCart,
  user,
  itemBankSubscriptions,
  subType,
  allProducts,
  isRenewLicense,
  selectedLicenseId,
  i18Translate = () => {},
}) => {
  const allProductsKeyed = useMemo(() => {
    if (allProducts) {
      return keyBy(allProducts, 'linkedProductId')
    }
    return {}
  }, [allProducts])
  const [licenseMapKeyByProductId, licenseMapKeyByLicenseId] = useMemo(() => {
    if (subsLicenses) {
      return [
        keyBy(subsLicenses, 'productId'),
        keyBy(subsLicenses, 'licenseId'),
      ]
    }
    return {}
  }, [subsLicenses])

  const premiumProductId = teacherPremium?.id
  const isBuyMoreOrRenewLicense = isBuyMore || isRenewLicense

  const _totalPrice = useMemo(() => {
    return productsToshow.reduce((a, c) => {
      if (selectedProductIds.includes(c.id)) {
        return a + c.price * (isNumber(quantities[c.id]) ? quantities[c.id] : 1)
      }
      return a
    }, 0)
  }, [productsToshow, quantities, selectedProductIds, teacherPremium])

  useEffect(() => {
    setTotalPurchaseAmount(_totalPrice)
  }, [_totalPrice])

  const handleOnChange = (e, id) => {
    if (!id) {
      return
    }
    if (isBuyMore && !isCart) return
    if (e.target.checked) {
      const _quantities = {
        ...quantities,
        [id]: 1,
      }
      setQuantities(_quantities)
      setSelectedProductIds((x) => x.concat(id))
    } else {
      let _quantities = {}
      if (isCart) {
        if (id !== teacherPremium.id) {
          _quantities = produce(quantities, (draft) => {
            delete draft[id]
            return draft
          })
        }
      } else {
        _quantities = {
          ...quantities,
          [id]: undefined,
        }
      }
      setQuantities(_quantities)
      setSelectedProductIds((x) => x.filter((y) => y !== id))
    }
  }

  const getTeacherPremiumCountToAdd = (
    _licenses,
    _quant,
    itemBankSubscriptions,
    userRole,
    subType
  ) => {
    const _licensesKeyed = keyBy(_licenses, 'linkedProductId')
    const quant = { ..._quant }
    const {
      totalCount: totalTeacherPremium = 0,
      usedCount: totalTeacherPremiumUsedCount = 0,
    } = _licenses?.find((x) => x.productId === premiumProductId) || {}
    if (
      subType === 'premium' &&
      userRole === roleuser.TEACHER &&
      totalTeacherPremiumUsedCount == 0
    ) {
      // totalTeacherPremium += 1
      // totalTeacherPremiumUsedCount += 1
    }
    // if(subType === 'enterprise'||(subType === 'partial_premium' && user?.features?.premium)){
    //   totalTeacherPremium += 1;
    // }
    if (quant[teacherPremium.id]) {
      // totalTeacherPremium += quant[teacherPremium.id]
    }

    if (subType === 'premium' && userRole === roleuser.TEACHER) {
      for (const addOnSub of itemBankSubscriptions.filter((x) => !x.isTria)) {
        if (addOnSub.itemBankId) {
          if (!_licensesKeyed[addOnSub?.itemBankId]) {
            const productId = allProductsKeyed[addOnSub?.itemBankId]?.id
            _licenses = [
              ..._licenses,
              {
                productId,
                linkedProductId: addOnSub?.itemBankId,
                totalCount: 0,
                usedCount: 1,
              },
            ]
          }
        }
      }
    }

    const allProductsQuants = allProducts
      .filter((x) => x.id !== premiumProductId)
      .map((p) => {
        const c = _licenses.find((x) => x.productId === p.id)
        const { totalCount = 0 } = c || {}
        return (quant[p.id] || 0) + totalCount
      })
    const totalRemainingItemBanksLicenseCount = Math.max(...allProductsQuants)

    const availableTeacherPremiumCount =
      totalTeacherPremium - totalRemainingItemBanksLicenseCount
    return availableTeacherPremiumCount
  }

  const teacherPremiumCountTOAdd = useMemo(() => {
    if (!isCart) {
      return 1
    }
    return getTeacherPremiumCountToAdd(
      subsLicenses,
      quantities,
      itemBankSubscriptions,
      user?.role,
      subType
    )
  }, [
    subsLicenses,
    quantities,
    isCart,
    itemBankSubscriptions,
    user?.role,
    subType,
  ])

  const handleQuantityChange = (itemId) => (value) => {
    if (isRenewLicense) {
      const productCount =
        licenseMapKeyByLicenseId[selectedLicenseId]?.totalCount || 0
      const currentCount = isUndefined(value) ? productCount : Math.floor(value)
      const _quantities = {
        ...quantities,
        [itemId]: currentCount,
      }
      setQuantities(_quantities)
      return
    }
    if (isBuyMore && !isCart) {
      const tpCount =
        licenseMapKeyByProductId[premiumProductId]?.totalCount || 0
      const productCount = licenseMapKeyByProductId[itemId]?.totalCount || 0
      const currentCount = Math.floor(value) + productCount
      if (itemId !== premiumProductId && currentCount > tpCount) {
        const _quantities = {
          ...quantities,
          [itemId]: Math.max(tpCount - productCount, 0),
        }
        setQuantities(_quantities)
        notification({
          type: 'warn',
          msg: `${
            productsToshow?.[0]?.name || ''
          } licenses cannot be more than Teacher Premium licenses.`,
        })
        return
      }
    }

    if (isCart) {
      const _quantities = {
        ...quantities,
        [itemId]: Math.floor(value),
      }

      if (itemId !== premiumProductId) {
        const teacherPremiumCountTOAdd = getTeacherPremiumCountToAdd(
          subsLicenses,
          _quantities,
          itemBankSubscriptions,
          user?.role,
          subType
        )

        if (teacherPremiumCountTOAdd < 0) {
          Object.assign(_quantities, {
            [premiumProductId]: Math.max(
              Math.abs(teacherPremiumCountTOAdd),
              _quantities[premiumProductId] || 0
            ),
          })
        }
      }

      setQuantities(_quantities)
      return
    }
    if (showMultiplePurchaseModal && itemId === premiumProductId) {
      const _value = Math.floor(value)
      const _quantities = Object.keys(quantities).reduce((acc, key) => {
        acc[key] = Math.min(_value, quantities[key])
        return acc
      }, {})
      _quantities[premiumProductId] = _value
      setQuantities(_quantities)
      return
    }
    const _quantities = {
      ...quantities,
      [itemId]: Math.floor(value),
    }
    setQuantities(_quantities)
  }

  const handleKeyPress = (e) => {
    const specialCharRegex = new RegExp('[0-9\b\t]+') // allow numbers, backspace and tab
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode)
    if (!specialCharRegex.test(pressedKey)) {
      return e.preventDefault()
    }
    return pressedKey
  }

  useEffect(() => {
    if (!isCart) {
      const _quantity = isRenewLicense ? undefined : 1
      handleQuantityChange(
        isBuyMoreOrRenewLicense ? currentItemId : premiumProductId
      )(_quantity)
    }
  }, [premiumProductId, currentItemId, isBuyMore, isCart, isRenewLicense])

  const getClosetDateFromCurrentDate = (licenses) => {
    const currentDate = new Date()

    const closestDate = licenses.reduce(
      (closest, current) => {
        const expiresOn = new Date(current.expiresOn)
        const timeDifference = expiresOn - currentDate

        if (timeDifference >= 0 && timeDifference < closest.timeDifference) {
          return {
            license: current,
            timeDifference,
          }
        }

        return closest
      },
      { license: null, timeDifference: Infinity }
    ).license

    return closestDate
  }

  const getMaxValue = (product) => {
    if (isCart && teacherPremiumCountTOAdd <= 0) {
      return Infinity
    }

    if (premiumProductId === product.id) {
      return Infinity
    }
    if (quantities[premiumProductId]) {
      return quantities[premiumProductId]
    }

    if (isRenewLicense) {
      const teacherPremiumLicenses = Object.values(
        licenseMapKeyByLicenseId
      ).filter((license) => premiumProductId === license.productId)

      const tpLicenseCount = getClosetDateFromCurrentDate(
        teacherPremiumLicenses
      ).totalCount
      const selectedProductCount =
        licenseMapKeyByLicenseId[selectedLicenseId].totalCount
      return Math.max(tpLicenseCount - selectedProductCount, 1)
    }

    const teacherPremiumTotalCount =
      licenseMapKeyByProductId[premiumProductId]?.totalCount
    const currentProductTotalCount =
      licenseMapKeyByProductId[product.id]?.totalCount

    return Math.max(teacherPremiumTotalCount - currentProductTotalCount, 1)
  }

  const showManuallyAssingText = (product) => {
    const selectedQuantityLessThanExisting =
      quantities[product.id] <
      licenseMapKeyByLicenseId[selectedLicenseId]?.totalCount
    return [(isRenewLicense, selectedQuantityLessThanExisting)].every(
      (o) => !!o
    )
  }

  const showTotalPrice = [!isBuyMore, !isRenewLicense, isCart].some((o) => !!o)

  return (
    <>
      <AddonList
        marginTop={(isBuyMore || isRequestingQuote) && '20px'}
        marginBottom={(isBuyMore || isRequestingQuote) && '10px'}
        pr={isRequestingQuote && '30px'}
      >
        {productsToshow.map((product) => (
          <>
            <FlexRow
              key={product.id}
              alignItems={isBuyMoreOrRenewLicense && 'center'}
            >
              <TooltipComponent
                title="Premium subscription is mandatory for Spark content"
                isTeacherPremium={premiumProductId === product.id}
              >
                <StyledCheckbox
                  data-cy={`${camelCase(product.name)}Checkbox`}
                  value={product.price}
                  onChange={(e) => handleOnChange(e, product.id)}
                  checked={
                    selectedProductIds.includes(product.id) ||
                    premiumProductId === product.id
                  }
                  disabled={premiumProductId === product.id && !isCart}
                  textTransform="none"
                  fontSize={isRequestingQuote && '14px'}
                >
                  {product.name}
                </StyledCheckbox>
              </TooltipComponent>
              <EduIf
                condition={showMultiplePurchaseModal || isBuyMoreOrRenewLicense}
              >
                <NumberInputWrapper>
                  <NumberInputStyled
                    type="number"
                    value={quantities[product.id]}
                    onChange={handleQuantityChange(product.id)}
                    height="28px"
                    width="80px"
                    data-cy={product.type}
                    min={
                      isCart &&
                      premiumProductId === product.id &&
                      teacherPremiumCountTOAdd < 0
                        ? Math.abs(teacherPremiumCountTOAdd)
                        : 1
                    }
                    max={getMaxValue(product)}
                    disabled={
                      isBuyMoreOrRenewLicense && !isCart
                        ? false
                        : quantities[product.id] === undefined
                    }
                    onKeyDown={handleKeyPress}
                  />
                </NumberInputWrapper>
              </EduIf>
              <EduIf condition={!isRequestingQuote}>
                <span
                  className="priceCol"
                  data-cy={`${camelCase(product.name)}Price`}
                >
                  $
                  {product.price *
                    (isNumber(quantities[product.id])
                      ? quantities[product.id]
                      : 1)}
                </span>
              </EduIf>
            </FlexRow>
            <EduIf condition={showManuallyAssingText(product)}>
              <FlexRow>
                <StyledDiv>
                  {i18Translate(
                    'manageSubscriptions.MANUALLY_ASSIGN_ONCE_EXPIRED'
                  )}
                </StyledDiv>
              </FlexRow>
            </EduIf>
          </>
        ))}
      </AddonList>

      <EduIf condition={showTotalPrice && !isRequestingQuote}>
        <Total>
          <FlexRow>
            <label>Total</label>
            <span data-cy="TotalPrice" className="priceCol">
              ${_totalPrice}
            </span>
          </FlexRow>
        </Total>
      </EduIf>
    </>
  )
}
export default ProductsList
