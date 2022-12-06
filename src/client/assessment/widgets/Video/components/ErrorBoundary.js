import React from 'react'
import EmptyVideo from './EmptyVideo'

// REACT does not have a functional error boundary ... yet
class VideoPreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: '' }
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  render() {
    const { error } = this.state
    const { children } = this.props
    if (error) {
      return <EmptyVideo />
    }
    return children
  }
}

export default VideoPreviewErrorBoundary
