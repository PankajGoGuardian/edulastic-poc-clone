import React, { useMemo, useState } from 'react'
import { EduButton, FlexContainer } from '@edulastic/common'
import FlashIcon from './FlashIcon'
import { clamp } from 'lodash'
import {
  FlipCardsWrapper,
  FlipCardFrontDummy,
  FlipCardBack,
  CardContent,
  StatsContainer,
  StyledIconChecked,
  GridContainer,
  CardStimulus,
} from './styled'
import { Divider, Statistic } from 'antd'
import { testActivityApi } from '@edulastic/api'

const FlipItem = ({
  card = {},
  idx,
  filppedPair = [],
  handleCardFlip,
  isMatched,
}) => (
  <FlipCardsWrapper>
    <FlipCardFrontDummy
      front={!filppedPair.includes(idx) || !isMatched}
      onClick={() => handleCardFlip(idx)}
    >
      <FlashIcon />
    </FlipCardFrontDummy>
    <FlipCardBack
      back={filppedPair.includes(idx) || isMatched}
      onClick={() => handleCardFlip(idx, true)}
    >
      {isMatched && <StyledIconChecked top="15px" right="15px" />}
      <CardContent>
        <CardStimulus
          style={{ maxWidth: '125%' }}
          dangerouslySetInnerHTML={{ __html: card.stimulus }}
        />
      </CardContent>
    </FlipCardBack>
  </FlipCardsWrapper>
)

const FlipCards = ({
  setIsExploding,
  setPhase,
  questions,
  viewMode,
  saveUserResponse,
  setUserAnswer,
  itemId,
  groupId,
  testActivityId,
  finishTest,
  answers,
}) => {
  const [matchedPairs, setMatchedPairs] = useState([])
  const [filppedPair, setFlipped] = useState([])
  const [flipsCount, setFlipsCount] = useState(0)
  const [visitedCards, setVisitedCards] = useState({})
  const [wrongFlipsCount, setWrongFlipsCount] = useState(0)
  const [isProceeding, setProceeding] = useState(false)

  const list = useMemo(() => {
    const { list = [], possibleResponses = [] } = questions[0] || {}
    const _genlist = []
    list.forEach((item) => {
      _genlist.push({
        id: item.value,
        frontStimulus: item.label,
        backStimulus: possibleResponses.find((el) => el.value === item.value)
          ?.label,
      })
    })
    const genlist = _genlist.reduce(
      (a, c) =>
        a.concat(
          ...[
            { key: `${c.id}-f`, id: `${c.id}`, stimulus: c.frontStimulus },
            { key: `${c.id}-b`, id: `${c.id}`, stimulus: c.backStimulus },
          ]
        ),
      []
    )
    return genlist
  }, [questions])

  useEffect(() => {
    if (answers && Object.keys(answers?.[0] || {}).length) {
      setMatchedPairs(Object.keys(answers[0]))
    }
  }, [answers])

  const evaluatePair = (cardAIndex, cardBIndex) => {
    const cardA = list[cardAIndex]
    const cardB = list[cardBIndex]

    const matched = cardA.id === cardB.id
    if (matched) {
      setMatchedPairs((x) => x.concat(cardA.id))
      const questionId = questions[0]?.id
      setUserAnswer(itemId, questionId, {
        ...matchedPairs.reduce((a, c) => ({ ...a, [c]: c }), {
          [cardA.id]: cardB.id,
        }),
      })

      const lastTimeStamp =
        localStorage.getItem('lastTimeStampFlipQuiz') || Date.now()
      saveUserResponse(0, Date.now() - lastTimeStamp, true, groupId, {})
      localStorage.setItem('lastTimeStampFlipQuiz', Date.now())

      if (setIsExploding && matchedPairs.length === list.length / 2 - 1) {
        setIsExploding(true)
      }
      setFlipped([])
    } else if (visitedCards[cardAIndex] || visitedCards[cardBIndex]) {
      setWrongFlipsCount((x) => x + 1)
    }

    setVisitedCards((x) => ({ ...x, [cardAIndex]: 1, [cardBIndex]: 1 }))
    return matched
  }

  const handleCardFlip = (idx, remove) => {
    if (filppedPair.includes(idx) || matchedPairs.includes(list[idx].id)) return
    setFlipsCount((x) => x + 1)
    let shouldUpdateState = true
    if (!remove && filppedPair.length == 1) {
      shouldUpdateState = !evaluatePair(filppedPair[0], idx)
    }
    if (shouldUpdateState) {
      setFlipped((x) => {
        if (remove) {
          return x.filter((y) => y !== idx)
        }
        if (x.length < 2) {
          return x.concat(idx)
        }
        return [idx]
      })
    }
  }

  const handlePhase2Proceed = async () => {
    if (isProceeding) return
    setProceeding(true)
    if (viewMode) {
      setPhase(3)
      return
    }

    try {
      const result = await testActivityApi.updatePhase({
        testActivityId,
        groupId,
        phase: 'report',
      })

      if (result) {
        finishTest({ groupId, preventRouteChange: true })
        setProceeding(false)
        setPhase(3)
      }
    } catch (e) {
      console.log('Error on phase update', e)
    }
  }

  return (
    <>
      <FlexContainer height="calc(100vh - 100px)">
        <GridContainer>
          {list.map((card, idx) => (
            <FlipItem
              key={card.key}
              idx={idx}
              card={card}
              handleCardFlip={handleCardFlip}
              filppedPair={filppedPair}
              isMatched={matchedPairs.includes(card.id)}
            />
          ))}
        </GridContainer>
        <FlexContainer
          flexDirection="column"
          width="400px"
          height="700px"
          padding="20px"
        >
          <StatsContainer>
            <h2>STATISTICS</h2>
            <Divider>
              <Statistic
                title="Score"
                value={clamp(
                  matchedPairs.length - wrongFlipsCount * 0.1,
                  0,
                  matchedPairs.length
                )}
                suffix={` / ${list.length / 2}`}
              />
            </Divider>
            <Divider>
              <Statistic title="# Card Flips" value={flipsCount} />
            </Divider>
            <Divider>
              <Statistic title="# Matched Pairs" value={matchedPairs.length} />
            </Divider>
            <Divider>
              <Statistic
                title="Remaining Pairs"
                value={list.length / 2 - matchedPairs.length}
              />
            </Divider>
          </StatsContainer>
          {!viewMode && (
            <EduButton
              onClick={handlePhase2Proceed}
              loading={isProceeding}
              disabled={isProceeding}
            >
              Submit Test
            </EduButton>
          )}
        </FlexContainer>
      </FlexContainer>
    </>
  )
}

export default FlipCards
