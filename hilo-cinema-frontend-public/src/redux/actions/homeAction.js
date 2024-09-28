import axios from 'axios';

export const SET_TAB = 'SET_TAB';
export const SET_RECENT_MOVIES = 'SET_RECENT_MOVIES';

export const setCarouselImages = (images) => ({
  type: "SET_CAROUSEL_IMAGES",
  payload: images,
});

export const setBlogs = (blogs) => ({
  type: "SET_BLOGS",
  payload: blogs,
});

export const setPromotionNews = (promotionNews) => ({
  type: "SET_PROMOTION_NEWS",
  payload: promotionNews,
});

export const setTab = (tabValue) => ({
  type: SET_TAB,
  payload: tabValue,
});

export const setRecentMovies = (movies) => ({
  type: SET_RECENT_MOVIES,
  payload: movies,
});

export const fetchMovies = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8000/MovieService', {
        // Thêm headers nếu cần thiết
        headers: {
          // Ví dụ: 'Authorization': 'Bearer token'
        },
      });

      const movies = response.data;

      const today = new Date();
      const recentMovies = movies.filter(movie => {
        const releaseDate = new Date(movie.releasedDate);
        return releaseDate <= today;
      });

      const sortedRecentMovies = recentMovies.sort((a, b) => new Date(b.releasedDate) - new Date(a.releasedDate)).slice(0, 8);

      dispatch(setRecentMovies(sortedRecentMovies));
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
};

export const fetchBlogs = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8000/BlogService', {
        // Thêm headers nếu cần thiết
        headers: {
          // Ví dụ: 'Authorization': 'Bearer token'
        },
      });

      const blogs = response.data;

      // Xử lý dữ liệu blogs nếu cần (ví dụ: lọc, sắp xếp)
      // const processedBlogs = processBlogs(blogs);

      dispatch(setBlogs(blogs));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
};
