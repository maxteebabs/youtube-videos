import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import YoutubePlayer from './Youtube.Player';

let filterButton = 'show';
const toggleFilterButton = (status) => {
  if(status) {
    filterButton = status;
  }
  return filterButton;
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><YoutubePlayer toggleFilterButton={toggleFilterButton} /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
