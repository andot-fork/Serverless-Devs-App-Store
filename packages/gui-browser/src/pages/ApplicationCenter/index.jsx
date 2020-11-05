import React from "react";
import _ from "loadsh";
import "./index.scss";
import { Link } from "react-router-dom";
import { subscribe } from "tiny-pubsub";
import { Button, Loading, Slider } from "@alifd/next";
import VisibilitySensor from "react-visibility-sensor";
import HotSearch from "./search";
import { request } from "../../utils/request";
import { TYPE_MAP } from "../../constants";
import DeployComponent from "../../components/DeployComponent";
import Translation from "../../components/Translation";
import { bindKeydown, unbindKeydown } from "../../utils/common";
const PROVIDER_MAP = {
  alibaba: {
    text: "阿里云官方",
    icon:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAYCAYAAACWTY9zAAABgElEQVRIS+2XMU7DQBBF38REAXEFoAXq1HSICkQJBVwAJUJAwxFoAKFEuQApoERQRXTUEWWgBa6AIArOorVxZDkbe60EsCBb2fKM5+3f7/WsEBpqn1neOQBWEOZQTIefG67rUmPbFKN2OAe2YvOFVxRPQINJjuWE5yBeggtVpkSXIwuYIKVFgaKc8mYEK1PA5R5YTJic/1hD5jiUClX/FvCgXCpWLwheMkFRzniMy1G7zPNBM8VkwaGs4SRFcsuT3OEGuJMKbZuJKK0cLOGy6lkkSUGtnJ50gheucWiQ5yq8/jZAg2I8H3dYx/Ug1wbE1TWYNtxMJOCFPMtJSzUMoGchvdQdbk31NZjqK5BjU6pcDlvYJl+V2KDLRTTWDJZn4bvV6u0GvmoPYzCbZQz5bHjFjJ60oJCav2dGx9cHMAbrU+b/KmZhp1QhI/NYqqoWwX8ELCO/pMz+xONa4F9se+y7zJ9tFDPbWvfaj1EfRvaYok0zsZUOAEyHkR5cho5vn9Tm9tOGx3nlAAAAAElFTkSuQmCC",
  },
};

class CardPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  prepareDeploy = async () => {
    const { cardData: data, replyDeploy } = this.props;
    const { openNativeDialog, onReplyOpenNativeDialog } = window;
    onReplyOpenNativeDialog((event, result) => {
      replyDeploy(result);
    });
    openNativeDialog({
      data,
    });
  };

  render() {
    const { cardData } = this.props;
    let iconData;
    const isShowDeploy =
      cardData.type === "Application" || cardData.type === "Component";
    if (cardData.user === "alibaba") {
      iconData = PROVIDER_MAP[cardData.user] || { text: cardData.user };
    }

    return (
      <div className="card-cmp" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="content-detail">
          <div className="first-auth">
            <If condition={iconData}>
              <If condition={iconData.icon}>
                <img src={iconData.icon} alt="authIcon" className="auth-icon" />
                <span className="auth-name">{iconData.text}</span>
              </If>
            </If>
            <If condition={!iconData}>
              <span className="auth-name">{cardData.user}</span>
            </If>
          </div>

          <p className="card-title">
            <Link
              to={{
                pathname: "component-detail",
                state: cardData,
              }}
            >
              {cardData.name}
            </Link>
          </p>
          <p className="card-desc">{cardData.description}</p>
          <div className="card-footer">
            <img
              src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB5klEQVRYR+2WsU7DMBCGYzdS1eQBiuAlgJkJFiYCDJHdpSwICVhZK1GJRwCJDZbEigQoGxMbK+IBmIH2ATo1NjoUIxMcu01VdSBZMti+//N/vrORs+APLVjfqQFmdoAxFgghrvNUvsFfCDHEGH9gjO/CMHwypXkiABAhhKS6QEmSbGZZFuXCbXUOxviKEHIyEwBjrMc5P0cI3VJKD0zBkiRZzbLsUYF56HQ6+5UBpLgMYNpRmqbLo9HoRQjRBlghRBch9Ewp3agEoOx8gBA6gjxDcB1EURyciqJIVAZQxRuNxnYYhq+qiAqhE4cd5wADSunSVA7oxGUAmWPpRKvVulBtV89IHMefsG4qAJO4DgIhNJA5Lx5QqBxYU1Y9Mt5PGU4iXgJhrQ5rCkzistF4nrceBMG7CsE5P7TVue2uQbadM8YuOefHrutu2bqaTUw3juRhkae9OGnuAHCym83mULVXhZg7gM02EwDAc853CCF9W5yycetlZAKI4/gGWq7rumvQrIoi0KTKnP1ThmWEVQHkOt/3V0wQ3w6AlePxuOf7/mlxclWAKIruHcfZK3PnlwNSBGO8W+xcNUDtwP9wIH/Z9j3PCzVlCM/us7IxznlX9/CEW7RsTO051k5YtcVOuq4GWLgDXxkOQj+/THUZAAAAAElFTkSuQmCC`}
              alt="isTag"
              className="download-icon"
              style={{ marginRight: 4 }}
            />
            <span className="card-download">{cardData.download_count}</span>
            <span className="card-span">|</span>
            <span className="card-type">{TYPE_MAP[cardData.type]}</span>
            <span className="card-span">|</span>
            <span>
              {cardData.tags
                .filter((key, i) => i < 2)
                .map((tag) => (
                  <span key={tag} className="card-tag">
                    <strong>【</strong>
                    {tag}
                    <strong>】</strong>
                  </span>
                ))}
            </span>
          </div>
          <If condition={!window.isBrowser}>
            <Button
              style={{ display: isShowDeploy ? "block" : "none" }}
              className="deploy-name"
              onClick={this.prepareDeploy}
            >
              <Translation>Deploy</Translation>
            </Button>
          </If>
        </div>
      </div>
    );
  }
}

class ApplicationCenter extends React.Component {
  constructor(props) {
    super(props);
    props.cacheLifecycles.didCache(this.componentDidCache);
    props.cacheLifecycles.didRecover(this.componentDidRecover);
    this.state = {
      loading: false,
      choosedComponentData: {
        name: "",
        type: "",
        provider: "",
      },
      searchKeyWord: "",
      searchValue: {
        type: "",
        provider: "",
        category: "",
        service: "",
        tag: "",
        runtime: "",
      },
      banner: [],

      hotSearch: [],
      category: [],
      provider: [],
      runtime: [],
      type: [],

      cardData: [],
      hasMorePage: true,
    };
    this.commonSearchUrl = [
      { type: "hotSearch", url: "/api/common/hotwords" },
      { type: "runtime", url: "/api/common/runtime" },
      { type: "provider", url: "/api/common/provider" },
      { type: "category", url: "/api/common/category" },
      { type: "type", url: "/api/common/type" },
      { type: "banner", url: "/api/common/banner" },
    ];
  }

  async componentDidMount() {
    this.refresh();
    subscribe("language-change", () => {
      this.child.changeKeyWord("");
      this.setState(
        {
          searchValue: {
            type: "",
            provider: "",
            category: "",
            service: "",
            tag: "",
            runtime: "",
          },
          searchKeyWord: "",
        },
        this.refresh
      );
    });
    bindKeydown(async () => {
      const { searchKeyWord } = this.state;
      this.searchByKeyWords(searchKeyWord);
    });
  }

  componentWillUnmount() {
    unbindKeydown();
  }

  refresh = async () => {
    this.commonSearchUrl.forEach((item) => {
      const { type, url } = item;
      this.getCommonSearch(url, type);
    });

    const cardData = await this.search({ offset: 0 });
    this.setState({
      cardData,
    });
  };

  componentDidCache = () => {};

  componentDidRecover = () => {};

  search = async (params = {}) => {
    this.setState({
      loading: true,
    });
    const result = await request({
      url: "/api/package/object",
      params,
    });
    this.setState({
      loading: false,
    });
    const Response = _.get(result, "data.Response", []);
    if (Response.length < 20) {
      this.setState({
        hasMorePage: false,
      });
    } else {
      this.setState({
        hasMorePage: true,
      });
    }
    return Response;
  };

  searchByKeyWords = async (keyword) => {
    const cardData = await this.search({ keyword });
    this.setState({
      cardData,
      searchKeyWord: keyword,
      searchValue: {},
    });
  };

  setKeyWords = (searchKeyWord) => {
    this.setState({
      searchKeyWord,
    });
  };

  getCommonSearch(url, type) {
    request({
      url,
    }).then((result) => {
      const Response = _.get(result, "data.Response", []);
      const newState = {};
      newState[`${type}`] = Response;
      this.setState(newState);
    });
  }

  replyDeploy = (data) => {
    this.deployDialog && this.deployDialog.replyDeploy(data);
  };

  clickToSearch = async (type, value) => {
    const { searchKeyWord: keyword } = this.state;
    const searchValueItem = {};
    searchValueItem[type] = value;
    const searchValue = Object.assign(
      {},
      this.state.searchValue,
      searchValueItem,
      { keyword }
    );
    this.setState({
      searchValue,
    });
    const cardData = await this.search(searchValue);

    this.setState({
      cardData,
    });
  };

  loadMorePage = async (isVisible) => {
    const { hasMorePage, cardData: offsetCardData } = this.state;
    if (isVisible && hasMorePage) {
      const offset = offsetCardData.length;
      const { searchKeyWord: keyword } = this.state;
      const searchValue = Object.assign(
        {},
        this.state.searchValue,
        { keyword },
        { offset }
      );
      const cardData = await this.search(searchValue);
      const newCardData = [...this.state.cardData, ...cardData];
      this.setState({
        cardData: newCardData,
      });
    }
  };

  onRef = (ref) => {
    this.child = ref;
  };

  render() {
    const {
      cardData: data,
      searchValue,
      hotSearch,
      category,
      provider,
      runtime,
      type,
      searchKeyWord,
      loading,
      banner,
    } = this.state;
    const { history } = this.props;
    const bannerNodes = banner.map((item, index) => (
      <div key={index} className="advertising-wrapper">
        <Link
          to={{
            pathname: "component-detail",
            search: `name=${item.package.name}&type=${item.package.type}&provider=${item.package.provider}`,
            state: item.package,
          }}
        >
          <img
            draggable={false}
            src={item.picture}
            alt={item.package.name}
            className="advertising-img"
          />
        </Link>
      </div>
    ));

    return (
      <div className="application-center">
        <div style={{ width: "100%", backgroundColor: "#fff" }}>
          <HotSearch
            searchKeyWord={searchKeyWord}
            searchPart={{
              hotSearch,
              category,
              provider,
              runtime,
              type,
            }}
            clickToSearch={this.clickToSearch}
            searchByKeyWords={this.searchByKeyWords}
            searchValue={searchValue}
            setKeyWords={this.setKeyWords}
            onRef={this.onRef}
          />
        </div>
        <Loading
          visible={loading}
          style={{ width: "100%", position: "relative" }}
        >
          <div className="card-collection">
            <div className="advertising-content">
              <Slider>{bannerNodes}</Slider>
            </div>
            {data.map((item, index) => (
              <CardPart
                cardData={item}
                key={index}
                replyDeploy={this.replyDeploy}
              />
            ))}
            <VisibilitySensor onChange={this.loadMorePage}>
              <div style={{ width: "10px", height: "10px" }}></div>
            </VisibilitySensor>
          </div>
        </Loading>
        <DeployComponent
          ref={(ref) => (this.deployDialog = ref)}
          history={history}
        />
      </div>
    );
  }
}

export default ApplicationCenter;
