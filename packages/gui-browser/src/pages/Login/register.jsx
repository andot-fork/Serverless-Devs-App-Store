import React from "react";
import { Link } from "react-router-dom";
import { request, processResponse } from "../../utils/request";
import { Form, Input, Checkbox, Button, Message } from "@alifd/next";

import Translation from "../../components/Translation";
import SwitchLanguage from "./switch-button/index";
import { withTranslation } from "react-i18next";
import { bindKeydown, unbindKeydown } from "../../utils/common";
import img from "../../assets/slogo.png";
import "./index.scss";
const FormItem = Form.Item;

class RegisterCmp extends React.Component {
  handleSubmit = (values) => {
    console.log("Get form value:", values);
  };
  constructor(props) {
    super(props);
    this.state = {
      isRegister: true,
      userName: "",
      passWord: "",
      email: "",
    };
  }

  componentDidMount() {
    this.input.focus();
    bindKeydown(async () => {
      this.postSign();
    });
  }

  componentWillUnmount() {
    unbindKeydown();
  }


  toLogin = () => {
    this.props.history.push("/login");
  };
  postSign = async () => {
    const { userName, passWord, email } = this.state;
    if (userName && passWord && email) {
      const result = await request({
        url: "/api/user/register",
        data: {
          username: userName,
          password: passWord,
          email: email,
        },
        method: "post",
      });
      const isSignSucceed = processResponse(result, "sign");
      if (isSignSucceed) {
        this.props.history.push("/app");
      }
    } else {
      Message.error({
        title: "Please input all data",
      });
    }
  };

  processResult = (result) => {
    const { status, data } = result;
    if (status === 200) {
      let isError = Object.keys(data)[0];
      if (isError === "Error") {
        let errorMessage = data["Error"]["Message"];
        Message.error({
          title: errorMessage,
        });
      } else {
        Message.success({
          title: "your log is success",
        });
      }
    }
  };

  render() {
    const { t } = this.props;
    const { userName, email, passWord, isRegister } = this.state;

    return (
      <div className="bg-color">
        <div className="head-part">
          <div className="first-part">
            <div className="server-father">
              <img className="server-icon" src={img} alt="icon" />
            </div>
            <p className="title-desc">
              Serverless Dev <br></br> Tool
            </p>

            <p className="desc-part">
              <Translation>Thanks for your contribution</Translation>
            </p>
            <p className="desc-part">
              <Translation>
                That makes up for one giant leap for Serverless
              </Translation>
            </p>
            <p className="desc-part enter-appcenter">
              <Link to={{
                pathname: "app",
              }}><Translation>Click to enter the application center</Translation></Link>
            </p>
          </div>
          <div className="second-login">
            <Form style={{ width: "300px" }}>
              <FormItem className="first-form">
                <div className="login-language">
                  <a
                    href
                    className={`sign-login ${isRegister ? "is-sign" : null} `}
                    onClick={this.toSign}
                  >
                    <Translation>Sign up</Translation>
                  </a>
                  <a href className={"sign-login"} onClick={this.toLogin}>
                    <Translation>Log in</Translation>
                  </a>
                  <div className="switch-language">
                    <SwitchLanguage></SwitchLanguage>
                  </div>
                </div>

                <p className="sign-desc" style={{ display: "block" }}>
                  <Translation>
                    After registration, you may easily share your package via
                    Serverless Devs tool to public Git.
                  </Translation>
                </p>
              </FormItem>
              <FormItem
                className="form-item"
                style={{ marginBottom: "24px" }}
                hasFeedback
                required
              >
                <Input
                  className="login-input-part"
                  value={userName}
                  htmlType="text"
                  name="username"
                  ref={(input) => (this.input = input)}
                  placeholder={t("UserName")}
                  onChange={(e) => {
                    this.setState({
                      userName: e,
                    });
                  }}
                />
              </FormItem>
              <FormItem
                style={{
                  marginBottom: "24px",
                }}
                hasFeedback
                required
              >
                <Input
                  className="login-input-part"
                  value={email}
                  htmlType="text"
                  name="email"
                  placeholder={t("Email")}
                  onChange={(e) => {
                    this.setState({
                      email: e,
                    });
                  }}
                />
              </FormItem>
              <FormItem hasFeedback required>
                <Input
                  className="login-input-part"
                  value={passWord}
                  htmlType="Password"
                  name="basePass"
                  placeholder={t("Password")}
                  onChange={(e) => {
                    this.setState({
                      passWord: e,
                    });
                  }}
                />
              </FormItem>

              <FormItem className="login-button">
                <div className="sign-part" style={{ display: "block" }}>
                  <p className="check-desc">
                    <Checkbox
                      name="baseAgreement"
                      className="check-item"
                    ></Checkbox>
                    <Translation>I agree to</Translation>
                    <a href className="server-item">
                      <Translation>Serverless Dev terms.</Translation>
                    </a>
                  </p>
                  <br></br>
                  <Button
                    type="normal"
                    className={`is-log ${
                      isRegister ? "is-sign-button " : null
                    } `}
                    onClick={this.postSign}
                  >
                    <span className="login-sign-content">
                      <Translation>Sign up</Translation>{" "}
                    </span>
                  </Button>
                </div>
              </FormItem>
            </Form>
          </div>
          <footer className="footer-part">Powered by Serverless Devs</footer>
        </div>
      </div>
    );
  }
}
const Register = withTranslation()(RegisterCmp);
export default Register;
