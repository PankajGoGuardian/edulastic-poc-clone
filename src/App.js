import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import Student from './Student';
import MultipleChoice from './Assessment/components/MultipleChoice';
import { loadJSON } from './utils';
import { ASSESSMENTID } from './constants/others';

class App extends Component {
  componentDidMount() {
    loadJSON(this.props.assessmentId, this.props.dispatch);
    localStorage.setItem(ASSESSMENTID, this.props.assessmentId);
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Redirect exact={true} path='/' to="/student" />
          <Route path="/author" component={MultipleChoice} />
          <Route path="/student" component={Student} />
        </Switch>
      </div>
    );
  }
}

export default connect()(App);
