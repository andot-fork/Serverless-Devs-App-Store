import React from "react";
import { Form, Input, Field, Button, Radio } from "@alifd/next";

import { FOTM_ITEM_LAYOUT } from '../../constants';
import ParamsType from './params-type';
import Translation from "../../components/Translation";

import "./index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;



class PropertyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configData: {},
      paramsList: [{ id: Date.now() }]
    };

    this.field = new Field(this, {
      onChange: (name, value) => {
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.props.setConfigValue();
        }, 500);
      },
    });

  }



  componentDidMount() {

  }

  getValues = () => {
    const result = {};
    const basicFormValues = this.field.getValues();

    let propertiesValues = [];
    const { paramsList } = this.state;
    paramsList.forEach((data) => {
      const currentRef = this[`paramsList${data.id}`];
      if (currentRef) {
        const values = currentRef.getValues();
        if (values) {
          propertiesValues.push(values);
        }
      }
    });
    if (basicFormValues.Name) {
      result[basicFormValues.Name] = {};
      result[basicFormValues.Name].Description = basicFormValues.Description || '';
      result[basicFormValues.Name].Required = basicFormValues.Required;
      result[basicFormValues.Name].Type = propertiesValues || '';
    }

    return result;
  }

  addParamsType = () => {
    const id = Date.now();
    const { paramsList } = this.state;
    paramsList.push({ id });
    this.setState({
      paramsList
    })
  }

  removeParamsType = (id) => {
    const { paramsList } = this.state;
    paramsList.forEach((data, i) => {
      if (data.id === id) {
        paramsList.splice(i, 1);
      }
    });
    this.setState({
      paramsList
    })
  }


  render() {
    const { paramsList } = this.state;
    const { setConfigValue } = this.props;
    const init = this.field.init;
    return (
      <div >
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          label={<Translation>Param Name</Translation>}
          labelTextAlign="left"
          required
        >
          <Input {...init('Name', { rules: [{ required: true }] })} />
        </FormItem>
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          label={<Translation>Is Required</Translation>}
          labelTextAlign="left"
          hasFeedback
          required
        >
          <RadioGroup {...init('Required', { initValue: true, rules: [{ required: true }] })} dataSource={[{ value: true, label: '必填' }, { value: false, label: '选填' }]} />
        </FormItem>
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          label={<Translation>Param Description</Translation>}
          labelTextAlign="left"
          hasFeedback
        >
          <Input.TextArea {...init('Description', { rules: [{ required: true }] })} />
        </FormItem>
        {paramsList.map((data, i) => <ParamsType setConfigValue={setConfigValue} key={data.id} id={data.id} removeParamsType={this.removeParamsType} ref={(ref) => this[`paramsList${data.id}`] = ref} />)}
        <div><Button text onClick={this.addParamsType} style={{ color: '#0000EF', marginTop: 5 }}>+ <Translation>Add Param Type</Translation></Button></div>
      </div>
    );
  }
}

export default PropertyForm;
