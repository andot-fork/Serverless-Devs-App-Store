import React from "react";
import Header from "./Header";
// import Sidemenu from "./Sidemenu";
import Content from "./Content";
import "./index.scss";
// const UN_SHOW_MENU_LIST = ["/ComponentDetail"];
class BasicLayout extends React.Component {
  componentDidMount() {}

  render() {
    // const currentRouter = this.props.history.location.pathname;
    return (
      <div style={{ width: "100%", height: "fit-content", paddingTop: "68px" }}>
        <Header history={this.props.history} />
        <div className="container">
          {/* {!UN_SHOW_MENU_LIST.includes(currentRouter) ? <Sidemenu /> : null} */}
          <Content />
        </div>
      </div>
    );
  }
}

export default BasicLayout;
