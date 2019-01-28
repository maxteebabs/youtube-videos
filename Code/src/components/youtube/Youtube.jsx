import React, { Component } from 'react';
import Axios from 'axios';
import MovieIcon from '@material-ui/icons/Movie';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';

import { YoutubeService } from '../../services/youtube/Youtube';
import './Youtube.scss';
const service = new YoutubeService();

class Youtube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trends: [],
      isError: false,
      isLoading: false,
      likeCountLogs: [],
      nextPageToken: '',
      multipleLoads: false,
      pageInfo: null
    };
    this.likeCount = this.likeCount.bind(this);
    this.loadVideos = this.loadVideos.bind(this);
  }

  componentWillMount() {
    this.props.setTitle('YOUTUBE');
    this.props.onChanges(() => this.loadVideos());
    //using 
    // this.props.loadVideos(this.loadVideos);
  }
  
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }
  onScroll = () => {
    if((window.innerHeight + window.scrollY) >= 
      (document.body.offsetHeight - 200) && !this.state.isLoading ){
        if(this.state.nextPageToken) {
          this.loadPaginatedVideos();
        }
    }
  }
  async loadPaginatedVideos() {
    //set state
    this.setState({isLoading: true});
    const { nextPageToken } = this.state;
    
    Axios.all(await service.getPaginatedTrendingVideos(this.props.config.maxVideosToLoad
      , this.props.config.defaultCategoryId, this.props.config.defaultRegion, nextPageToken))
          .then((data) => {
            this.setState({
             trends: this.state.trends.concat(data[0]['items']),
             nextPageToken: data[0]['nextPageToken'],
             pageInfo: data[0]['pageInfo'],
             isError: false,
             isLoading: false
           });
          })
          .catch((err) => {
            this.setState({isError: true});
            // console.log(err);
          });
  }
  async loadVideos() {
    this.setState({multipleLoads: true});
    //before making a call // lets check the maxvideos to load
    if(this.props.config.maxVideosToLoad > 50 && this.state.multipleLoads) {
      let videosPerPage = this.props.config.maxVideosToLoad;
      //get the number of rounds to go make a call
       const rounds = Math.ceil(videosPerPage / 50);
       //get the remainder
       const remainder = Math.ceil(videosPerPage % 50);
       this.setState({trends: []});
       //we will do a loop to know the number of rounds
       for(let i = 1; i <= rounds; i++) {
          let maxVideosToLoad = 50;
          if(i === rounds) {
            this.setState({multipleLoads: false});
            maxVideosToLoad = remainder;
          }
          Axios.all(await service.getTrendingVideos(maxVideosToLoad
            , this.props.config.defaultCategoryId, this.props.config.defaultRegion))
          .then((data) => {
            this.setState({
              trends: this.state.trends.concat(data[0]['items']),
              nextPageToken: data[0]['nextPageToken'],
              pageInfo: data[0]['pageInfo'],
              isError: false
            });
          })
          .catch((err) => {
            this.setState({isError: true});
            // console.log(err);
          });
       }
       this.props.config.nextPageToken = '';
    }else {
      if(this.props.config.maxVideosToLoad > 50) {
        this.props.config.maxVideosToLoad = 50;
      }
      Axios.all(await service.getTrendingVideos(this.props.config.maxVideosToLoad
        , this.props.config.defaultCategoryId, this.props.config.defaultRegion))
           .then((data) => {
             this.setState({
               trends: data[0]['items'],
               nextPageToken: data[0]['nextPageToken'],
               pageInfo: data[0]['pageInfo'],
               isError: false
             });
  
           })
           .catch((err) => {
             this.setState({isError: true});
            //  console.log(err);
           });
    }
  }

  openVideo() {
    return window.location.href = '/youtube/' + this;
  }
  likeCount(index) {
    let {likeCountLogs} = this.state;
    let trends = [...this.state.trends];
    let trend = {...trends[index]};

    if(this.state.likeCountLogs.includes(index)) {
      trend.likeCount = --trend.likeCount;
    }else {
      trend.likeCount = ++trend.likeCount;
    }
    
    trends[index] = trend;
    this.setState({trends});

    //lets check if the index exists and remove it
    if(this.state.likeCountLogs.includes(index)) {
      this.setState({ likeCountLogs: likeCountLogs.splice(0, 1) });
    }else{
      likeCountLogs.push(index);
      this.setState({ likeCountLogs: likeCountLogs});
    }


  }
  youtubeCard() {
    return this.state.trends.map((videos, index) => 
        <div key={index} className="card-container">
          <div className="card" onClick={this.openVideo.bind(videos.id)}>
            <div className="img-container">
              <img src={videos.thumbnail} alt={videos.title}/>
              <MovieIcon/>
            </div>
            <div className="video-statistic">
              <div className="publishedAt">
                <AvTimerIcon/>
                <span>{videos.publishedAt}</span>
              </div>
              <div className="viewCount">
                <VisibilityIcon/>
                <span>{videos.viewCount}</span>
              </div>
              <div className="likeCount" onClick={(e) => { e.stopPropagation(); 
                              this.likeCount(index);}}>
                <FavoriteIcon/>
                <span>{videos.likeCount}</span>
              </div>
            </div>
            <p className="video-title text-ellipsis">
              {videos.title}
            </p>
          </div>
        </div>
      );
  }

  errorOnPage() {
    return <div className="error-plate">
    <WarningIcon/>
    <span>Error loading. Please try again later.</span>
  </div>;
  }

  render() {
    return !this.state.isError ? ( <div id="youtube">
      <div className="row">
        {this.youtubeCard()}
        {(this.state.isLoading) ? (<p>Loading...</p>) : ''}
      </div>
    </div>) : (this.errorOnPage());
  }
}

Youtube.propTypes = {
  setTitle : PropTypes.func,
  config   : PropTypes.object,
  onChanges: PropTypes.func
};
export default Youtube;
// export default connect(null, {loadVideos})(Youtube)



