import { schoolApi } from '@edulastic/api'
import {
  captureSentryException,
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
  NumberInputStyled,
} from '@edulastic/common'
import { Radio } from 'antd'
import { camelCase } from 'lodash'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import { getUserDetails } from '../../../../student/Login/ducks'
import {
  FlexRow,
  NumberInputWrapper,
  StyledCheckbox,
} from '../../../src/components/common/PurchaseModals/SubscriptionAddonModal/styled'
import {
  getUserFullNameSelector,
  getUserOrgData,
  getUserOrgId,
} from '../../../src/selectors/user'
import { getProducts, getRequestOrSubmitActionStatus, slice } from '../../ducks'
import {
  ModalTitle,
  StyledInputTextArea,
  StyledSelect,
  SubText,
} from '../RequestInvoviceModal/styled'
import { StyledInputNumber } from '../SubmitPOModal/styled'
import { Container, Label, StyledSpin } from './styled'

const getFooterComponent = ({
  handleSubmit,
  isRequestQuoteActionPending,
  disabled,
}) => (
  <AuthorCompleteSignupButton
    renderButton={(handleClick) => (
      <EduButton
        loading={isRequestQuoteActionPending}
        fontSize="14px"
        width="200px"
        height="48px"
        onClick={handleClick}
        inverse
        disabled={disabled}
        data-cy="requestQuoteBtn"
      >
        SUBMIT
      </EduButton>
    )}
    onClick={handleSubmit}
  />
)

const RequestQuoteModal = ({
  visible = false,
  onCancel = () => {},
  userOrgData = {},
  isRequestQuoteActionPending = false,
  handleRequestQuote = () => {},
  userFullname,
  userDetails,
  products,
  userOrgId,
}) => {
  const [enterpriseLicenseType, setLicenseType] = useState('DISTRICT')
  const [studentLicenseCount, setStudentLicenseCount] = useState()
  const [selectedSchools, setSelectedchools] = useState([])
  const [otherInfo, setOtherInfo] = useState()
  const [quantities, setQuantities] = useState({})
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [schoolsInUserDistrict, setSchoolsInDistrict] = useState([])

  const onLicenseTypeChange = async (e) => {
    try {
      setLicenseType(e.target.value)
      if (e.target.value === 'SCHOOL' && !schoolsInUserDistrict.length) {
        const result = await schoolApi.getSchools({
          districtId: userOrgId,
        })
        if (result?.data) {
          const schools = result.data.map((x) => {
            const { name, districtId } = x._source
            return {
              id: x._id,
              name,
              districtId,
            }
          })
          setSchoolsInDistrict(schools)
        }
      } else {
        setSelectedchools([])
      }
    } catch (err) {
      console.log(err)
      captureSentryException(err)
    }
  }

  const handleSetOtherInfo = (e) => setOtherInfo(e.target.value)
  const handleicenseCountChange = (value) => setStudentLicenseCount(value)
  const handleScoolsSelection = (x) => setSelectedchools(x)

  const filterOption = (input, option) =>
    option?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0

  const validateFields = () => {
    if (enterpriseLicenseType === 'SCHOOL' && !selectedSchools.length) {
      notification({
        type: 'warning',
        msg: 'Select atleast one school.',
      })
      return false
    }

    if (!studentLicenseCount) {
      notification({
        type: 'warning',
        msg: 'Please specify the # of licenses.',
      })
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (validateFields()) {
      let schoolOrDistrict

      if (enterpriseLicenseType === 'DISTRICT') {
        const district = userOrgData.districts?.find(
          (d) => d.districtId === userOrgId
        )
        schoolOrDistrict = {
          name: district?.districtName,
          id: district?.districtId,
          state: district?.districtState,
          type: 'DISTRICT',
        }
      } else {
        const school = userOrgData.schools?.find(
          (s) => s.districtId === userOrgId
        )
        schoolOrDistrict = {
          districtId: school?.districtId,
          name: school?.name,
          id: school?.districtId,
          type: 'SCHOOL',
          schools: selectedSchools,
        }
      }

      const reqPayload = {
        userFullname,
        userEmail: userDetails.email,
        documentType: 'QUOTE',
        schoolOrDistrict,
        cartProducts: quantities,
        otherInfo,
        licenseType: 'Enterprise',
        studentLicenseCount,
      }
      handleRequestQuote({
        reqPayload,
        closeCallback: onCancel,
      })
    }
  }

  const productsToShow = products.filter((x) => x.type !== 'PREMIUM') || {}

  const handleKeyPress = (e) => {
    // eslint-disable-next-line no-control-regex
    const specialCharRegex = new RegExp('[0-9\b\t]+') // allow numbers, backspace and tab
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode)
    if (!specialCharRegex.test(pressedKey)) {
      return e.preventDefault()
    }
    return pressedKey
  }

  const handleOnChange = (e, id) => {
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
    const _quantities = {
      ...quantities,
      [itemId]: Math.floor(value),
    }
    setQuantities(_quantities)
  }

  return (
    <CustomModalStyled
      width="580px"
      visible={visible}
      title={<ModalTitle>Request Quote</ModalTitle>}
      onCancel={onCancel}
      footer={[
        getFooterComponent({
          handleSubmit,
          isRequestQuoteActionPending,
          disabled: !products?.length,
        }),
      ]}
      centered
    >
      <Container width="500">
        <SubText mb="30px">
          Let us know what type of price quote or information you&apos;re
          looking for and we&apos;ll be in touch right away!
        </SubText>

        <Label mb="-2px">Enterprise License For</Label>
        <FlexContainer width="250px" flexDirection="column">
          <Radio.Group
            onChange={onLicenseTypeChange}
            value={enterpriseLicenseType}
          >
            <Radio data-cy="districtRadio" value="DISTRICT">
              District
            </Radio>
            <Radio data-cy="schoolRadio" value="SCHOOL">
              School
            </Radio>
          </Radio.Group>
        </FlexContainer>

        {enterpriseLicenseType === 'SCHOOL' && (
          <>
            <Label required>Select Schools</Label>
            <StyledSelect
              mode="multiple"
              placeholder="Select schools"
              getPopupContainer={(node) => node.parentNode}
              value={selectedSchools}
              onChange={handleScoolsSelection}
              optionFilterProp="children"
              filterOption={filterOption}
              data-cy="selectSchool"
            >
              {schoolsInUserDistrict.map(({ id, name }) => (
                <StyledSelect.Option value={id}>{name}</StyledSelect.Option>
              ))}
            </StyledSelect>
          </>
        )}

        <Label width="220px" required>
          # Student Licenses{' '}
        </Label>
        <StyledInputNumber
          min={1}
          step={1}
          type="number"
          placeholder="Add the # of licenses"
          value={studentLicenseCount}
          onChange={handleicenseCountChange}
          data-cy="studentLicenseField"
        />

        <FlexContainer
          marginBottom="10px"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Label width="220px">Add Ons</Label>
        </FlexContainer>
        {productsToShow && productsToShow.length ? (
          productsToShow.map((product) => (
            <FlexRow key={product.id}>
              <StyledCheckbox
                data-cy={`${camelCase(product.name)}Checkbox`}
                value={product.name}
                onChange={(e) => handleOnChange(e, product.id)}
                checked={selectedProductIds.includes(product.id)}
                textTransform="none"
              >
                {product.name}
              </StyledCheckbox>
              <NumberInputWrapper style={{ paddingRight: '20px' }}>
                <NumberInputStyled
                  min={1}
                  type="number"
                  value={quantities[product.id]}
                  onChange={handleQuantityChange(product.id)}
                  height="28px"
                  width="80px"
                  data-cy={product.type}
                  onKeyDown={handleKeyPress}
                  disabled={quantities[product.id] === undefined}
                />
              </NumberInputWrapper>
            </FlexRow>
          ))
        ) : (
          <StyledSpin />
        )}

        <br />

        <Label>What type of information can we help you with?</Label>
        <StyledInputTextArea
          placeholder="Type your answer"
          rows={4}
          value={otherInfo}
          onChange={handleSetOtherInfo}
          data-cy="otherCommentsField"
        />
      </Container>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userOrgData: getUserOrgData(state),
    userOrgId: getUserOrgId(state),
    isRequestQuoteActionPending: getRequestOrSubmitActionStatus(state),
    userFullname: getUserFullNameSelector(state),
    userDetails: getUserDetails(state),
    products: getProducts(state),
  }),
  {
    handleRequestQuote: slice.actions.requestInvoiceAction,
  }
)(RequestQuoteModal)
