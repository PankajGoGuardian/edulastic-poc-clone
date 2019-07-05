import React, { Component } from "react";
import helpers from "../helpers";

export default function withWindowScroll(WrappedComponent) {
  return class WithWindowScroll extends Component {
    state = { windowScrollTop: 0, windowScrollLeft: 0 };

    static displayName = `WithWindowScroll(${helpers.getDisplayName(WrappedComponent)})`;

    componentDidMount() {
      this.updateWindowScroll();
      window.addEventListener("scroll", this.updateWindowScroll);
    }

    componentWillUnmount() {
      window.removeEventListener("scroll", this.updateWindowScroll);
    }

    updateWindowScroll = () => {
      this.setState({ windowScrollTop: window.pageYOffset, windowScrollLeft: window.pageXOffset });
    };

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  };
}
