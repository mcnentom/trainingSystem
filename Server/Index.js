import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import authRouter from './components/Auth.js'
import dotenv from 'dotenv'
// import { protectedRoute } from './routes/Queries.js';

const app = express();

dotenv.config()
const port = 3000;

app.use( express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Secure flag for HTTPS-only
        httpOnly: true, // HttpOnly flag to prevent client-side access
        sameSite: 'strict', // SameSite attribute set to strict
    }
}));

app.use( '/auth', authRouter);
// app.use('/products', protectedRoute, productRouter)


app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
})