import React from 'react';

const Tile = props => {
    return( 
      <div className="">
        <div className="chart-wrapper">{props.children}</div>
      </div>
    )
};

export default Tile;