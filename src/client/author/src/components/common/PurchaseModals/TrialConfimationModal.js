import { darkGrey, titleColor } from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  notification,
} from '@edulastic/common'
import { curriculumGrades } from '@edulastic/constants'
import { IconUsers } from '@edulastic/icons'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { pick } from 'lodash'
import connect from 'react-redux/es/connect/connect'
import {
  ContentWrapper,
  CurriculumCard,
  StyledTag,
  ModalTitle,
  Thumbnail,
  CardFooter,
  ShareIcon,
  PlaylistId,
  IconText,
  TestStatus,
  ButtonWrapper,
} from './styled'
import {
  cloneThisPlayListAction,
  setCustomTitleModalVisibleAction,
  setIsUsedModalVisibleAction,
} from '../../../../CurriculumSequence/ducks'
import CustomTitleOnCloneModal from '../../../../CurriculumSequence/components/CustomTitleOnCloneModal'
import CloneOnUsePlaylistConfirmationModal from '../../../../CurriculumSequence/components/CloneOnUsePlaylistConfirmationModal'

const PREMIUM_SUBTYPES = ['enterprise', 'premium', 'partial_premium']

const TrialConfirmationModal = ({
  visible,
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
  trialAddOnProductIds = [],
  collections,
  products,
  history,
  subType,
  fetchPlaylists,
  playlists = [],
  useThisPlayList,
  interestedGrades,
  clickedBundleId,
  customTitleModalVisible,
  setCustomTitleModalVisible,
  cloneThisPlayList,
  isUsedModalVisible,
  setIsUsedModalVisible,
  previouslyUsedPlaylistClone = {},
  setClickedBundleId,
}) => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedGrades, setSelectedGrades] = useState([])
  const [customPlaylistTitle, setCustomPlaylistTitle] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  const itemBankProducts =
    products.filter(
      (product) =>
        trialAddOnProductIds.includes(product.id) && product.type !== 'PREMIUM'
    ) || []

  const { GRADES } = curriculumGrades

  const productItemBankIds =
    itemBankProducts.map((product) => product.linkedProductId) || []

  // Check if trial successfully started for all item banks.
  const isTrialPurchaseSuccess = useMemo(() => {
    const availableCollections = collections.filter((collection) => {
      return productItemBankIds.includes(collection._id)
    })

    return availableCollections.length === productItemBankIds.length
  }, [collections, products, trialAddOnProductIds])

  const handleCloseModal = () => {
    showTrialSubsConfirmationAction(false)
    setClickedBundleId(null)
  }

  const handleGoToDashboard = () => {
    handleCloseModal()
    history.push('/author/dashboard')
  }

  // using hasTrial for trial and purchase both
  const {
    subEndDate,
    hasTrial,
    isTrial,
    defaultSelectedItemBankId,
  } = showTrialConfirmationMessage

  useEffect(() => {
    setSelectedProducts([clickedBundleId || defaultSelectedItemBankId])
  }, [defaultSelectedItemBankId, clickedBundleId])

  useEffect(() => {
    setSelectedGrades(interestedGrades)
  }, [interestedGrades])

  const productsToShow = products.filter(
    ({ linkedProductId, name: productName }) =>
      collections.find(({ _id }) => _id === linkedProductId) &&
      productName !== 'Video Quiz and AI Suite'
  )

  const hasOnlyTeacherPremium =
    hasTrial === 'onlyPremiumTrial' &&
    (PREMIUM_SUBTYPES.includes(subType) || subType === 'TRIAL_PREMIUM') // using hasTrial, its get loaded before the confirmation modal opens

  const hasBoughtPremiumWithItemBanks =
    hasTrial === 'haveBothSparkAndPremiumTrial'

  useEffect(() => {
    if (!hasOnlyTeacherPremium) {
      const data = {
        page: 1,
        limit: 20,
        search: {
          grades: selectedGrades,
          filter: 'ENTIRE_LIBRARY',
          status: 'published',
          collections: selectedProducts,
        },
        sort: {},
      }
      fetchPlaylists(data)
    }
  }, [hasOnlyTeacherPremium, selectedGrades, selectedProducts])

  const handleUseThisPlaylist = (playlist) => {
    setSelectedPlaylist(playlist)
    useThisPlayList({
      ...pick(playlist, [
        '_id',
        'title',
        'grades',
        'subjects',
        'customize',
        'authors',
      ]),
      isStudent: false,
      fromUseThis: true,
    })
  }

  const handleDetailsClick = (id) => {
    history.push(`/author/playlists/${id}#review`)
  }

  const handleCloseCustomTitleModal = () => setCustomTitleModalVisible(false)
  const handleOpenCustomTitleModal = () => setCustomTitleModalVisible(true)

  const handleCloseIsUsedModal = () => setIsUsedModalVisible(false)

  const handleUseThisClick = () => {
    if (!customPlaylistTitle) {
      return notification({
        type: 'error',
        msg: 'Missing Playlist Title!',
      })
    }
    cloneThisPlayList({
      ...pick(selectedPlaylist, [
        '_id',
        'grades',
        'subjects',
        'customize',
        'authors',
      ]),
      title: customPlaylistTitle,
      isStudent: false,
      fromUseThis: true,
      forceClone: true,
    })
  }

  const handleGotoMyPlaylist = () => {
    if (previouslyUsedPlaylistClone) {
      const {
        _id,
        title,
        grades,
        subjects,
        customize = false,
        authors,
      } = previouslyUsedPlaylistClone
      useThisPlayList({
        _id,
        title,
        grades,
        subjects,
        customize,
        fromUseThis: true,
        authors,
      })
    }
  }

  const showFooter = hasOnlyTeacherPremium ? (
    <EduButton
      data-cy="goToDashboard"
      onClick={handleGoToDashboard}
      width="180px"
      height="45px"
    >
      Go To Dashboard
    </EduButton>
  ) : (
    []
  )

  const onSelecteProduct = (id) => {
    if (!selectedProducts.includes(id)) {
      setSelectedProducts((product) => [...product, id])
    } else {
      setSelectedProducts((product) => product.filter((el) => el !== id))
    }
  }

  const onSelecteGrade = (value) => {
    const val = value.split(',').map((el) => el.trim()) // here the value is string and in case of high_school grades are '10, 11, 12' so using split.
    if (!selectedGrades.includes(val[0])) {
      setSelectedGrades((grades) => grades.concat(val))
    } else {
      setSelectedGrades((grades) => grades.filter((el) => !val.includes(el)))
    }
  }

  const modalTitle = !isTrial ? (
    <ModalTitle>
      <div>Premium Subscription</div>
      {!hasOnlyTeacherPremium && (
        <div className="expire-on">
          Your subscription will expire on <b>{subEndDate}</b>.
        </div>
      )}
    </ModalTitle>
  ) : (
    <ModalTitle>
      <div>Free Trial Started</div>
      {!hasOnlyTeacherPremium && (
        <div className="expire-on">
          Your trial will expire on <b>{subEndDate}</b>.
        </div>
      )}
    </ModalTitle>
  )

  return (
    <>
      {!isTrialPurchaseSuccess && !!itemBankProducts?.length ? (
        <SpinContainer>
          <StyledSpin size="large" />
        </SpinContainer>
      ) : (
        <CustomModalStyled
          visible={visible && productsToShow.length}
          title={modalTitle}
          onCancel={handleCloseModal}
          width={hasOnlyTeacherPremium ? '700px' : '950px'}
          footer={showFooter}
          centered
        >
          <ModalBody>
            {hasOnlyTeacherPremium ? (
              <p>
                Thanks for trying teacher premium. Your{' '}
                {!isTrial ? 'subscription' : 'trial'} will expire on{' '}
                <b>{subEndDate}</b>.
              </p>
            ) : (
              <>
                <p>
                  {`Thanks for ${isTrial ? 'trying' : 'purchasing'} ${
                    hasBoughtPremiumWithItemBanks
                      ? ' the Teacher Premium and '
                      : ''
                  } additional Spark
                  content. Select the grade and curriculum alignment to get
                  started.`}
                </p>
                <br />
                <div>
                  <FieldLabel color={titleColor}>PRODUCTS</FieldLabel>
                  <ContentWrapper>
                    {productsToShow.map(({ linkedProductId, name }) => (
                      <StyledTag
                        key={linkedProductId}
                        onClick={() => onSelecteProduct(linkedProductId)}
                        className={
                          selectedProducts.includes(linkedProductId) && 'active'
                        }
                      >
                        {name}
                      </StyledTag>
                    ))}
                  </ContentWrapper>
                </div>
                <div>
                  <FieldLabel color={titleColor}>SELECT YOUR GRADES</FieldLabel>
                  <ContentWrapper>
                    {GRADES.map(({ text, value }) => (
                      <StyledTag
                        key={text}
                        onClick={() => onSelecteGrade(value)}
                        className={
                          (selectedGrades.includes(value) ||
                            (text === 'HIGH SCHOOL' &&
                              selectedGrades.includes('10'))) &&
                          'active'
                        }
                      >
                        {text}
                      </StyledTag>
                    ))}
                  </ContentWrapper>
                </div>
                <div>
                  <FieldLabel color={titleColor}>
                    SELECT A PLAYLIST TO GET STARTED
                  </FieldLabel>
                  <ContentWrapper>
                    {playlists.map(({ _source, _id }) => (
                      <CurriculumCard
                        key={_id}
                        onClick={() =>
                          handleUseThisPlaylist({ _id, ..._source })
                        }
                      >
                        <ButtonWrapper
                          position="absolute"
                          className="showHover"
                        >
                          <EduButton
                            width="130px"
                            height="35px"
                            style={{ marginLeft: '0px' }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDetailsClick(_id)
                            }}
                          >
                            Details
                          </EduButton>
                          <EduButton
                            width="130px"
                            height="35px"
                            style={{ marginLeft: '0px' }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleUseThisPlaylist({ _id, ..._source })
                            }}
                          >
                            Use This
                          </EduButton>
                        </ButtonWrapper>
                        <Thumbnail img={_source.thumbnail} />
                        <CardFooter>
                          <PlaylistId>
                            <span>#</span>
                            <span>{_id?.substr(_id.length - 6)}</span>
                          </PlaylistId>

                          <ShareIcon>
                            <IconUsers
                              color={darkGrey}
                              width={10}
                              height={10}
                            />
                            <IconText>{_source.analytics[0].usage}</IconText>
                          </ShareIcon>
                          <TestStatus
                            data-cy="test-status"
                            status={_source.status}
                          >
                            {_source.status}
                          </TestStatus>
                        </CardFooter>
                      </CurriculumCard>
                    ))}
                  </ContentWrapper>
                </div>
              </>
            )}
          </ModalBody>
        </CustomModalStyled>
      )}

      {customTitleModalVisible && (
        <CustomTitleOnCloneModal
          isVisible={customTitleModalVisible}
          onCancel={handleCloseCustomTitleModal}
          handleCreateNewCopy={handleUseThisClick}
          title={customPlaylistTitle}
          setTitle={setCustomPlaylistTitle}
        />
      )}

      {isUsedModalVisible && (
        <CloneOnUsePlaylistConfirmationModal
          isVisible={isUsedModalVisible}
          onCancel={handleCloseIsUsedModal}
          handleGotoMyPlaylist={handleGotoMyPlaylist}
          handleCreateNewCopy={handleOpenCustomTitleModal}
        />
      )}
    </>
  )
}

TrialConfirmationModal.propTypes = {
  showTrialSubsConfirmationAction: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    isUsedModalVisible: state.curriculumSequence?.isUsedModalVisible,
    customTitleModalVisible: state.curriculumSequence?.customTitleModalVisible,
    previouslyUsedPlaylistClone:
      state.curriculumSequence?.previouslyUsedPlaylistClone,
  }),
  {
    setCustomTitleModalVisible: setCustomTitleModalVisibleAction,
    cloneThisPlayList: cloneThisPlayListAction,
    setIsUsedModalVisible: setIsUsedModalVisibleAction,
  }
)(TrialConfirmationModal)

const ModalBody = styled.div`
  p {
    font-weight: normal !important;
  }
`
const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.2);
`

const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`
