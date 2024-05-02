import React from 'react';

const Loader = () => {
    return (
        <div className={"flex justify-center items-center h-screen"}>
            <div className="animate-spin rounded-full border-t-4 border-solid border-blue-500 h-12 w-12"></div>
        </div>
    );
};

export default Loader;