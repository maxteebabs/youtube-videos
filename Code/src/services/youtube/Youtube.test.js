/* eslint-disable */
import { YoutubeService } from './Youtube';
import expect from 'expect';

it('renders without crashing', () => {
 new YoutubeService();
});

it('getTrendingVideos function', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos();
  expect(result[0]['items'].length).toEqual(24);
});
it('test getPaginatedTrendingVideos function', async () => {
  const service = new YoutubeService();
  const result = await service.getPaginatedTrendingVideos();
  expect(result.length).toBeGreaterThan(0);
});
it('should testTrendingVideoCategory function', async () => {
  const service = new YoutubeService();
  const result = await service.getCategories();
  expect(result.length).toBeGreaterThan(0);
});