import React from "react";
import { Form, Input, Field, Select, Radio } from "@alifd/next";
import { PROVIDER_LIST, FOTM_ITEM_LAYOUT } from '../../constants';
import Translation from "../../components/Translation";
// import PropertyForm from './property-form';
import PropertyList from './property-list';

import "./index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TYPE_LIST = [
  {
    value: 'Component',
    label: 'Component'
  }, {
    value: 'Plugin',
    label: 'Plugin'
  }, {
    value: 'App',
    label: 'App'
  }
];

class ProjectPannel extends React.Component {
  constructor(props) {
    super(props);
    this.propertyIndex = 0;
    this.state = {
      configData: {},
      propertyList: [{ id: Date.now() }]
    };
    this.fieldData = {};
    this.field = new Field(this, {
      onChange: (name, value) => {
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.setConfigValue();
        }, 500);
      },
    });
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

  validate = () => {
    let isValid = true;
    this.field.validate();
    const errors = this.field.getErrors();
    Object.keys(errors).forEach(key => {
      if (errors[key]) {
        isValid = false;
      }
    });
    return isValid;
  }

  getValues = () => {
    const basicFormValue = this.field.getValues();
    const propertyValue = this.propertyList.getValues();
    // const { propertyList } = this.state;
    // let propertyValue = {};
    // propertyList.forEach((data) => {
    //   if (this[`propertyList${data.id}`]) {
    //     const values = this[`propertyList${data.id}`].getValues();
    //     propertyValue = Object.assign({}, propertyValue, values);
    //   }
    // });
    return Object.assign({}, basicFormValue, { Properties: propertyValue })
  }
  render() {
    const init = this.field.init;
    // const { propertyList } = this.state;
    return (
      <div style={{ padding: '32px 24px 60px' }}>
        <Form
          {...FOTM_ITEM_LAYOUT}
          style={{
            backgroundColor: '#FFFFFF',
          }}
          labelTextAlign="left"
          field={this.field}
        >
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Package type</Translation>}
            labelTextAlign="left"
            hasFeedback
            required
          >
            <RadioGroup dataSource={TYPE_LIST} {...init('Type', { initValue: 'App', rules: [{ required: true }] })} itemDirection={'ver'} />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>PackageName</Translation>}
            labelTextAlign="left"
            hasFeedback
            required
          >
            <Input {...init('Name', { rules: [{ required: true }] })} />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Provider</Translation>}
            labelTextAlign="left"
            required
          >
            <Select style={{ width: '100%' }} dataSource={PROVIDER_LIST}  {...init("Provider", { initValue: 'alibaba', rules: [{ required: true }] })} />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Version</Translation>}
            labelTextAlign="left"
            hasFeedback
            required
          >
            <Input {...init('Version', { rules: [{ required: true }] })} />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Description</Translation>}
            labelTextAlign="left"
            hasFeedback

          >
            <Input {...init('Description', { rules: [{ required: true }] })} />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Homepage</Translation>}
            labelTextAlign="left"
            hasFeedback
            required
          >
            <Input {...init('HomePage', { rules: [{ required: true }] })} />
          </FormItem>

          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Properties</Translation>}
            labelTextAlign="left"
            hasFeedback
            required
          >
            <PropertyList setConfigValue={this.setConfigValue} ref={(ref) => this.propertyList = ref} />
            {/* {propertyList.map((data) => <div style={{ marginTop: 30, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, marginBottom: 30, border: '1px dotted #ccc', width: 'fit-content', position: 'relative' }} key={data.id}>
              <span className="remove-icon" style={{ right: -30, top: -3 }}><Icon type="ashbin" onClick={() => this.removeProperty(data.id)} /></span>
              <PropertyForm ref={(ref) => this[`propertyList${data.id}`] = ref} setConfigValue={this.setConfigValue} />
            </div>)}
            <Button type="primary" style={{ width: '100%' }} onClick={this.addProperty}>+ <Translation>Add Property</Translation></Button> */}
          </FormItem>

        </Form>
      </div>
    );
  }
}

export default ProjectPannel;
