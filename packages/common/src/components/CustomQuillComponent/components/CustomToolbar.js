import React, { Component } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import ResponseButton from './ResponseButton';
import ThreeDotButton from './ThreeDotButton';

class CustomToolbar extends Component {
  static ONE_LINE_HEIGHT = 50;

  state = {
    isHideRest: false,
    top: -60
  };

  ref = React.createRef();

  componentDidMount() {
    window.addEventListener('resize', debounce(this.resize, 500));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentWillUpdate(nextProps) {
    const { active } = this.props;

    if (nextProps.active && !active) {
      this.resize();
    }
  }

  resize = () => {
    const { current: element } = this.ref;
    const { clientHeight } = element;

    if (clientHeight > CustomToolbar.ONE_LINE_HEIGHT) {
      this.setState(
        {
          isHideRest: true
        },
        () => this.setTopStyle()
      );
    }
  };

  setTopStyle() {
    const { current: element } = this.ref;
    let top = -15;

    if (element) {
      top = -element.offsetHeight - 15;
    }

    this.setState({
      top
    });
  }

  _showMore = () => {
    this.setState(
      {
        isHideRest: false
      },
      () => this.setTopStyle()
    );
  };

  get containerStyle() {
    const { active, maxWidth } = this.props;
    const { isHideRest, top } = this.state;

    return {
      top,
      display: 'block',
      overflow: isHideRest ? 'hidden' : 'auto',
      whiteSpace: isHideRest ? 'nowrap' : 'pre-wrap',
      opacity: active ? 1 : 0,
      zIndex: active ? 1000 : -1,
      maxWidth,
      width: '100%'
    };
  }

  render() {
    const { id, showResponseBtn } = this.props;
    const { isHideRest } = this.state;

    return (
      <div id={id} ref={this.ref} style={this.containerStyle} className="toolbars">
        <span className="ql-formats">
          <select className="ql-font" />
          <select className="ql-size" />
        </span>
        <span className="ql-formats">
          <button className="ql-bold" type="button" />
          <button className="ql-italic" type="button" />
          <button className="ql-underline" type="button" />
          <button className="ql-strike" type="button" />
        </span>
        <span className="ql-formats">
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub" type="button" />
          <button className="ql-script" value="super" type="button" />
        </span>
        <span className="ql-formats">
          <button className="ql-header" value="1" type="button" />
          <button className="ql-header" value="2" type="button" />
          <button className="ql-blockquote" type="button" />
          <button className="ql-code-block" type="button" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" type="button" />
          <button className="ql-list" value="bullet" type="button" />
          <button className="ql-indent" value="-1" type="button" />
          <button className="ql-indent" value="+1" type="button" />
        </span>
        <span className="ql-formats">
          <button className="ql-direction" value="rtl" type="button" />
          <select className="ql-align" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" type="button" />
          <button className="ql-image" type="button" />
          <button className="ql-video" type="button" />
          <button className="ql-formula" type="button" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" type="button" />
        </span>
        {showResponseBtn && (
          <span className="ql-formats">
            <button className="ql-insertStar" type="button">
              <ResponseButton />
            </button>
          </span>
        )}
        {isHideRest && <ThreeDotButton onClick={this._showMore} />}
      </div>
    );
  }
}

CustomToolbar.propTypes = {
  maxWidth: PropTypes.any.isRequired,
  showResponseBtn: PropTypes.bool,
  active: PropTypes.bool,
  id: PropTypes.string
};

CustomToolbar.defaultProps = {
  showResponseBtn: true,
  active: false,
  id: 'toolbar'
};

export default CustomToolbar;
