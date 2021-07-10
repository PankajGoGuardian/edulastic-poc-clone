import { EduButton, FlexContainer } from '@edulastic/common'
import ConfirmationModal from '@edulastic/common/src/components/SimpleConfirmModal'
import { IconBookmark, IconCheckSmall, IconTestBank } from '@edulastic/icons'
import React, { useState } from 'react'
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

const list = [
  {
    id: '1',
    frontStimulus: 'Facebook',
    backStimulus: 'A Social Networking Company',
  },
  {
    id: '2',
    frontStimulus: 'Google',
    backStimulus: 'A Search Engine Company',
  },
  {
    id: '3',
    frontStimulus: 'Amazon',
    backStimulus: 'An Ecommerce Company',
  },
  {
    id: '4',
    frontStimulus: 'Netflix',
    backStimulus: 'A Media Streaming Company',
  },
  {
    id: '5',
    frontStimulus: 'Apple',
    backStimulus: 'A Smart Phone Company',
  },
  {
    id: '6',
    frontStimulus: 'Flipkart',
    backStimulus: 'An Ecommerce Company',
  },
  {
    id: '7',
    frontStimulus: 'Hotstar',
    backStimulus: 'A Media Streaming Company',
  },
  {
    id: '8',
    frontStimulus: 'OnePlus',
    backStimulus: 'A Smart Phone Company',
  },
  {
    id: '9',
    frontStimulus: 'Goldman',
    backStimulus: 'A FinTech Company',
  },
  {
    id: '10',
    frontStimulus: 'Snapwiz',
    backStimulus: 'An EdTech Company',
  },
]

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

const FlashCards = ({ setPhase }) => {
  const [backView, setBackView] = useState()
  const [currentActiveIndex, setCurrentActive] = useState(0)
  const [bookmarks, setBookmarks] = useState([])
  const [marked, setMarked] = useState([])
  const [isConfirmationModal, setConfirmationModal] = useState(false)

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

  const handlePhase1Proceed = (...x) => setPhase(2)

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
                {list[currentActiveIndex].frontStimulus}
              </CardContent>
            </FlashCardFront>
            <FlashCardBack back={backView} onClick={handleCardFlip}>
              <CardContent>{list[currentActiveIndex].backStimulus}</CardContent>
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
          <EduButton onClick={handleMarked}>
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
            onClick={handleTakeTest}
            disabled={list.length !== marked.length}
          >
            <IconTestBank />
            Take Test
          </EduButton>
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
