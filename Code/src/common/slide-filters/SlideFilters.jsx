/* eslint-disable */
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

import './SlideFilters.scss';
import { appConfig } from '../../config';
import Axios from 'axios';
import { YoutubeService } from '../../services/youtube/Youtube';

// import {connect} from 'react-redux';

const countryList = appConfig.countryList;

const service = new YoutubeService();

const Handle = Slider.Handle;

const handle = (props) => {
  const {value, dragging, index, ...restProps} = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

handle.propTypes = {
  value   : PropTypes.number,
  dragging: PropTypes.func,
  index   : PropTypes.number
};

function renderInput(inputProps) {
  const {InputProps, ref, ...other} = inputProps;
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion({suggestion, index, itemProps, highlightedIndex, selectedItem}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={index}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index           : PropTypes.number,
  itemProps       : PropTypes.object,
  selectedItem    : PropTypes.string,
  suggestion      : PropTypes.shape({name: PropTypes.string}).isRequired
};


class SlideFilters extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      isError: false,
      categoriesList: [],
    };
  }
  componentWillMount() {
    this.loadCategories();
  }
  async loadCategories() {
    Axios.all(await service.getCategories())
    .then((data) =>  {
      this.setState({categoriesList: data});
    })
    .catch((err) => {
      this.setState({isError: true});
      console.log(err);
    });
  }
  handleCountryFilter(inputValue) {
    //filter from the country array
    let country = countryList.find(
      (country) => country.name.toLowerCase() == inputValue.toLowerCase());
    if(country) {
      //store in local storage
      localStorage.setItem('countryName', country.name);
      localStorage.setItem('countryCode', country.code);
      this.props.config.defaultRegion = country.code;
      this.props.onChanges();
    }
  }
  handleCategoryFilter(inputValue) {
    let category = this.state.categoriesList.find(
      (category) => category.name.toLowerCase() == inputValue.toLowerCase());
    if(category) {
      localStorage.setItem('categoryName', category.name);
      localStorage.setItem('categoryID', category.id);
      this.props.config.defaultCategoryId = category.id;
      this.props.onChanges();
    }
  }
  render() {
    const videosToLoadChange = (val) => {
      this.props.config.maxVideosToLoad = val;
      this.props.onChanges();
    };
    let { categoriesList } = this.state;
    return (
      <div className="slide-filters-container">
        <h3 className="title">
          Filters
          <Button className="mat-icon-button" onClick={this.props.toggleDrawer(false)}>
            <CloseIcon aria-label="Close"/>
          </Button>
        </h3>
        <Downshift id="countrySelect" onInputValueChange={ this.handleCountryFilter.bind(this)} >
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              highlightedIndex,
              isOpen,
              selectedItem
            }) => (
            <div>
              {renderInput({
                fullWidth : true,
                InputProps: getInputProps({value: localStorage.getItem('countryName') || ''}),
                label     : 'Select Country',
                onChange  : this.handleCountryFilter.bind(this),
                autoFocus: true
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper square>
                    {countryList.map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({item: suggestion.name}),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
        <div className="divider"/>
        <Downshift id="categorySelect" onInputValueChange={ this.handleCategoryFilter.bind(this)} >
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              highlightedIndex,
              isOpen,
              selectedItem
            }) => (
            <div>
              {renderInput({
                fullWidth : true,
                InputProps: getInputProps({value: localStorage.getItem('categoryName') || ''}),
                label     : 'Select Category',
                onChange  : this.handleCategoryFilter.bind(this)
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper square>
                    {categoriesList.map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({item: suggestion.name}),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
        <div className="divider"/>
        <div className="videosCountPerPage">
          <div className="caption">Count of videos on the page</div>
          <div className="slider">
            <Slider
              min={1}
              max={200}
              defaultValue={this.props.config.maxVideosToLoad}
              handle={handle}
              onAfterChange={videosToLoadChange}/>
          </div>
        </div>
      </div>
    );
  }
}

SlideFilters.propTypes = {
  config   : PropTypes.object,
  onChanges: PropTypes.func,
  toggleDrawer: PropTypes.func
};

export default SlideFilters;
// const mapStateToProps = state =>
// {
//   return {
//     loadVideos: state.reducer.loadVideosFn
//   }
// }
// export default connect(mapStateToProps)(SlideFilters);
