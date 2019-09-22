import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust, faHome, faPlay, faWaveSquare } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const ControlTile = props => {
    return (
        <div>
                <div className="controlButton w-full h-1/3 bg-dark-tile block-inline content-center flex">
                    <div className="m-auto">
                        <FontAwesomeIcon icon={faPlay} size='2x' color='white' />
                    </div>
                </div>
                <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex">
                    <div className="m-auto">
                        <FontAwesomeIcon icon={faAdjust} size='2x' color='white' />
                    </div>
                </div>
                <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex">
                    <div className="m-auto">
                        <FontAwesomeIcon icon={faWaveSquare} size='2x' color='white' />
                    </div>
                </div>
                <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex">
                    <div className="m-auto">
                        <FontAwesomeIcon icon={faHome} size='2x' color='white' />
                    </div>
                </div>
                <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex">
                    <div className="m-auto">
                        <FontAwesomeIcon icon={faGithub} size='2x' color='white' />
                    </div>
                </div>
        </div>
    )
};

export default ControlTile;