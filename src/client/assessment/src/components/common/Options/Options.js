import React, { Component, Fragment } from 'react';
import { Paper } from '@edulastic/common';
import PropTypes from 'prop-types';
import i18n from '@edulastic/localization';

import { IconPlus } from '@edulastic/icons';
import { greenDark } from '@edulastic/colors';
import { Header, Toggler, Heading, Block, Label, Row, Col } from './styles';
import Scoring from './components/Scoring';

class Options extends Component {
  state = {
    show: false
  };

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any.isRequired,
    outerStyle: PropTypes.object
  };

  static defaultProps = {
    title: i18n.t('assessment:common.options.title'),
    outerStyle: {}
  };

  static Heading = Heading;

  static Block = Block;

  static Label = Label;

  static Row = Row;

  static Col = Col;

  handleToggle = () => {
    this.setState(({ show }) => ({
      show: !show
    }));
  };

  render() {
    const { title, children, outerStyle } = this.props;
    const { show } = this.state;

    return (
      <Paper style={outerStyle}>
        <Header onClick={this.handleToggle}>
          <span style={{ fontWeight: 600 }}>{title}</span>
          {show && <Toggler />}
          {!show && <IconPlus id="iconPlus" color={greenDark} />}
        </Header>
        {show && (
          <Fragment>
            <Scoring />
            <div>{children}</div>
          </Fragment>
        )}
      </Paper>
    );
  }
}

export default Options;
