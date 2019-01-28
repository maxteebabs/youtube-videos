/*eslint-disable */
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './Youtube.Player.scss';
import PropTypes from 'prop-types';

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const id = window.location.href
      .replace(/^.*\//g, '')
      .replace(/^.*\..*/g, '');
      
    if(!id) {
      //redirect back to the main page
      window.location.href = '/youtube/';
    }
    const iframe = '<iframe title="Video"' +
      '        width="100%"' +
      '        height="100%"' +
      '        src="https://www.youtube.com/embed/'+id+'?autoplay=1"'+
      '        frameBorder="0"'+
      '        allowFullScreen/></iframe>';
    setTimeout(() => {
      if (document.getElementsByClassName('frame-block')[0]) {
        document.getElementsByClassName('frame-block')[0].innerHTML = iframe;
      }
    }, 1000);

  }
  componentWillMount() {
    console.log(this.props);
    this.props.toggleFilterButton('hide');
  }

  render() {
    return (
      <div className="video-container">
        <div className="frame-block"/>
        <div className="controls">
          <Link className="btn btn-primary" to="/youtube"> &#60; Back to Trends</Link>
        </div>
      </div>);
  }
}
YoutubePlayer.propTypes = {
  toggleFilterButton: PropTypes.func
};
export default YoutubePlayer;
