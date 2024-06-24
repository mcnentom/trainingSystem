import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

export const courses = createAsyncThunk(
    'course/courses',
    async()=>{
        const response = await fetch(`http://localhost:3000/userActions/courses`);
        const courses = await response.json();
        // console.log(courses);
        return courses;
    }
)
const courseSlice = createSlice({
    name: 'courses',
    initialState:{
        courses:[],
        status:'idle',
        error: null
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(courses.pending,(state)=>{
            state.status = 'pending';
        }).addCase(courses.fulfilled,(state,action)=>{
            state.status = 'fulfilled';
            state.courses = action.payload;
        }).addCase(courses.rejected, (state,action)=>{
            state.status = 'rejected';
            state.error = action.error.message;
        })
    }
})

export default courseSlice.reducer;