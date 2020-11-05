export const GENERIC_ARR_REG = new RegExp(/(.*)\[(\d{1,})\]/, "i");
export const PROVIDER_LIST = [
  {
    label: "Alibaba Cloud",
    value: "alibaba",
  },
  {
    label: "AWS",
    value: "aws",
  },
  {
    label: "Azure",
    value: "azure",
  },
  {
    label: "Baidu Cloud",
    value: "baidu",
  },
  {
    label: "Google Cloud",
    value: "google",
  },
  {
    label: "Huawei Cloud",
    value: "huawei",
  },
  {
    label: "Tencent Cloud",
    value: "tencent",
  },
];

export const FOTM_ITEM_LAYOUT = {
  labelCol: {
    fixedSpan: 5,
  },
  wrapperCol: { span: 13 },
};

export const PROVIDER_MAP = {
  alibaba: ["AccountID", "AccessKeyID", "AccessKeySecret"],
  aws: ["AccessKeyID", "SecretAccessKey"],
  baidu: ["AccessKeyID", "SecretAccessKey"],
  huawei: ["AccessKeyID", "SecretAccessKey"],
  azure: ["KeyVaultName", "TenantId", "ClientId", "ClientSecret"],
  tencent: ["AccountID", "SecretID", "SecretKey"],
  google: ["PrivateKeyData"],
};

export const TYPE_MAP = {
  Application: "应用",
  Component: "组件",
  Plugin: "插件",
};
