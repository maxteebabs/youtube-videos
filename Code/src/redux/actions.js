import { CHANGE_CATEGORY, CHANGE_REGION, MAX_VIDEOS_TO_LOAD, LOAD_VIDEOS}  from './actionTypes';

export const changeRegion = (region='') =>  ({
    type: CHANGE_REGION,
    data: {region}
});
export const changeCategory = (categoryID='') => ({
    type: CHANGE_CATEGORY,
    data: {categoryID}
});

export const maxVideosToLoad = maxVideosToLoad => ({
    type: MAX_VIDEOS_TO_LOAD,
    data: {maxVideosToLoad}
});

export const loadVideos = (loadVideosFn) => ({
    type: LOAD_VIDEOS,
    data: {loadVideosFn}
});