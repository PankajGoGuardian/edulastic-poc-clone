import { deleteRed2 } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import styled from 'styled-components'

export const NoDataWrapper = styled.div`
  min-height: calc(100vh - 190px);
  position: relative;
  padding-bottom: 85px;

  &.default {
    div[class^='NoDataNotification__Wrapper'] {
      display: block;
      transition: all 0.4s ease-in-out;
      position: static;
      div[class^='NoDataNotification__NoDataBox'] {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.4s ease-in-out;
      }
    }
  }

  &.playing {
    div[class^='NoDataNotification__Wrapper'] {
      min-height: 1px !important;
      transition: all 0.4s ease-in-out;
      div[class^='NoDataNotification__NoDataBox'] {
        flex-direction: row;
        justify-content: space-between;
        height: 65px;
        padding: 0px;
        position: absolute;
        top: -50px;
        left: calc(100% - 265px);
        width: 265px;
        transition: all 0.4s ease-in-out;
        img {
          width: 45px;
        }
        p {
          display: none;
        }
      }
    }
  }
`

export const PlaySection = styled.div`
  top: auto;
  position: absolute;
  bottom: 0px;
  display: flex;
  img {
    height: 80px;
    margin-right: 15px;
  }
  h2 {
    font-size: 22px;
    margin: 0px;
  }
`

export const PlayButton = styled(EduButton)`
  &.closeGame {
    background: ${deleteRed2} !important;
    border-color: ${deleteRed2} !important;
    color: white !important;
  }
  &:hover {
    animation: pop 1s ease-in infinite;
  }
  @keyframes pop {
    50% {
      transform: scale(1.1);
    }
  }
`
export const GamingBox = styled.div`
  width: 100%;
  height: 500px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  h1 {
    margin-bottom: 30px;
    text-transform: capitalize;
  }
`
export const ButtonWrapper = styled.div`
  padding-top: 15px;
  display: flex;
`
