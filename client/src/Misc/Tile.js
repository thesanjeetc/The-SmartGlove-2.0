import React from 'react';

const Tile = props => {
    return(
        <div className="w-full h-full bg-dark-tile  rounded-lg p-4 ">{props.children}</div>
    )
};

export default Tile;