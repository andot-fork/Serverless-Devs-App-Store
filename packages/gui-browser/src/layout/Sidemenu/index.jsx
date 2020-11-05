import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav } from "@alifd/next";
import "./index.scss";

const { Item } = Nav;

class Sidemenu extends React.Component {
  state = {
    iconOnly: false,
    hasTooltip: true,
    hasArrow: true,
  };

  render() {
    const { iconOnly, hasTooltip, hasArrow } = this.state;

    return (
      <div className="layoutSidemenu">
        <Nav
          iconOnly={iconOnly}
          selectedKeys={this.props.history.location.pathname}
          hasArrow={hasArrow}
          hasTooltip={hasTooltip}
          defaultOpenAll={true}
          embeddable={false}
        >
          <Item key="/ApplicationCenter">
            <Link to="/ApplicationCenter">应用中心</Link>
          </Item>
          <div className="mid-hr"></div>
          {/* <SubNav label="阿里云">
            <Item key="/ComponentDetail"><Link to="/ComponentDetail">FFmpeg</Link></Item>
          </SubNav>
          <div className="mid-hr"></div>
          <Item key="/Publish"><Link to="/Publish">Publish</Link></Item>
          <Item>Initiate App</Item> */}
        </Nav>
      </div>
    );
  }
}

export default withRouter(Sidemenu);
