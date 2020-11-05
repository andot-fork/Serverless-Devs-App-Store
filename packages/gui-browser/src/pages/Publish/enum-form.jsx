import React from "react";
import { Button, Icon } from "@alifd/next";
import Translation from "../../components/Translation";
import EnumFormItem from './enum-form-item';
import "./index.scss";

class EnumForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enumList: [{ id: Date.now() }]
    };
  }

  setConfigValue = () => {
    const values = this.getValues();
    this.props.setConfigValue(values);
  }

  addEnum = () => {
    const { enumList } = this.state;
    enumList.push({ id: Date.now() });
    this.setState({
      enumList
    });
  }

  removeEnum = (id) => {
    const { enumList } = this.state;
    enumList.forEach((data, i) => {
      if (data.id === id) {
        enumList.splice(i, 1);
      }
    });
    this.setState({
      enumList
    })
  }


  getValues = () => {
    const { enumList } = this.state;
    let enumValue = [];
    enumList.forEach((data) => {
      if (this[`enumList${data.id}`]) {
        const value = this[`enumList${data.id}`].getValues();
        if(value){
          enumValue.push(value);
        }
      }
    });
    return enumValue;
  }

  render() {
    const { enumList } = this.state;
    return (
      <div>
        {enumList.map((data) => <div style={{ position: "relative" }} key={data.id}><span className="remove-icon" style={{ right: -30, top: -3 }}><Icon type="ashbin" onClick={() => this.removeProperty(data.id)} /></span><EnumFormItem ref={(ref) => this[`enumList${data.id}`] = ref} setConfigValue={this.setConfigValue} /></div>)}
        <Button type="primary" style={{ width: '100%' }} onClick={this.addEnum}>+ <Translation>Add Enum Item</Translation></Button>

      </div>

    );
  }
}

export default EnumForm;
