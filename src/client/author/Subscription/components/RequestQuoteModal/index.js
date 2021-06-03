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
import { emailRegex } from '../../../../common/utils/helpers'
import { getUserDetails } from '../../../../student/Login/ducks'
import {
  FlexRow,
  NumberInputWrapper,
  StyledCheckbox,
} from '../../../src/components/common/PurchaseModals/SubscriptionAddonModal/styled'
import {
  getUserFullNameSelector,
  getUserOrgData,
} from '../../../src/selectors/user'
import {
  getProducts,
  getRequestOrSubmitActionStatus,
  getSubscriptionSelector,
  slice,
} from '../../ducks'
import {
  ModalTitle,
  StyledInput,
  StyledInputTextArea,
  StyledSelect,
  SubText,
} from '../RequestInvoviceModal/styled'
import { Container, Label, StyledSpin } from './styled'

const getFooterComponent = ({
  handleSubmit,
  isRequestQuoteActionPending,
  disabled,
}) => (
  <EduButton
    loading={isRequestQuoteActionPending}
    fontSize="14px"
    width="200px"
    height="48px"
    onClick={handleSubmit}
    inverse
    disabled={disabled}
  >
    SUBMIT
  </EduButton>
)

const RequestQuoteModal = ({
  visible = false,
  onCancel = () => {},
  userOrgData = {},
  isRequestQuoteActionPending = false,
  handleRequestQuote = () => {},
  userSubscription,
  userFullname,
  userDetails,
  products,
}) => {
  const [enterpriseLicenseType, setLicenseType] = useState('DISTRICT')
  const [userEmail, setUserEmail] = useState()
  const [bookkeeperEmails, setBookkeeperEmails] = useState()
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
          districtId: userDetails.districtIds[0],
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
  const onEmailChange = (e) => setUserEmail(e.target.value)
  const handleBookkeepersChange = (e) => setBookkeeperEmails(e.target.value)
  const handleSetOtherInfo = (e) => setOtherInfo(e.target.value)
  const handleScoolsSelection = (x) => setSelectedchools(x)

  const filterOption = (input, option) =>
    option?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0

  const validateFields = () => {
    if (!userEmail) {
      notification({
        type: 'warning',
        msg: 'Email address is required for us to send in the quote.',
      })
      return false
    }
    const flag = emailRegex.test(userEmail.trim())
    if (!flag) {
      notification({
        type: 'warning',
        msg: 'Invalid email format specified.',
      })
      return false
    }

    if (bookkeeperEmails) {
      const _flag = bookkeeperEmails
        .split(',')
        .every((email) => emailRegex.test(email.trim()))
      if (!_flag) {
        notification({
          type: 'warning',
          msg: 'Invalid email format specified for Bookkeeper(s).',
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = () => {
    if (validateFields()) {
      const schoolOrDistrict =
        enterpriseLicenseType === 'DISTRICT'
          ? {
              name: userOrgData.districts?.[0]?.districtName,
              id: userOrgData.districts?.[0]?.districtId,
              type: 'DISTRICT',
            }
          : {
              districtId: userOrgData.schools?.[0]?.districtId,
              name: userOrgData.schools?.[0]?.name,
              id: userOrgData.schools?.[0]?.districtId,
              type: 'SCHOOL',
              schools: selectedSchools, // NEED MORE CLARITY ON THIS FIELD IN PAYLOAD
            }
      const emails = bookkeeperEmails
        ? bookkeeperEmails
            .split(',')
            .map((email) => email.trim())
            .filter((x) => x)
        : []
      const reqPayload = {
        userFullname,
        userEmail,
        documentType: 'QUOTE',
        schoolOrDistrict,
        bookkeeperEmails: emails.length ? emails : undefined,
        cartProducts: quantities,
        otherInfo,
        licenseType:
          userSubscription.subType === 'enterprise'
            ? 'Enterprise'
            : 'Teacher Premium',
      }
      //   console.log('---->', reqPayload)
      handleRequestQuote({
        reqPayload,
        closeCallback: onCancel,
      })
    }
  }

  const productsToShow = products.filter((x) => x.type !== 'PREMIUM') || {}

  const productWithStudentLicense = [
    {
      id: '604b8207144578097fd1f12f',
      name: 'student license',
      type: 'studentLicense',
    },
    ...productsToShow,
  ]

  console.log('productWithStudentLicense', productWithStudentLicense)

  const handleKeyPress = (e) => {
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
          Let us know what type of price quote or information you're looking for
          and we'll be in touch right away!
        </SubText>

        <Label mb="-2px">Enterprise License For</Label>
        <FlexContainer width="250px" flexDirection="column">
          <Radio.Group
            onChange={onLicenseTypeChange}
            value={enterpriseLicenseType}
          >
            <Radio value="DISTRICT">District</Radio>
            <Radio value="SCHOOL">School</Radio>
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
            >
              {schoolsInUserDistrict.map(({ id, name }) => (
                <StyledSelect.Option value={id}>{name}</StyledSelect.Option>
              ))}
            </StyledSelect>
          </>
        )}

        <Label required>Email Address</Label>
        <SubText>We'll send your quote to this address</SubText>
        <StyledInput
          placeholder="Type your email address"
          value={userEmail}
          onChange={onEmailChange}
        />

        <Label>Person to email documentation to, such as a bookkeeper</Label>
        <StyledInput
          placeholder="Type email address"
          value={bookkeeperEmails}
          onChange={handleBookkeepersChange}
        />

        <Label>What type of information can we help you with?</Label>
        <StyledInputTextArea
          placeholder="Type your answer"
          rows={4}
          value={otherInfo}
          onChange={handleSetOtherInfo}
        />

        {productWithStudentLicense && productWithStudentLicense.length ? (
          productWithStudentLicense.map((product) => (
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
      </Container>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userOrgData: getUserOrgData(state),
    isRequestQuoteActionPending: getRequestOrSubmitActionStatus(state),
    userSubscription: getSubscriptionSelector(state),
    userFullname: getUserFullNameSelector(state),
    userDetails: getUserDetails(state),
    products: getProducts(state),
  }),
  {
    handleRequestQuote: slice.actions.requestInvoiceAction,
  }
)(RequestQuoteModal)
