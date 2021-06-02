import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Radio } from 'antd'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { emailRegex } from '../../../../common/utils/helpers'
import {
  getUserFullNameSelector,
  getUserOrgData,
} from '../../../src/selectors/user'
import {
  slice,
  getInvoiceRequestStatus,
  getSubscriptionSelector,
  getProducts,
} from '../../ducks'
import {
  ModalTitle,
  SubText,
  StyledInput,
  StyledInputTextArea,
  StyledSelect,
} from '../RequestInvoviceModal/styled'
import { Label, Container, StyledSpin } from './styled'
import { getUserDetails } from '../../../../student/Login/ducks'
import ProductsList from '../../../src/components/common/PurchaseModals/ProductsList'
import { schoolApi } from '@edulastic/api'

const getFooterComponent = ({
  handleSubmit,
  isRequestInvoiceActionPending,
  disabled,
}) => (
  <EduButton
    loading={isRequestInvoiceActionPending}
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
  isRequestInvoiceActionPending = false,
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
    setLicenseType(e.target.value)
    if (e.target.value === 'SCHOOL' && !schoolsInUserDistrict.length) {
      const result = await schoolApi.getSchools({
        districtId: userDetails.districtIds[0],
        search: { status: [2] },
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
    } else {
      const flag = emailRegex.test(userEmail.trim())
      if (!flag) {
        notification({
          type: 'warning',
          msg: 'Invalid email format specified.',
        })
        return false
      }
    }

    if (bookkeeperEmails) {
      const flag = bookkeeperEmails
        .split(',')
        .every((email) => emailRegex.test(email.trim()))
      if (!flag) {
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
              type: 'SCHOOLS',
              schools: selectedSchools, // NEED MORE CLARITY ON THIS FIELD IN PAYLOAD
            }
      const emails = bookkeeperEmails
        ? bookkeeperEmails
            .split(',')
            .map((email) => email.trim())
            .filter((x) => x)
        : []
      const payload = {
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
      //   console.log('---->', payload)
      handleRequestQuote(payload)
    }
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
          isRequestInvoiceActionPending,
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

        {products && products.length ? (
          <ProductsList
            showMultiplePurchaseModal
            isRequestingQuote
            productsToshow={products}
            setTotalPurchaseAmount={() => {}}
            teacherPremium={products?.[0]}
            setQuantities={setQuantities}
            quantities={quantities}
            setSelectedProductIds={setSelectedProductIds}
            selectedProductIds={selectedProductIds}
          />
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
    isRequestInvoiceActionPending: getInvoiceRequestStatus(state),
    userSubscription: getSubscriptionSelector(state),
    userFullname: getUserFullNameSelector(state),
    userDetails: getUserDetails(state),
    products: getProducts(state),
  }),
  {
    handleRequestQuote: slice.actions.requestInvoiceAction,
  }
)(RequestQuoteModal)
