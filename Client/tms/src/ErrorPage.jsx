import React from 'react';

const ErrorPage = ({ location}) => {
    const errorMessage = location.state?.errorMessage || 'An error occurred';
    return (
        <div>
            <h1>Error</h1>
            <p>{errorMessage}</p>
        </div>
    );
};

export default ErrorPage;
