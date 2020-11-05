const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const os = require("os");
const writeTokenPath = path.join(os.homedir(), '.s' , 'login_token.txt');

const cert: string = "serverless-token";
//生成token的方法
export const generateToken = async (data) => {
  try {
    let created = Math.floor(Date.now() / 1000);
    let token: string = jwt.sign(
      {
        data,
        exp: created + 3600 * 24,
      },
      cert
    );
    await fs.writeFileSync(writeTokenPath, token, (err) => {
      if (err) throw err;
      console.log("token has been saved");
    });
  } catch (err) {
    console.log(err);
  }
};


//验证Token
export const verifyToken = (token) => {
  try {
    const result = jwt.verify(token, cert);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};


export const pathIsPublish = async () => {
  const getToken = fs.readFileSync(writeTokenPath, "utf-8");
  if (getToken) {
    const isValidToken = await verifyToken(getToken);
    console.log(isValidToken);
    if (!isValidToken) {
      console.log("login here");
      return false;
    } else {
      return true;
    }
  } else {
    console.log("please goto login page");
    return false;
  }
};

