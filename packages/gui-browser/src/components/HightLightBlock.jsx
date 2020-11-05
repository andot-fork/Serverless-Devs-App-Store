import React from "react";


import './highlight.scss';

import Highlight from 'react-highlight.js';


class HightLightBlock extends React.Component {
  render() {
    const { content = '' } = this.props;
    return (
      <Highlight language={'shell'}>
        {content}
      </Highlight>

    )
  }
}

export default HightLightBlock;