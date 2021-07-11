import { themeColor } from '@edulastic/colors'
import { EduButton, FlexContainer } from '@edulastic/common'
import ConfirmationModal from '@edulastic/common/src/components/SimpleConfirmModal'
import React, { useMemo, useState } from 'react'
import {
  IconBookmark,
  IconCheckSmall,
  IconCorrect,
  IconTestBank,
} from '@edulastic/icons'
import { Modal } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import CardControls from './CardControls'
import {
  FlashCardsWrapper,
  FlashCardFront,
  FlashCardBack,
  CardContent,
  CardListItemWrapper,
  CardListItem,
  CardNo,
  StyledIconBookmark,
  StyledIconChecked,
} from './styled'
import { testActivityApi } from '@edulastic/api'

const CardItem = ({
  card = {},
  idx,
  handleJumpTo,
  currentActiveIndex,
  bookmarks = [],
  marked = [],
}) => (
  <CardListItem onClick={() => handleJumpTo(idx - 1)}>
    {marked.includes(card.id) ? (
      <StyledIconChecked />
    ) : (
      bookmarks.includes(card.id) && <StyledIconBookmark />
    )}
    <FlexContainer width="100%" alignItems="center" justifyContent="flex-start">
      <CardNo active={currentActiveIndex === idx - 1}>{idx}</CardNo>
      {card.frontStimulus}
    </FlexContainer>
  </CardListItem>
)

const FlashCards = ({
  setPhase = () => {},
  questions = [],
  viewMode,
  testActivityId,
  groupId,
}) => {
  const [backView, setBackView] = useState()
  const [currentActiveIndex, setCurrentActive] = useState(0)
  const [bookmarks, setBookmarks] = useState([])
  const [marked, setMarked] = useState([])
  const [isConfirmationModal, setConfirmationModal] = useState(false)
  const [isProceeding, setProceeding] = useState(false)

  const list = useMemo(() => {
    const { list = [], possibleResponses = [] } = questions[0] || {}
    const genlist = []
    list.forEach((item) => {
      genlist.push({
        id: item.value,
        frontStimulus: item.label,
        backStimulus: possibleResponses.find((el) => el.value === item.value)
          ?.label,
      })
    })
    return genlist
  }, [questions])

  const handleCardFlip = () => setBackView((x) => !x)
  const handleNext = () => {
    setBackView(false)
    setCurrentActive((x) => x + 1)
  }
  const handlePrev = () => {
    setBackView(false)
    setCurrentActive((x) => x - 1)
  }
  const handleJumpTo = (x) => {
    setBackView(false)
    setCurrentActive(x)
  }
  const handlebookmark = () =>
    setBookmarks((x) => x.concat(list[currentActiveIndex]?.id))
  const handleUnBookmark = () =>
    setBookmarks((x) => x?.filter?.((y) => y !== list[currentActiveIndex]?.id))

  const handleMarked = () => {
    setMarked((x) =>
      !x.includes(list[currentActiveIndex]?.id)
        ? x.concat(list[currentActiveIndex]?.id)
        : x
    )
    if (currentActiveIndex < list.length - 1) {
      handleNext()
    }
  }

  const handleTakeTest = () => setConfirmationModal(true)
  const handleTakeTestCancel = () => setConfirmationModal(false)

  const handlePhase1Proceed = async () => {
    if (isProceeding) return
    setProceeding(true)
    if (viewMode) {
      setPhase(2)
      return
    }

    try {
      const result = await testActivityApi.updatePhase({
        testActivityId,
        groupId,
        phase: 'assignment',
      })

      if (result) {
        setConfirmationModal(false)
        setProceeding(false)
        setPhase(2)
      }
    } catch (e) {
      console.log('Error on phase update', e)
    }
  }

  const handleAllMarked = () => {
    Modal.confirm({
      title: 'Are You Sure To Mark All As Read ?',
      content:
        'Once the questions as marked as done, you cannot reverse the change. Are you sure you want to proceed with this change ?',
      onOk: () => {
        setMarked(list.map((x) => x.id))
        Modal.destroyAll()
      },
      onCancel: () => {},
      okText: 'Yes, Proceed',
      cancelText: 'No, Cancel',
      centered: true,
      width: 500,
      okButtonProps: {
        style: { background: themeColor },
      },
    })
  }

  return (
    <FlexContainer height="calc(100vh - 100px)">
      <FlexContainer flexDirection="column">
        <FlexContainer
          flexDirection="column"
          justifyContent="flex-start"
          height="520px"
          mt="20px"
        >
          <FlashCardsWrapper>
            <FlashCardFront front={!backView} onClick={handleCardFlip}>
              <CardContent>
                {list[currentActiveIndex]?.frontStimulus}
              </CardContent>
            </FlashCardFront>
            <FlashCardBack back={backView} onClick={handleCardFlip}>
              <CardContent>
                {list[currentActiveIndex]?.backStimulus}
              </CardContent>
            </FlashCardBack>
          </FlashCardsWrapper>
          <CardControls
            disablePrev={currentActiveIndex === 0}
            disableNext={currentActiveIndex >= list.length - 1}
            totalCards={list.length}
            cardNo={currentActiveIndex + 1}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </FlexContainer>

        <FlexContainer alignItems="center" mt="60px">
          <EduButton
            onClick={handleMarked}
            disabled={marked.includes(list[currentActiveIndex]?.id)}
          >
            <IconCheckSmall />
            Mark As Read
          </EduButton>
          <EduButton
            disabled={marked.includes(list[currentActiveIndex]?.id)}
            onClick={
              bookmarks.includes(list[currentActiveIndex]?.id)
                ? handleUnBookmark
                : handlebookmark
            }
          >
            {' '}
            <IconBookmark />{' '}
            {bookmarks.includes(list[currentActiveIndex]?.id) &&
            !marked.includes(list[currentActiveIndex]?.id)
              ? 'UnBookmark'
              : 'Bookmark'}
          </EduButton>
          <EduButton
            onClick={handleAllMarked}
            disabled={marked.length === list.length}
          >
            <IconCorrect />
            Mark All As Read
          </EduButton>
          {!viewMode && (
            <EduButton
              onClick={handleTakeTest}
              disabled={list.length !== marked.length}
            >
              <IconTestBank />
              Take Test
            </EduButton>
          )}
        </FlexContainer>
      </FlexContainer>

      <CardListItemWrapper>
        <PerfectScrollbar>
          {list.map((card, i) => (
            <CardItem
              key={card.id}
              card={card}
              idx={i + 1}
              handleJumpTo={handleJumpTo}
              currentActiveIndex={currentActiveIndex}
              bookmarks={bookmarks}
              marked={marked}
            />
          ))}
        </PerfectScrollbar>
      </CardListItemWrapper>

      {isConfirmationModal && (
        <ConfirmationModal
          visible={isConfirmationModal}
          title="FlashQuiz | Learn & Memorize"
          description={`Note: Once this Phase is completed you cannot revisit it again! 
          Click on 'Proceed To Test' to continue to the Assessement Phase. 
          Click 'Cancel' to go back to Learn & Memorize Phase and revisit the Flash Cards.`}
          buttonText="Proceed To Test"
          onProceed={handlePhase1Proceed}
          onCancel={handleTakeTestCancel}
        />
      )}
    </FlexContainer>
  )
}

export default FlashCards
