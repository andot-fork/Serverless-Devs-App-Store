
import React, { Component, Fragment } from 'react';
const DemoHoc = (Commont, data) => {
  return (props) => {
    return <div className='template-hoc'>
      <Commont {...props} newProps={data}/>
  </div>
  } 
}
export default DemoHoc;
