import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { shallow, render } from 'enzyme';

import configureStore, { history } from '../../../../../configureStore';

import ItemDetail from '../ItemDetail';

const store = configureStore();

const match = {
  params: {
    _id: 0,
  }
};

describe('<ItemDetail />', () => {
  it('should render properly', () => {
    const renderedComponent = shallow(<ItemDetail />);
    expect(renderedComponent.length).toEqual(1);
  });

  it('it should contain ItemHeader component', () => {
    const renderedComponent = render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ItemDetail match={match} />
        </ConnectedRouter>
      </Provider>
    );
    expect(renderedComponent.find('ItemHeader')).toBeTruthy();
    expect(renderedComponent.find('TestItemPreview')).toBeTruthy();
    expect(renderedComponent.find('SettingBar')).toBeTruthy();
  });
});
