import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import ApplicationCenter from "../../pages/ApplicationCenter";
import ComponentDetail from "../../pages/ComponentDetail";
import Init from "../../pages/Init";
import Reset from "../../pages/Reset";
import Publish from "../../pages/Publish";
import NotFound from "../../pages/NotFound";
import "./index.scss";

const { SendResetUrl, HasSendUrl, ResetInformation, SuccessReset } = Reset;
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDiver: true,
    };
  }
  render() {
    return (
      <div className="layout-content" style={{ overflow: "hidden" }}>
        <CacheSwitch>
          <CacheRoute exact path="/app">
            {(props) => <ApplicationCenter {...props} />}
          </CacheRoute>
          <Route path="/component-detail" component={ComponentDetail} />
          <Route path="/init" component={Init} />
          <Route path="/reset" component={SendResetUrl} />
          <Route path="/has-send" component={HasSendUrl} />
          <Route path="/reset-input" component={ResetInformation} />
          <Route path="/success-reset" component={SuccessReset} />
          <Route path="/publish" component={Publish} />
          <Route exact path="*" component={NotFound} />
        </CacheSwitch>
      </div>
    );
  }
}

export default Content;
