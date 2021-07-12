import { themeColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { IconUndo } from '@edulastic/icons'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Box from './Box'
import { asideInMatrix, DEFAULT_DIFFICULTY, randomizer, SIZE } from './Utils'

const NPuzzle = () => {
  const temporal = [...Array(SIZE ** 2 + 1).keys()].splice(1)
  const newTiles = randomizer(DEFAULT_DIFFICULTY, temporal)
  const [tiles, setTiles] = useState(newTiles)
  const [counting, setCounting] = useState(false)
  const [time, setTime] = useState(0)
  const [solved, setSolved] = useState(false)
  const [moves, setMoves] = useState(0)

  const handleClick = (handleNumber) => {
    !counting &&
      setInterval(() => {
        !solved && setTime((prevTime) => prevTime + 1)
      }, 1000)
    !counting && setCounting(true)

    !solved && setMoves(moves + 1)
    const currentTiles = !solved ? asideInMatrix(tiles, handleNumber) : tiles
    setTiles(currentTiles)
  }

  useEffect(() => {
    const sampleTiles = [...tiles].sort((a, b) => (a >= b ? 1 : -1))
    const completed =
      !solved && sampleTiles.every((el, index) => el === tiles[index])

    completed && setSolved(true)
  })

  const resetPuzzle = () => {
    setTiles(newTiles)
    setCounting(false)
    setTime(0)
    setSolved(false)
    setMoves(0)
  }

  return (
    <div>
      <StatsContainer>
        <Info>Moves: {moves}</Info>
        <Info>Time: {time} sec </Info>
      </StatsContainer>
      <Board>
        {tiles.map((number) => (
          <Box
            handleClick={() => handleClick(number)}
            number={number}
            resetPuzzle={resetPuzzle}
          />
        ))}
      </Board>
      {solved && (
        <FlexContainer mt="10px" justifyContent="space-between">
          <SolvedMsg> Solved! </SolvedMsg>
          <IconWrapper onClick={resetPuzzle}>
            <IconUndo /> Reset
          </IconWrapper>
        </FlexContainer>
      )}
    </div>
  )
}

export default NPuzzle

const Board = styled.div`
  width: ${SIZE * 105}px;
  display: block;
  margin: auto;
`
const Info = styled.div`
  display: inline;
  margin: 0 19px 0 10px;
`

const StatsContainer = styled.div`
  font-size: 20px;
  color: ${themeColor};
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`
const SolvedMsg = styled.h4`
  color: ${themeColor};
  font-size: 22px;
  text-align: center;
  margin: 0px;
  font-weight: 600;
`
const IconWrapper = styled.div`
  font-size: 22px;
  color: ${themeColor};
  cursor: pointer;
  svg {
    fill: ${themeColor};
    margin-right: 5px;
  }
`
