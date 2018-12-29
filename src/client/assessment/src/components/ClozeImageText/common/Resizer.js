import React from 'react';
import PropTypes from 'prop-types';

// Resizer Component
class Resizer extends React.Component {
  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('mouseup', this.onMouseUp, false);
  }

  onMouseDown = () => {
    const { updateStateResizing, id } = this.props;
    updateStateResizing(id, true);
  }

  onMouseMove = (e) => {
    const { isResizing, funcResizing, id } = this.props;
    if (isResizing) {
      funcResizing(id, e.clientX, e.clientY);
    }
  }

  onMouseUp = () => {
    const { isResizing, updateStateResizing, id } = this.props;
    if (isResizing) {
      updateStateResizing(id, false);
    }
  }

  render() {
    const { resizerWidth, resizerHeight } = this.props;
    const style = {
      width: resizerWidth,
      height: resizerHeight
    };
    return (
      <div
        className="resizer"
        style={style}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}
Resizer.propTypes = {
  id: PropTypes.number.isRequired,
  isResizing: PropTypes.bool.isRequired,
  funcResizing: PropTypes.func.isRequired,
  updateStateResizing: PropTypes.func.isRequired,
  resizerWidth: PropTypes.number.isRequired,
  resizerHeight: PropTypes.number.isRequired
};

export default Resizer;
