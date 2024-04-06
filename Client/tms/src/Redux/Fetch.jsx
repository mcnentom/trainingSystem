import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const FetchEnrolledCourse = createAsyncThunk(
    'enrolledCourse/FetchEnrolledCourse',
    async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const enrolledCourses = await fetch(`http://localhost:3000/userActions/enrolled/${userId}`);
            // console.log(enrolledCourses);
            if (!enrolledCourses.ok) {
                throw new Error('failed to fetch data from server');
            }
            const enrolledCourseData = await enrolledCourses.json();
            return enrolledCourseData.enrollment;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const enrollCourse = createAsyncThunk(
    'enrollment/enrollCourse',
    async (courseId, thunkAPI) => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:3000/userActions/enrolled`, {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                    'withCredentials': true,
                },
                body: JSON.stringify({ course_id: parseInt(courseId), user_id: parseInt(userId), enrollment_date: new Date().toISOString() })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)
const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState: {
        enrolledCourse: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(FetchEnrolledCourse.pending, (state) => {
            state.status = 'loading';
        }).addCase(FetchEnrolledCourse.fulfilled, (state, action) => {
            state.status = 'success';
            state.enrolledCourse = action.payload;
            // console.log('Fetched enrolled courses:', action.payload.enrolledCourses.enrollment[0].course_id)
        }).addCase(FetchEnrolledCourse.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.error.message;
        }).addCase(enrollCourse.fulfilled, (state, action) => {
            state.enrolledCourse.push(action.payload)
        })
            ;
    },
});

export default enrollmentSlice.reducer;