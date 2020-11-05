import React from "react";

import SingleFormField from "./single-form-field";
import MultiFormField from "./multi-form-field";
import "./index.scss";

class FormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderServiceForm = (name, data, fullKey) => {
    const { configValue = {}, field, hideUnRequiredForm } = this.props;

    if (data.Type) {
      //最外层描述对象
      if (data.Type.length === 1) {
        // 单项表单
        const trueTypeData = data.Type[0];
        return (
          <SingleFormField
            key={fullKey}
            hideUnRequiredForm={hideUnRequiredForm}
            parentData={data}
            currentData={trueTypeData}
            name={name}
            fullKey={fullKey}
            renderServiceForm={this.renderServiceForm}
            configValue={configValue}
            field={field}
          />
        );
      } else {
        //多项表单
        return (
          <MultiFormField
            key={fullKey}
            hideUnRequiredForm={hideUnRequiredForm}
            data={data}
            name={name}
            fullKey={fullKey}
            renderServiceForm={this.renderServiceForm}
            configValue={configValue}
            field={field}
          />
        );
      }
    }
  };

  render() {
    const { configData = {} } = this.props;
    return (
      <div className="config-render" style={{ paddingBottom: 32 }}>
        {Object.keys(configData).map((key) => {
          return this.renderServiceForm(key, configData[key], key);
        })}
      </div>
    );
  }
}

export default FormField;
