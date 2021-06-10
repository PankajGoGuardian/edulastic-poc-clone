import styled from 'styled-components'

export const Heading = styled.h2`
  font-size: 22px;
  border-left: 5px solid lightseagreen;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
`

export const Container = styled.h2`
  padding: 30px;
  margin: 10px;
`

export const PlayerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  margin: 20px 0;
  width: 730px;
  height: 86px;
  border: 1px solid #dfdfdf;
  border-radius: 100px;
`

export const PlayerProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 400px;
  margin: 20px;
`

export const PlayerProgressBar = styled.progress`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 400px;
  height: 20px;
`

export const PlayerBtnsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 70px;
  height: 50px;
  border-right: 1px solid #dfdfdf;
`

export const PlayerBtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 82px;
  border-radius: 100px;
  cursor: pointer;

  i {
    color: lightseagreen;
    font-size: 60px;
  }

  span {
    color: lightseagreen;
    font-size: 16px;
    font-weight: 600;
  }

  &:hover {
    i {
      color: #149c94;
    }

    span {
      color: #149c94;
    }
  }
`
export const PlayerTimer = styled.div`
  font-size: 16px;
  color: #333;
  user-select: none;
`
