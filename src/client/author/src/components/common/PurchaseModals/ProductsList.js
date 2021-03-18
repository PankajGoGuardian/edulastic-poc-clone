import { NumberInputStyled, notification } from '@edulastic/common'
import { Tooltip } from 'antd'
import { camelCase, isNumber, keyBy } from 'lodash'
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
  subsLicenses,
}) => {
  const licenseMapKeyByProductId = useMemo(() => {
    if (subsLicenses) {
      return keyBy(subsLicenses, 'productId')
    }
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
    if (isBuyMore) return
    if (e.target.checked) {
      const _quantities = {
        ...quantities,
        [id]: 1,
      }
      setQuantities(_quantities)
      setSelectedProductIds((x) => x.concat(id))
    } else {
      const _quantities = {
        ...quantities,
        [id]: undefined,
      }
      setQuantities(_quantities)
      setSelectedProductIds((x) => x.filter((y) => y !== id))
    }
  }
  const handleQuantityChange = (itemId) => (value) => {
    if (isBuyMore) {
      const tpCount = licenseMapKeyByProductId[premiumProductId].totalCount || 0
      const productCount = licenseMapKeyByProductId[itemId].totalCount || 0
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

  useEffect(
    () => handleQuantityChange(isBuyMore ? currentItemId : premiumProductId)(1),
    [premiumProductId, currentItemId, isBuyMore]
  )

  return (
    <>
      <AddonList
        marginTop={isBuyMore && '20px'}
        marginBottom={isBuyMore && '10px'}
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
                disabled={premiumProductId === product.id}
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
                  min={1}
                  max={
                    premiumProductId === product.id
                      ? Infinity
                      : quantities[premiumProductId] ||
                        Math.max(
                          licenseMapKeyByProductId[premiumProductId]
                            .totalCount -
                            licenseMapKeyByProductId[product.id].totalCount,
                          1
                        )
                  }
                  disabled={
                    isBuyMore ? false : quantities[product.id] === undefined
                  }
                  onKeyDown={handleKeyPress}
                />
              </NumberInputWrapper>
            )}
            <span
              className="priceCol"
              data-cy={`${camelCase(product.name)}Price`}
            >
              $
              {product.price *
                (isNumber(quantities[product.id]) ? quantities[product.id] : 1)}
            </span>
          </FlexRow>
        ))}
      </AddonList>
      {!isBuyMore && (
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
