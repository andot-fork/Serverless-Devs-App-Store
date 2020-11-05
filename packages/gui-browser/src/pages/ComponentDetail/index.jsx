import React from "react";
import { Icon } from "@alifd/next";

import ComponentContent from "./mid-content/index";
import "./index.scss";

class ComponentDetail extends React.Component {
  backToAppCenter = () => {
    this.props.history.push("/app");
  };

  render() {
    return (
      <div className="component-detail">
        <div className="component-detail-container">
          {/* <ComponentNav /> */}
          <Icon
            type="arrow-left"
            className="back-icon"
            onClick={this.backToAppCenter}
          />
          <ComponentContent {...this.props} />
        </div>
      </div>
    );
  }
}

export default ComponentDetail;
