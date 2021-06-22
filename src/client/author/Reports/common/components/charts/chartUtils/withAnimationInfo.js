import React from 'react'

/**
 * adds `animating` or `animation-ended` class to show animation status
 * supported Elements:
 *   Bar,
 *   Radar,
 *   Funnel,
 *   RadialBar,
 *   Area,
 *   Pie,
 * 	 Line,
 *   Treemap,
 *   Scatter,
 * list of elements which support onAnimationEnd: [here](https://github.com/recharts/recharts/search?p=1&q=onAnimationEnd)
 * @param {React.ReactElement} Element element to modify
 * @returns {React.ReactElement} Updated Element
 */
const withAnimationInfo = (Element) => {
  class NewElement extends Element {
    state = { animating: false }

    _onAnimationStart = (...args) => {
      this.setState({ animating: true })
      return this.props.onAnimationStart(...args)
    }

    _onAnimationEnd = (...args) => {
      this.setState({ animating: false })
      return this.props.onAnimationEnd(...args)
    }

    render() {
      let className = this.props.className || ''
      className += ` ${this.state.animating ? 'animating' : 'animation-ended'}`
      const newProps = {
        ...this.props,
        onAnimationStart: this._onAnimationStart,
        onAnimationEnd: this._onAnimationEnd,
        className,
      }
      return <Element {...newProps} />
    }
  }
  return NewElement
}
export default withAnimationInfo
