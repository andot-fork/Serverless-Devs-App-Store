import React from "react";
import { useTranslation } from "react-i18next";

const Translation = ({ children, expand }) => {
  const { t } = useTranslation();
  return (
    <span>
      {t(children)}
      {expand}
    </span>
  );
};

export default Translation;
