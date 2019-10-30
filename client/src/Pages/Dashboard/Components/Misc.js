import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BaseComponent, Container, Tile} from './Base'

const Button = (props) => {
    return(
      <BaseComponent 
        onClick={props.onClick} 
        baseClass="controlButton w-1/2 bg-transparent block-inline content-center flex" 
        {...props}>
         <div className="m-auto">
         <FontAwesomeIcon icon={props.icon} size='2x'  />
         </div>
      </BaseComponent>
    );
  }
  
  const ClickButton = (props) => {
    const [clicked, setClicked] = useState(false);
    return(
      <Button 
        onClick={() => setClicked(!clicked)}
        icon={clicked ? props.clickedIcon : props.icon} 
        className={props.className}
      />
    )
  }

  
  export { Button, ClickButton};