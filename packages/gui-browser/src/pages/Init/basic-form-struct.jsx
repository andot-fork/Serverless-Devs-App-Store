import React from 'react';

import { Icon, Button } from '@alifd/next';

import "./index.scss";

function generateNum() {
  return Date.now();
}
class BasicFormStruct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleItemList: [{ id: generateNum() }]
    };
  }

  removeGroup = (id) => {
    const { singleItemList } = this.state;
    if (singleItemList.length === 1) {
      return;
    }
    singleItemList.forEach((item, i) => {
      if (item.id === id) {
        singleItemList.splice(i, 1);
      }
    });
    this.setState({
      singleItemList
    });
  };

  addGroup = () => {
    const { singleItemList } = this.state;
    singleItemList.push({ id: generateNum() });
    this.setState({
      singleItemList
    })
  }

  render() {
    const { data = {}, renderStringType, fullKey } = this.props;
    const { singleItemList } = this.state;

    return (
      <div style={{ paddingLeft: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <Button type="primary" onClick={this.addGroup}>添加项</Button>
        </div>

        {singleItemList.map((item,i) => {
          return (
            <div className="init-form-group" key={i}>
              <Icon type='ashbin' onClick={() => this.removeGroup(item.id)} style={{ position: 'absolute', right: 5, top: 5 }} />
              <div>{renderStringType(data,`${fullKey}[${i}]`)}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default BasicFormStruct;
