import React from "react";

import { Form, Input, Radio, Select, Icon } from "@alifd/next";
import CommonBalloon from "../../components/CommonBalloon";
import ComplexFormStruct from "./complex-form-struct";
import BasicFormStruct from "./basic-form-struct";
import { FOTM_ITEM_LAYOUT } from '../../constants';

import "./index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const GENERIC_LIST_REG = new RegExp(/List<(.*)>/, "i");

class FormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderStringType = (type, fullKey) => {
    const { configValue, field } = this.props;
    const value = configValue[fullKey] || "";
    if (type === "String") {
      return (
        <Input
          defaultValue={configValue[fullKey]}
          {...field.init(fullKey, { initValue: value })}
        />
      );
    }
    if (type === "Number") {
      return (
        <Input
          htmlType="number"
          defaultValue={configValue[fullKey]}
          {...field.init(fullKey, { initValue: value })}
        />
      );
    }
    if (type === "Boolean") {
      return (
        <RadioGroup
          dataSource={[
            { label: "是", value: true },
            { label: "否", value: false },
          ]}
          {...field.init(fullKey, { initValue: false })}
        />
      );
    }

    const typeMatchResut = type.match(GENERIC_LIST_REG);
    if (typeMatchResut) {
      return (
        <BasicFormStruct
          data={typeMatchResut[1]}
          renderStringType={this.renderStringType}
          fullKey={fullKey}
        />
      );
    }
  };

  renderSingleForm = () => {
    const {
      parentData,
      currentData,
      name,
      fullKey,
      renderServiceForm,
      configValue,
      hasParent,
      field,
      hideUnRequiredForm
    } = this.props;
    const data = parentData;
    const trueTypeData = currentData;
    if (Object.prototype.toString.call(trueTypeData) === "[object String]") {
      return (
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
          label={!hasParent ? name : " "}
          labelTextAlign="left"
          help={!hasParent ? data.Description : ""}
          required={data.Required}
        >
          {this.renderStringType(trueTypeData, fullKey)}
        </FormItem>
      );
    }
    if (trueTypeData.Enum || trueTypeData['List<Enum>']) {

      let enumConfigValue = configValue[fullKey];
      let dataSource = trueTypeData.Enum ? trueTypeData.Enum : trueTypeData['List<Enum>'];
      try {
        enumConfigValue = JSON.parse(enumConfigValue);
      } catch (e) {

      }
      return (
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
          label={!hasParent ? name : " "}
          labelTextAlign="left"
          help={!hasParent ? data.Description : " "}
          required={data.Required}
        >
          <Select
            mode={trueTypeData.Enum ? 'single' : 'multiple'}
            dataSource={dataSource.map((_key) => {
              return { label: _key, value: _key };
            })}
            style={{ width: "100%" }}
            {...field.init(fullKey, { initValue: enumConfigValue })}
          />
        </FormItem>
      );
    }
    if (trueTypeData.Struct) {
      return (
        <div>
          <If condition={!hasParent}>
            <FormItem
              {...FOTM_ITEM_LAYOUT}
              style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
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
            />
          </If>
          <div style={{ paddingLeft: 60 }}>
            {Object.keys(trueTypeData.Struct).map((key) =>
              renderServiceForm(
                key,
                trueTypeData.Struct[key],
                `${fullKey}.${key}`
              )
            )}
          </div>
        </div>
      );
    }
    if (trueTypeData["List<Struct>"] || trueTypeData["List"]) {
      return (
        <div>
          <If condition={!hasParent}>
            <FormItem
              {...FOTM_ITEM_LAYOUT}
              style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
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
            />
          </If>
          <div style={{ paddingLeft: 60, visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}>
            <ComplexFormStruct
              data={trueTypeData["List<Struct>"] || trueTypeData["List"]}
              renderServiceForm={renderServiceForm}
              field={field}
              fullKey={fullKey}
            />
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      parentData,
      hideUnRequiredForm
    } = this.props;
    const data = parentData;
    return <div style={{ display: (hideUnRequiredForm && !data.Required) ? 'none' : 'block' }}>{this.renderSingleForm()}</div>;
  }
}

export default FormField;
