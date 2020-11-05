import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Icon } from "@alifd/next";
import Translation from "../../components/Translation";
import { getLanguage } from "../../utils/common";
import CodeBlock from '../../components/CodeBlock';
function Common(props) {
  return (
    <div className="common-part">
      <p className="search-span">
        <Translation>{props.name}</Translation>
      </p>
      <ul className="search-list">
        {props.data &&
          props.data.map((value) => (
            <a
              className={`hot-item ${value === props.value ? "active" : ""}`}
              key={value}
              onClick={() => {
                if (value === props.value) {
                  props.clickToSearch(props.type, "");
                } else {
                  props.clickToSearch(props.type, value);
                }
              }}
            >
              {value}
            </a>
          ))}
      </ul>
    </div>
  );
}

export default class HotSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  changeKeyWord = (keyword) => {
    this.setState({
      keyword,
    });
    const { setKeyWords } = this.props;
    setKeyWords && setKeyWords(keyword);
  };

  render() {
    const {
      clickToSearch,
      searchValue,
      searchPart,
      searchByKeyWords,
      searchKeyWord,
    } = this.props;
    const {
      hotSearch,
      category: scenesData,
      provider: providerList,
      runtime: runtimeList,
      type: typeList,
    } = searchPart;
    const { type, provider, category, runtime } = searchValue;
    const { keyword } = this.state;
    const lang = getLanguage();
    const keyWord = lang === "en" ? "keyword" : "关键词";
    return (
      <div className="nav-part">
        <p className="app-desc">
          <Translation>ApplicationCenter</Translation>{" "}
          <If condition={window.isBrowser}>
            <span style={{fontSize: '14px'}}>
              <Translation>想要体验急速部署功能，请安装s工具</Translation>
              <span className="code-block">npm install -g @serverless-devs/s && s gui</span>
            </span>
          </If>

          {/* <div className="create-component-container">
            <Link to={{ pathname: "publish" }}>
              +{" "}
              <Translation>Publish applications/components/plugins</Translation>
            </Link>
          </div> */}
        </p>
        <div className="nav-pa">
          <div className="search-hot">
            <Input
              placeholder={keyWord}
              className="user-input"
              value={keyword}
              onChange={this.changeKeyWord}
            />
            <Button
              className="search-button"
              type="normal"
              style={{ color: "#fff" }}
              onClick={() => searchByKeyWords(keyword)}
            >
              <Icon style={{ color: "#FFFFFF" }} type="search" />
              <Translation>Search</Translation>
            </Button>
            <div className="common-part">
              {/* <p className="hot-search">
                <Translation>hot</Translation>:
              </p> */}
              <ul className="search-list">
                {hotSearch.map((data) => (
                  <a
                    className={`hot-item ${
                      data.content === searchKeyWord ? "active" : ""
                      }`}
                    key={data.content}
                    onClick={() => {
                      if (data.content === searchKeyWord) {
                        //  this.changeKeyWord("");
                        searchByKeyWords("");
                      } else {
                        // this.changeKeyWord(data.content);
                        searchByKeyWords(data.content);
                      }
                    }}
                  >
                    {data.tag}
                  </a>
                ))}
              </ul>
            </div>
          </div>
          <Common
            name="Scenes"
            data={scenesData}
            type="category"
            value={category}
            clickToSearch={clickToSearch}
          />
          <Common
            name="Provider"
            data={providerList}
            type="provider"
            value={provider}
            clickToSearch={clickToSearch}
          />
          <Common
            name="Runtime"
            data={runtimeList}
            type="runtime"
            value={runtime}
            clickToSearch={clickToSearch}
          />
          <Common
            className="package-type"
            name="Type"
            data={typeList}
            type="type"
            value={type}
            clickToSearch={clickToSearch}
          />
        </div>
      </div>
    );
  }
}
