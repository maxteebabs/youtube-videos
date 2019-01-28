import React from 'react';
import ReactDOM from 'react-dom';
import SlideFilters from './SlideFilters';

const config = {maxVideosToLoad:24};
let store;
const onChanges = (fn) => {
  if (fn) {
    store = fn;
  }

  store();
};

const toggleDrawer = (open) => () => {
  
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SlideFilters config={config} onChanges={onChanges}
     toggleDrawer={toggleDrawer}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
