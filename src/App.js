import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';
import Student from './Student';
import MultipleChoice from './Assessment/components/MultipleChoice';
import { loadJSON } from './utils';
import { ASSESSMENTID } from './constants/others';
import QuestionEditor from './Assessment/components/QuestionEditor';
import ItemDetail from './Assessment/components/ItemDetail';

class App extends Component {
  componentDidMount() {
    const { assessmentId, dispatch } = this.props;

    loadJSON(assessmentId, dispatch);
    localStorage.setItem(ASSESSMENTID, assessmentId);
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Redirect exact path="/" to="/student" />
          <Route path="/author" component={MultipleChoice} />
          <Route path="/order-list" component={QuestionEditor} />
          <Route path="/student" component={Student} />
          <Route path="/items/:id" component={ItemDetail} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  assessmentId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(App);
