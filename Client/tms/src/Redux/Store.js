import { configureStore } from '@reduxjs/toolkit';
import enrolledCourseReducer from './Fetch';
import CoursesReducer from './FetchCourses';
const store = configureStore({
    reducer: {
        enrollment : enrolledCourseReducer,
        courses : CoursesReducer
    } 
});

export default store;