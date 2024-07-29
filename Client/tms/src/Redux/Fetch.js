import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch enrolled courses
export const FetchEnrolledCourse = createAsyncThunk(
    'enrolledCourse/FetchEnrolledCourse',
    async (_, thunkAPI) => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:3000/userActions/enrolled/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data from server');
            }
            const enrolledCourseData = await response.json();
            return enrolledCourseData.enrollment;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Async thunk to enroll in a course
export const enrollCourse = createAsyncThunk(
    'enrollment/enrollCourse',
    async ({courseId, userId}, thunkAPI) => {
        try {
            console.log(courseId, userId)
            const response = await fetch(`http://localhost:3000/userActions/enrolled`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'withCredentials': true,
                },
                body: JSON.stringify({
                    course_id: parseInt(courseId),
                    user_id: parseInt(userId),
                    enrollment_date: new Date().toISOString()
                })
            });
            if (!response.ok) {
                throw new Error('Failed to enroll in course');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState: {
        enrolledCourse: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchEnrolledCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(FetchEnrolledCourse.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.enrolledCourse = action.payload;
            })
            .addCase(FetchEnrolledCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(enrollCourse.fulfilled, (state, action) => {
                state.enrolledCourse.push(action.payload);
            });
    },
});

export default enrollmentSlice.reducer;
