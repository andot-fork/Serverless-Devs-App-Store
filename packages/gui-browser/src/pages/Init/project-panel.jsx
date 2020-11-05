import React from 'react';
import _ from 'loadsh';
import { Form, Input, Field, Select, Button, Icon } from '@alifd/next';
import AccessConfig from '../../components/AccessConfig';
import FormField from './form-field';
import { request } from '../../utils/request';
import { GENERIC_ARR_REG, FOTM_ITEM_LAYOUT } from '../../constants';
import { generateMagicVariables } from '../../utils/parsed';
import Translation from '../../components/Translation';
import CommonBalloon from "../../components/CommonBalloon";
import './index.scss';

const FormItem = Form.Item;

class ProjectPannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configData: {},
      providerList: []
    };
    this.fieldData = {};
    this.field = new Field(this, {
      onChange: (name) => {
        if (name === 'Provider') {
          this.field.setValue('Access', '');
        }
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.setConfigValue();
        }, 500);
      }
    });

    const { guiData = {} } = props;
    const { providerValue, accessValue } = guiData;
    this.field.setValue('Provider', providerValue);
    this.field.setValue('Access', accessValue);
  }

  async componentDidMount() {
    const { data } = this.props;

    let providerList = await this.getProvider(data);
    providerList = providerList.map((provider) => ({
      label: provider,
      value: provider.toLowerCase()
    }));
    this.setState({
      providerList
    });
    const componentName = _.get(data, 'Component');
    const provider = _.get(data, 'Provider');
    this.getComponentProperties({
      name: componentName,
      type: 'Component',
      provider
    });
  }

  setConfigValue = () => {
    const values = this.field.getValues();
    this.fieldData = {};
    this.transformData(values);
  };
  createFieldData = (keyarr, value) => {
    let currentData = this.fieldData;
    let lastKey = keyarr[keyarr.length - 1];
    for (let i = 0; i <= keyarr.length - 2; i++) {
      currentData = this.createDataStruct(currentData, keyarr[i]);
    }

    const matchResult = lastKey.match(GENERIC_ARR_REG);

    if (matchResult) {
      const formatKey = matchResult[1];
      const number = matchResult[2];
      if (
        !currentData[formatKey] ||
        Object.prototype.toString.call(currentData[formatKey]) !== '[object Array]'
      ) {
        currentData[formatKey] = [];
      }
      currentData[formatKey][parseInt(number, 10)] = value;
      this.field = Object.assign({}, this.field, currentData);
    } else {
      currentData[lastKey] = value;
    }
  };

  createDataStruct = (data, key) => {
    const matchResult = key.match(GENERIC_ARR_REG);
    if (matchResult) {
      key = matchResult[1];
      const number = matchResult[2];
      if (!data[key] || Object.prototype.toString.call(data[key]) !== '[object Array]') {
        data[key] = [];
      }
      if (!data[key][number] || Object.prototype.toString.call(data[key][number]) !== '[object Object]') {
        data[key][number] = {};
      }
      this.field = Object.assign({}, this.field, data);
      return data[key][number];
    } else {
      if (!data[key] || Object.prototype.toString.call(data[key]) !== '[object Object]') {
        data[key] = {};
      }
      this.field = Object.assign({}, this.field, data);
      return data[key];
    }
  };

  transformData = (values) => {
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        const keyarr = key.split('.');
        const value = values[key];
        if (keyarr.length === 1) {
          this.fieldData[key] = value; // 一级结构
        } else {
          // 复合结构
          this.createFieldData(keyarr, value);
        }
      }
    });

    this.props.setCodeProperties(this.fieldData);
  };

  getComponentProperties = async (params) => {
    const result = await request({
      url: '/api/package/get/object/url',
      params
    });
    const originInformation = JSON.parse(_.get(result, 'data.Response.Information', '{}'));
    console.log(originInformation,'originInformation');
    const configData = _.get(originInformation, 'Properties', {});
    this.setState({
      configData
    });
  };

  openToAddConfig = () => {
    this.accessConfig && this.accessConfig.openDialog();
  };

  isValid = () => {
    let isValid = true;
    this.field.validate();
    const errors = this.field.getErrors();
    Object.keys(errors).forEach((key) => {
      if (errors[key]) {
        isValid = false;
      }
    });
    return isValid;
  };

  refreshGuiObj = () => {
    this.props.refreshGuiObj(() => {
      setTimeout(() => {
        this.setConfigValue();
      });
    });
  };

  getProvider = async (data) => {
    let params = {
      type: '',
      name: ''
    }
    if (data['Component']) {
      params.type = 'Component';
      params.name = data['Component'];
    } else if (data['Plugin']) {
      params.type = 'Plugin';
      params.name = data['Plugin'];
    }
    const result = await request({
      url: '/api/package/object/provider',
      params
    });
    const Response = _.get(result, 'data.Response.Providers', []);
    return Response;
  };

  render() {
    const { projectName, data, hideUnRequiredForm, guiData = {} } = this.props;
    const { accessListMap = {} } = guiData;
    const { configData, providerList } = this.state;
    const init = this.field.init;
    let accessList = [];
    const currentProvider = this.field.getValue('Provider');
    if (accessListMap[currentProvider]) {
      accessList = accessListMap[currentProvider].map((key) => ({ label: key, value: key }));
    }
    const configValue = generateMagicVariables(_.get(data, 'Properties', {}));
    return (
      <div style={{ padding: '32px 24px' }}>
        <Form
          {...FOTM_ITEM_LAYOUT}
          style={{
            backgroundColor: '#FFFFFF'
          }}
          labelTextAlign='left'
          field={this.field}
        >
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>ProjectName</Translation>}
            labelTextAlign='left'
            hasFeedback
            required
          >
            <Input
              {...init('ProjectName', { initValue: projectName, rules: [{ required: true }] })}
              disabled
            />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<Translation>Provider</Translation>}
            labelTextAlign='left'
            required
          >
            <Select
              style={{ width: '100%' }}
              dataSource={providerList}
              {...init('Provider', {
                rules: [{ required: true }]
              })}
            />
          </FormItem>
          <FormItem
            {...FOTM_ITEM_LAYOUT}
            label={<span><Translation>Access</Translation><CommonBalloon content={<Translation>AccessDess</Translation>}>
            <Icon type="help" />
          </CommonBalloon></span>}
            labelTextAlign='left'
            required
            style={{ position: 'relative' }}
          >
            <Select
              style={{ width: '100%' }}
              dataSource={accessList}
              {...init('Access', { rules: [{ required: true }] })}
            />
            <Button
              type='primary'
              style={{ position: 'absolute', marginLeft: 5, zIndex: 2 }}
              onClick={this.openToAddConfig}
            >
              <Icon type='add' /><Translation>Add more verification</Translation>
						</Button>
          </FormItem>
          <FormField
            configData={configData}
            configValue={configValue}
            field={this.field}
            hideUnRequiredForm={hideUnRequiredForm}
          />
        </Form>
        <AccessConfig ref={(ref) => (this.accessConfig = ref)} refreshGuiObj={this.refreshGuiObj} />
      </div>
    );
  }
}

export default ProjectPannel;
