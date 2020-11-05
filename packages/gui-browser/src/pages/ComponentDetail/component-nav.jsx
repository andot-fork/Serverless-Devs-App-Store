import React from "react";
import { withRouter } from "react-router-dom";
import { Nav } from "@alifd/next";
import "./component-nav.scss";

const { Item, SubNav } = Nav;

class ComponentNav extends React.Component {
  state = {
    iconOnly: false,
    hasTooltip: true,
    hasArrow: true,
    isClick: false,
    navList: [
      { alibaba: ["FFpmg", "Express"] },
      { tecent: ["FFpmg", "Express"] },
    ],
  };
  getSubNavName = (item) => {
    return Object.keys(item)[0];
  };
  setNav = () => {
    this.setState({
      isClick: true,
    });
  };

  render() {
    const { iconOnly, hasTooltip, hasArrow, navList } = this.state;
    const node = navList.map((item, index) => (
      <SubNav
        key={index}
        label={this.getSubNavName(item)}
        className="component-subNav"
        onClick={this.setNav}
        style={{
          color: "#A6A6A6",
        }}
      >
        {item[this.getSubNavName(item)].map((name, index) => (
          <Item key={index} className="component-nav-item">
            {name}
          </Item>
        ))}
      </SubNav>
    ));
    return (
      <div className="component-side-menu">
        <div className="component-side-nav">
          <div className="component-title">Serverless App Center</div>
          <div className="mid-hr"></div>
          <Nav
            iconOnly={iconOnly}
            selectedKeys={this.props.history.location.pathname}
            hasArrow={hasArrow}
            hasTooltip={hasTooltip}
            defaultOpenAll={true}
            embeddable={false}
            openMode="multiple"
            className="component-nav"
          >
            {node}
          </Nav>
        </div>
      </div>
    );
  }
}

export default withRouter(ComponentNav);
