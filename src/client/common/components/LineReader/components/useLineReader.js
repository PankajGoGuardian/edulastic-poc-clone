import React from 'react'
import ReactDOM from 'react-dom'
import Container from './Container'

const useLineReader = (close) => {
  const destroy = () => {
    const readers = document.getElementsByClassName('Edu-lineReader')
    Array.from(readers).forEach((element) => {
      const unmountResult = ReactDOM.unmountComponentAtNode(element)
      if (unmountResult && element.parentNode) {
        element.parentNode.removeChild(element)
      }

      if (typeof close === 'function') {
        close()
      }
    })
  }

  const showLineReader = () => {
    const div = document.createElement('div')
    div.setAttribute('class', 'Edu-lineReader')
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.zIndex = '1300'
    div.style.position = 'fixed'

    document.body.appendChild(div)

    ReactDOM.render(<Container destory={destroy} />, div)
  }

  return [showLineReader, destroy]
}
export default useLineReader
