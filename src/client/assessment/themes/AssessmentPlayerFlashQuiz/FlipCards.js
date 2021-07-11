import React, { useMemo, useState } from 'react'
import { EduButton, FlexContainer, Stimulus } from '@edulastic/common'
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

const _list = [
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

const list = _list.reduce(
  (a, c) =>
    a.concat(
      ...[
        { key: `${c.id}-a`, id: `${c.id}`, stimulus: c.frontStimulus },
        { key: `${c.id}-b`, id: `${c.id}`, stimulus: c.backStimulus },
      ]
    ),
  []
)

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

const FlipCards = ({ setIsExploding, setPhase, questions, viewMode }) => {
  const [matchedPairs, setMatchedPairs] = useState([])
  const [filppedPair, setFlipped] = useState([])
  const [flipsCount, setFlipsCount] = useState(0)
  const [visitedCards, setVisitedCards] = useState({})
  const [wrongFlipsCount, setWrongFlipsCount] = useState(0)

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
            { key: `${c.id}-a`, id: `${c.id}`, stimulus: c.frontStimulus },
            { key: `${c.id}-b`, id: `${c.id}`, stimulus: c.backStimulus },
          ]
        ),
      []
    )
    return genlist
  }, [questions])

  const evaluatePair = (cardAIndex, cardBIndex) => {
    const cardA = list[cardAIndex]
    const cardB = list[cardBIndex]

    const matched = cardA.id === cardB.id
    if (matched) {
      setMatchedPairs((x) => x.concat(cardA.id))
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

  const handlePhase2Proceed = () => setPhase && setPhase(3)

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
            <EduButton onClick={handlePhase2Proceed}>Submit Test</EduButton>
          )}
        </FlexContainer>
      </FlexContainer>
    </>
  )
}

export default FlipCards
