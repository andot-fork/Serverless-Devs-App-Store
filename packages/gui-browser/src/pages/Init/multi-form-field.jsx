import React from "react";

import { Form, Select, Icon } from "@alifd/next";
import CommonBalloon from "../../components/CommonBalloon";
import SingleFormField from "./single-form-field";
import { FOTM_ITEM_LAYOUT } from '../../constants';
import _ from 'loadsh';
import "./index.scss";

const FormItem = Form.Item;


const COMMON_DESC_TYPE_REG = new RegExp(/(\[.*\])/, 'i');
class MultiFormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeValue: 0,
    };
  }
  validateParamsValue = (data) => {
    data.Type.forEach((item, i) => {
      if (typeof item === 'object') {
        const _data = item[Object.keys(item)[0]];
        if (_data && configData) {
          let isValid = true;
          Object.keys(configData).forEach((key) => { // 遍历所有真值看看数据结构是否都可以匹配得到,有一项不匹配则不满足
            if (!_data[key]) {
              isValid = false
            }
          });
          if (isValid) {
            typeValue = i;
          }
        }
      }
    });
  }
  componentDidMount() {
    const { data, configValue, fullKey } = this.props;
    let configData = configValue[fullKey];
    try {
      configData = JSON.parse(configData);
    } catch (e) {

    }
    if (data.Type.length > 1) { // 多值选项需要确定值是隶属于哪个选项
      let typeValue = 0;
      data.Type.forEach((item, i) => {
        if (typeof item === 'object') {
          const itemKey = Object.keys(item)[0];
          const _data = item[itemKey];
          if (Object.prototype.toString.call(configData) === '[object Array]') {
            configData = configData[0]; // 取其中一项验证即可
          }
          if (_data && configData) {
            let isValid = true;
            Object.keys(configData).forEach((key) => { // 遍历所有真值看看数据结构是否都可以匹配得到,有一项不匹配则不满足
              if (!_data[key]) {
                isValid = false
              } else { // 如果发现子项为结构体，则再进行进行子对象验证，更深入的结构不再递归
                const structData = _.get(_data[key], 'Type[0].Struct');
                if (structData) {
                  Object.keys(configData[key]).forEach((_subKey) => {
                    if (!structData[_subKey]) {
                      isValid = false;
                    }
                  })
                }
              }
            });
            if (isValid) {
              typeValue = i;
            }
          }
        }
      });
      this.setState({
        typeValue
      })
    }



  }

  changeType = (typeValue) => {
    this.setState({
      typeValue,
    });
  };

  formatDescData = (data) => {
    if (typeof data === 'string') {
      const desc = _.get(data.match(COMMON_DESC_TYPE_REG), '[1]', '');
      return data.replace(desc, '');
    } else {
      const firstKey = Object.keys(data)[0];
      const desc = _.get(firstKey.match(COMMON_DESC_TYPE_REG), '[1]', '');
      const newKey = firstKey.replace(desc, '');
      let emptyData = {}
      emptyData[newKey] = data[firstKey];
      return emptyData

    }
  }

  render() {
    const {
      data,
      name,
      fullKey,
      renderServiceForm,
      configValue,
      field,
      hideUnRequiredForm
    } = this.props;
    const { typeValue } = this.state;
    return (
      <div style={{ display: (hideUnRequiredForm && !data.Required) ? 'none' : 'block' }}>
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          label={
            <div>
              <span>{name}</span>
              <CommonBalloon content={data.Description}>
                <Icon type="help" />
              </CommonBalloon>
            </div>
          }
          labelTextAlign="left"
          required={data.Required}
        >
          <Select
            dataSource={data.Type.map((_key, i) => {
              let desc = ''
              if (typeof _key === 'string') {
                desc = _.get(_key.match(COMMON_DESC_TYPE_REG), '[1]', '');
              } else {
                desc = _.get(Object.keys(_key)[0].match(COMMON_DESC_TYPE_REG), '[1]', '')

              }
              return { label: desc, value: i };
            })}
            style={{ width: "100%" }}
            value={typeValue}
            onChange={this.changeType}
          />
        </FormItem>
        <div style={{ display: (hideUnRequiredForm && !data.Required) ? 'none' : 'block' }}>
          {data.Type.map((item, i) => {
            return (
              <If condition={i === typeValue}>
                <SingleFormField
                  key={fullKey}
                  parentData={data}
                  currentData={this.formatDescData(item)}
                  name={name}
                  fullKey={fullKey}
                  renderServiceForm={renderServiceForm}
                  configValue={configValue}
                  hasParent
                  field={field}
                />
              </If>
            );
          })}
        </div>
      </div>
    );
  }
}

export default MultiFormField;
