import React from "react";
import { Button, Icon } from "@alifd/next";

import Translation from "../../components/Translation";
import PropertyForm from './property-form';

import "./index.scss";


class PropertyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyList: [{ id: Date.now() }]
    };
  }

  setConfigValue = () => {
    const values = this.getValues();
    this.props.setConfigValue(values);
  }

  addProperty = () => {
    const { propertyList } = this.state;
    propertyList.push({ id: Date.now() });
    this.setState({
      propertyList
    });
  }

  removeProperty = (id) => {
    const { propertyList } = this.state;
    propertyList.forEach((data, i) => {
      if (data.id === id) {
        propertyList.splice(i, 1);
      }
    });
    this.setState({
      propertyList
    })
  }


  getValues = () => {
    const { propertyList } = this.state;
    let propertyValue = {};
    propertyList.forEach((data) => {
      if (this[`propertyList${data.id}`]) {
        const values = this[`propertyList${data.id}`].getValues();
        propertyValue = Object.assign({}, propertyValue, values);
      }
    });
    return propertyValue;
  }

  render() {
    const { propertyList } = this.state;
    return (
      <span>
        {propertyList.map((data) => <div style={{ marginTop: 30, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, marginBottom: 30, border: '1px dotted #ccc', width: 'fit-content', position: 'relative' }} key={data.id}>
          <span className="remove-icon" style={{ right: -30, top: -3 }}><Icon type="ashbin" onClick={() => this.removeProperty(data.id)} /></span>
          <PropertyForm ref={(ref) => this[`propertyList${data.id}`] = ref} setConfigValue={this.setConfigValue} />
        </div>)}
        <Button type="primary" style={{ width: '100%' }} onClick={this.addProperty}>+ <Translation>Add Property</Translation></Button>

      </span>
    );
  }
}

export default PropertyList;
