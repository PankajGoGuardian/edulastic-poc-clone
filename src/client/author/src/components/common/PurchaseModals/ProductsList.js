import { NumberInputStyled, notification } from '@edulastic/common'
import { Tooltip } from 'antd'
import produce from 'immer'
import { camelCase, isNumber, keyBy } from 'lodash'
import { roleuser } from '@edulastic/constants'
import React, { useEffect, useMemo } from 'react'
import {
  AddonList,
  FlexRow,
  NumberInputWrapper,
  StyledCheckbox,
  Total,
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
}) => {
  const allProductsKeyed = useMemo(() => {
    if (allProducts) {
      return keyBy(allProducts, 'linkedProductId')
    }
    return {}
  }, [allProducts])
  const licenseMapKeyByProductId = useMemo(() => {
    if (subsLicenses) {
      return keyBy(subsLicenses, 'productId')
    }
    return {}
  }, [subsLicenses])

  const premiumProductId = teacherPremium?.id

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
    let {
      totalCount: totalTeacherPremium = 0,
      usedCount: totalTeacherPremiumUsedCount = 0,
    } = _licenses?.find((x) => x.productId === premiumProductId) || {}

    if (
      subType === 'premium' &&
      userRole === roleuser.TEACHER &&
      totalTeacherPremiumUsedCount == 0
    ) {
      totalTeacherPremium += 1
      totalTeacherPremiumUsedCount += 1
    }
    if (quant[teacherPremium.id]) {
      totalTeacherPremium += quant[teacherPremium.id]
    }

    if (subType === 'premium' && userRole === roleuser.TEACHER) {
      for (const addOnSub of itemBankSubscriptions.filter((x) => !x.isTria)) {
        if (addOnSub.itemBankId) {
          if (!_licensesKeyed[addOnSub?.itemBankId]) {
            const productId = allProductsKeyed[addOnSub?.itemBankId].id
            _licenses = [
              ..._licenses,
              {
                productId,
                linkedProductId: addOnSub?.itemBankId,
                totalCount: 0,
                usedCount: 1,
              },
            ]
          } else {
            _licenses = produce(_licenses, (_licensesDraft) => {
              const licensesIndex = _licensesDraft.findIndex(
                (x) => x?.linkedProductId
              )
              _licensesDraft[licensesIndex].totalCount++
              _licensesDraft[licensesIndex].usedCount++
            })
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
      let _quantities = {
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
          const existingCartCount = _quantities[premiumProductId] || 0
          if (teacherPremiumCountTOAdd == -1) {
            Object.assign(_quantities, {
              [premiumProductId]: existingCartCount + 1,
            })
          } else {
            Object.assign(_quantities, {
              [premiumProductId]: Math.max(
                Math.abs(teacherPremiumCountTOAdd),
                _quantities[premiumProductId] || 0
              ),
            })
          }
        }
      }

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
      handleQuantityChange(isBuyMore ? currentItemId : premiumProductId)(1)
    }
  }, [premiumProductId, currentItemId, isBuyMore, isCart])

  return (
    <>
      <AddonList
        marginTop={(isBuyMore || isRequestingQuote) && '20px'}
        marginBottom={(isBuyMore || isRequestingQuote) && '10px'}
        pr={isRequestingQuote && '30px'}
      >
        {productsToshow.map((product) => (
          <FlexRow key={product.id} alignItems={isBuyMore && 'center'}>
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
            {(showMultiplePurchaseModal || isBuyMore) && (
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
                  max={
                    isCart && teacherPremiumCountTOAdd <= 0
                      ? Infinity
                      : premiumProductId === product.id
                      ? Infinity
                      : quantities[premiumProductId] ||
                        Math.max(
                          licenseMapKeyByProductId[premiumProductId]
                            ?.totalCount -
                            licenseMapKeyByProductId[product.id]?.totalCount,
                          1
                        )
                  }
                  disabled={
                    isBuyMore && !isCart
                      ? false
                      : quantities[product.id] === undefined
                  }
                  onKeyDown={handleKeyPress}
                />
              </NumberInputWrapper>
            )}
            {!isRequestingQuote && (
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
            )}
          </FlexRow>
        ))}
      </AddonList>

      {(!isBuyMore || isCart) && !isRequestingQuote && (
        <Total>
          <FlexRow>
            <label>Total</label>
            <span data-cy="TotalPrice" className="priceCol">
              ${_totalPrice}
            </span>
          </FlexRow>
        </Total>
      )}
    </>
  )
}
export default ProductsList
