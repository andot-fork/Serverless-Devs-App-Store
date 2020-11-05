import React from 'react';

import { Icon, Button } from '@alifd/next';

import "./index.scss";

function generateNum() {
  return Date.now();
}
class ComplexFormStruct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [{ id: generateNum() }]
    };
  }

  removeGroup = (id) => {
    const { groupList } = this.state;
    if (groupList.length === 1) {
      return;
    }
    groupList.forEach((item, i) => {
      if (item.id === id) {
        groupList.splice(i, 1);
      }
    });
    this.setState({
      groupList
    });
  };

  addGroup = () => {
    const { groupList } = this.state;
    groupList.push({ id: generateNum() });
    this.setState({
      groupList
    })
  }

  render() {
    const { data = {}, renderServiceForm, fullKey } = this.props;
    const { groupList } = this.state;

    return (
      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <Button type="primary" onClick={this.addGroup}>添加项</Button>
        </div>

        {groupList.map((item, i) => {
          return (
            <div key={i} className="init-form-group">
              <Icon type='ashbin' onClick={() => this.removeGroup(item.id)} style={{ position: 'absolute', right: 5, top: 5 }} />
              <div>{Object.keys(data).map((key) => renderServiceForm(key, data[key], `${fullKey}[${i}].${key}`))}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ComplexFormStruct;
