import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Student from './student/src';
import { QuestionEditor, MultipleChoice } from './author/src';
import ItemList from './author/src/components/ItemList/ItemList';
import ItemDetail from './author/src/components/ItemDetail';

class App extends Component {
  componentWillMount() {
    const { assessmentId } = this.props;
    localStorage.setItem('AssessmentId', assessmentId);
  }

  render() {
    return (
      <div>
        <Switch>
          <Redirect exact path="/" to="/student/test" />
          <Route path="/author/mcq" component={MultipleChoice} />
          <Route path="/author/orderlist" component={QuestionEditor} />
          <Route exact path="/author/items" component={ItemList} />
          <Route exact path="/author/items/:id" component={ItemDetail} />
          <Route path="/student/test" component={() => <Student defaultAP />} />
          <Route path="/student/practice" component={Student} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  assessmentId: PropTypes.string.isRequired,
};

export default App;
