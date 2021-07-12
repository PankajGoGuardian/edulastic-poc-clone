import { themeColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { IconUndo } from '@edulastic/icons'
import React from 'react'
import styled from 'styled-components'
import './App.css'
import Board from './Board'
// import GameData from './data/game2.json';
// import {sudokuHandler} from './data/generateSudoku'
import { getRandomState } from './sampleData'

let GameData = getRandomState()

class SudokuGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(81).fill(0),
      loading: true,
      movesLeft: 0,
    }
  }

  setInitialState() {
    const squares = this.generateInitialBoard(GameData.squares)
    this.setState({
      squares,
      loading: false,
      movesLeft: 81 - GameData.squares.length,
      history: [
        {
          squares,
        },
      ],
    })
  }

  componentDidMount() {
    debugger
    if (GameData) {
      this.setInitialState()
    }
  }

  resetSudoku(){
    debugger
    GameData = getRandomState()
    this.setInitialState()
  }

  // Returns the values of the initial game form x & y point into the main Array
  getInitialSquareValue(x, y, initData) {
    const sqaureValues = initData
    for (let i = x; i < 81; i++) {
      if (
        sqaureValues[i] &&
        sqaureValues[i].x === x &&
        sqaureValues[i].y === y
      ) {
        return sqaureValues[i].value
      }
    }
    return null
  }

  generateInitialBoard(gameData) {
    const squares = []
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const value = this.getInitialSquareValue(i, j, gameData)
        const isInitValue = !!value
        const square = {
          x: i,
          y: j,
          block: 0,
          value,
          isInitValue,
          error: false,
        }
        squares.push(square)
      }
    }
    return squares
  }

  handleClick(e, i) {
    // TODO: Validar numero, conteo de movimientos
    const inputValue = e.target.value
    let movesLeft = this.state.movesLeft
    let errorMessage = false
    const history = this.state.history.slice()
    const currentsquares = history.slice(history.length - 1)

    if (isNaN(inputValue)) {
      e.target.value = ''
      return null
    }
    if (inputValue.length > 1) {
      e.target.value = inputValue.charAt(inputValue.length - 1)
    }

    // Validates the new input is not repeated in the board
    currentsquares[0].squares[i].value = e.target.value
    if (
      !checkLineValues(currentsquares[0].squares, currentsquares[0].squares[i])
    ) {
      errorMessage = true
      // console.log("number ya existe en la linea");
    }
    if (
      !checkColumnValues(
        currentsquares[0].squares,
        currentsquares[0].squares[i]
      )
    ) {
      errorMessage = true
      // console.log("number ya existe en la columna");
    }
    if (
      !checkBlockValues(currentsquares[0].squares, currentsquares[0].squares[i])
    ) {
      errorMessage = true
      // console.log("number ya existe en el block");
    }

    // Calculates how many moves are left to finish the game
    if (e.target.value.length > 0) {
      movesLeft--
    }
    if (e.target.value == '') {
      movesLeft++
      errorMessage = false
    }
    currentsquares[0].squares[i].error = errorMessage

    // Setstate with new movement
    this.setState({
      history: history.concat({ squares: currentsquares[0].squares }),
      movesLeft,
    })
  }

  render() {
    const squares = this.state.squares
    const movesLeft = this.state.movesLeft
    return (
      <div>
        <div className="game-info">
          <FlexContainer mt="10px" justifyContent="space-between">
            {movesLeft === 0 && <SolvedMsg> You Won! </SolvedMsg>}
            <IconWrapper onClick={this.resetSudoku}>
              <IconUndo /> Reset
            </IconWrapper>
          </FlexContainer>
        </div>

        <div className="game">
          <div className="game-board">
            {this.state.loading ? (
              'loading...'
            ) : (
              <Board
                squares={squares}
                onChange={(e, i) => this.handleClick(e, i)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default SudokuGame

// ====================== Helper functions

function checkLineValues(squares, square) {
  // Start point index in squares for every line
  const lineStart = [0, 9, 18, 27, 36, 45, 54, 63, 72]

  // Check for the same number in the same line
  const k = lineStart[square.x]
  for (let i = k; i < 9 + k; i++) {
    // Checks is not the same square and checks the value
    if (squares[i].y !== square.y && squares[i].value == square.value) {
      return false
    }
  }
  return true
}

function checkColumnValues(squares, square) {
  // Start point index in squares for every line
  const lineStart = [0, 9, 18, 27, 36, 45, 54, 63, 72]

  // Check for the same number in the same column
  for (let i = 0; i < 9; i++) {
    // To find the index where to look, the index is the sum of the lineStart and the column number
    const objSquare = squares[lineStart[i] + square.y]
    // Checks is not the same square and checks the value
    if (objSquare.x != square.x && objSquare.value == square.value) {
      return false
    }
  }
  return true
}

function checkBlockValues(squares, square) {
  // Start point index in squares for every block
  const lineStart = [0, 3, 6, 27, 30, 33, 54, 57, 60]

  // square.x & square.y < 3 = Block 1
  let startIndex = lineStart[0]
  if (square.x < 3 && square.y > 2 && square.y < 6) {
    startIndex = lineStart[1] // Block 2
  } else if (square.x < 3 && square.y > 5) {
    startIndex = lineStart[2] // Block 3
  } else if (square.x > 2 && square.x < 6 && square.y < 3) {
    startIndex = lineStart[3] // Block 4
  } else if (square.x > 2 && square.x < 6 && square.y > 2 && square.y < 6) {
    startIndex = lineStart[4] // Block 5
  } else if (square.x > 2 && square.x < 6 && square.y > 5) {
    startIndex = lineStart[5] // Block 6
  } else if (square.x > 5 && square.y < 3) {
    startIndex = lineStart[6] // Block 7
  } else if (square.x > 5 && square.y > 2 && square.y < 6) {
    startIndex = lineStart[7] // Block 8
  } else if (square.x > 5 && square.y > 5) {
    startIndex = lineStart[8] // Block 9
  }

  let increment = 0
  // Starts looking at the begining of the block of the square
  for (let i = 0; i < 9; i++) {
    // increments acording to the row in the block
    if (i > 2 && i < 6) {
      increment = 6
    } else if (i > 5) {
      increment = 12
    }
    // Checks values in the block
    const sq = squares[startIndex + i + increment]
    if (sq.x != square.x && sq.y != square.y && sq.value == square.value) {
      return false
    }
  }
  return true
}

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
