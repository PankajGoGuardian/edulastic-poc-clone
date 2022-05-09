import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { lightFadedBlack } from '@edulastic/colors'

const containerClassName = 'custom-fr-uploading-progressbar'

export const hideProgressBar = () => {
  const readers = document.getElementsByClassName(containerClassName)
  Array.from(readers).forEach((element) => {
    const unmountResult = ReactDOM.unmountComponentAtNode(element)
    if (unmountResult && element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })
}

export const showProgressBar = () => {
  // Remove the existing progress bars
  hideProgressBar()
  // Insert progress bar
  const container = document.createElement('div')
  container.setAttribute('class', containerClassName)
  container.style.position = 'fixed'
  container.style.top = '0px'
  container.style.left = '0px'
  container.style.zIndex = '13000'

  document.body.appendChild(container)

  ReactDOM.render(
    <LoaderContainer>
      <LoaderMask />
      <LoderContent>
        <h3>Uploading</h3>
        <Indeterminate>
          <span />
        </Indeterminate>
      </LoderContent>
    </LoaderContainer>,
    container
  )
}

const LoaderMask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: ${lightFadedBlack};
`

const LoaderContainer = styled.div`
  position: relative;
`

const LoderContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  color: #222222;
  background: #fff;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
    0 1px 18px 0 rgb(0 0 0 / 12%);
  padding: 20px;
  line-height: 1.2;
  border-radius: 6px;
  width: 300px;
  z-index: 1100;

  h3 {
    font-size: 16px;
    margin: 10px 0;
    font-weight: normal;
    font-family: Arial, Helvetica, sans-serif;
  }
`

const Indeterminate = styled.div`
  background: #b3e0fd;
  height: 10px;
  width: 100%;
  margin-top: 20px;
  overflow: hidden;
  position: relative;

  span {
    width: 30% !important;
    position: absolute;
    top: 0;
    background: #0098f7;
    display: block;
    height: 100%;
    -webkit-transition: width 0.2s ease 0s;
    animation: loading 2s linear infinite;
  }
`
