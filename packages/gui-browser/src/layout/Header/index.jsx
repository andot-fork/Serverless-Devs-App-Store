import React, { useState } from "react";
import "./index.scss";
import img from "../../assets/s.png";
import { Button } from "@alifd/next";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { publish } from "tiny-pubsub";
import { getLanguage } from "../../utils/common";
const HAS_LINE_PATH = ["/app", "/component-detail"];
const Header = (props) => {
  let { i18n } = useTranslation();
  const _isEnglish = getLanguage() === "en";
  const [isEnglish, setIsEnglish] = useState(_isEnglish);
  const currentRouter = props.history.location.pathname;
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: 80,
        zIndex: 2,
        top: 0,
        backgroundColor: "#F6F6F6",
      }}
    >
      <div
        className="head-nav"
        style={{
          borderBottom: !HAS_LINE_PATH.includes(currentRouter)
            ? "1px solid #ccc"
            : "none",
        }}
      >
        <img src={img} alt="serverless logo" className="logo" />
        <p className="desc" style={{ marginTop: 7 }}>
          App Store
        </p>
        <div className="login-span">
          <Link to={{
            pathname: "login",
          }} className="link">登录</Link>
          <span className="split-span">|</span>
          <Link to={{
            pathname: "register",
          }} className="link">注册</Link>
        </div>
        <div className="button-style">

          <Button
            className={`english-part ${isEnglish ? "is-english" : null}`}
            onClick={() => {
              i18n.changeLanguage("en");
              localStorage.setItem("lang", "en");
              publish("language-change", "en");
              setIsEnglish(true);
            }}
          >
            English
          </Button>
          <Button
            className={`chinese-part ${isEnglish ? "null" : "is-english"}`}
            onClick={() => {
              i18n.changeLanguage("zh");
              localStorage.setItem("lang", "zh");
              publish("language-change", "zh");
              setIsEnglish(false);
            }}
          >
            中文
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Header;
