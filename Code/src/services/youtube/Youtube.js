/* eslint-disable */
import Axios from 'axios';
import {appConfig} from '../../config';
import {VideoClass} from '../../models/video.class';
import { VideoCategory }  from '../../models/videoCategory.class';


export class YoutubeService {
  getTrendingVideos(videosPerPage = appConfig.maxVideosToLoad
    , categoryID= appConfig.defaultCategoryId
    , regionCode = appConfig.defaultRegion) {
    const axios = Axios.create({
      baseURL: appConfig.getYoutubeEndPoint('videos')
    });

    const params = {
      part: appConfig.partsToLoad,
      chart: appConfig.chart,
      videoCategoryId: localStorage.getItem('categoryID') || categoryID,
      regionCode: localStorage.getItem('countryCode') || regionCode,
      maxResults: videosPerPage,
      key: appConfig.youtubeApiKey
    };
    
    return axios.get('/', {params}).then((res) => {
    
      const items = res.data.items
        .map((item) => new VideoClass(item))
        .filter((item) => item.id !== '');
      let result = [{
        items: items,
        pageInfo: res.data.pageInfo,
        nextPageToken: res.data.nextPageToken
      }];
      return result;
    }).catch((err) => err);
  }

  getPaginatedTrendingVideos(videosPerPage = appConfig.maxVideosToLoad
    , categoryID= appConfig.defaultCategoryId
    , regionCode = appConfig.defaultRegion
    , nextPageToken = '') {
    const axios = Axios.create({
      baseURL: appConfig.getYoutubeEndPoint('videos')
    });
    
    const params = {
      part: appConfig.partsToLoad,
      chart: appConfig.chart,
      videoCategoryId: localStorage.getItem('categoryID') || categoryID,
      regionCode: localStorage.getItem('countryCode') || regionCode,
      maxResults: videosPerPage,
      key: appConfig.youtubeApiKey,
      pageToken: nextPageToken
    };
    return axios.get('/', {params}).then((res) => {
      
      const items = res.data.items
        .map((item) => new VideoClass(item))
        .filter((item) => item.id !== '');
      let result = [{
        items: items,
        pageInfo: res.data.pageInfo,
        nextPageToken: res.data.nextPageToken
      }];      
      return result;
    }).catch((err) => err);
  }

  getCategories() {
    const axios = Axios.create({
      baseURL: appConfig.getYoutubeEndPoint('videoCategories')
    });
    const params = {
      part: appConfig.part,
      regionCode: appConfig.regionCode,
      key: appConfig.youtubeApiKey  
    };
    return axios.get('/', {params}).then((res) => {
        return res.data.items.map((item) => new VideoCategory(item))
        .filter((item) => item.id !== '');
    }).catch((err) => err);
  }
}

