import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";

import InputText from "../../components/account/InputText";
import SecurityLevel from "../../components/account/SecurityLevel";

import { getAccount, setAccount } from "../../features/account/AccountSlice";

import { getKeccak256Hash } from "../../lib/api/Encrypt";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/settings/back-icon.svg";

import { propsType } from "../../types/settingTypes";
import { IAccount } from "../../types/accountTypes";

const Password = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);

  const [newPwd, setNewPwd] = useState("");
  const [oldPwd, setOldPwd] = useState("");
  const [cfmPwd, setCfmPwd] = useState("");

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const updatePassword = useCallback(() => {
    if (accountStore?.password !== getKeccak256Hash(oldPwd)) {
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-15_update-password"));
      setNotificationDetail(t("alt-16_update-password-old"));
      setNotificationOpen(true);
      setNotificationLink(null);
      setNewPwd("");
      setOldPwd("");
      setCfmPwd("");
      return;
    }
    if (accountStore?.password === getKeccak256Hash(newPwd)) {
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-15_update-password"));
      setNotificationDetail(t("alt-17_update-password-new"));
      setNotificationOpen(true);
      setNotificationLink(null);
      setNewPwd("");
      setOldPwd("");
      setCfmPwd("");
      return;
    }
    if (cfmPwd !== newPwd) {
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-15_update-password"));
      setNotificationDetail(t("alt-18_update-password-new-not"));
      setNotificationOpen(true);
      setNotificationLink(null);
      setNewPwd("");
      setOldPwd("");
      setCfmPwd("");
      return;
    }
    setNotificationStatus("success");
    setNotificationTitle(t("alt-15_update-password"));
    setNotificationDetail(t("alt-19_update-password-success"));
    setNotificationOpen(true);
    setNotificationLink(null);

    dispatch(
      setAccount({
        ...accountStore,
        password: getKeccak256Hash(newPwd),
      })
    );

    setNewPwd("");
    setOldPwd("");
    setCfmPwd("");
  }, [accountStore, newPwd, oldPwd, cfmPwd]);

  return (
    <>
      {view === "password" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("security")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-71_change-password")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"center"} gap={"20px"} padding={"20px"}>
              <Box className="fs-h4 white">
                <InputText id="old-password" label={t("set-74_your-old-password")} type="password" value={oldPwd} setValue={setOldPwd} />
              </Box>
              <Box className="fs-h4 white">
                <InputText id="new-password" label={t("set-75_your-new-password")} type="password" value={newPwd} setValue={setNewPwd} />
              </Box>
              <Box>
                <SecurityLevel password={newPwd} />
              </Box>
              <Box className="fs-h4 white">
                <InputText id="confirm-password" label={t("set-77_confirm-your-password")} type="password" value={cfmPwd} setValue={setCfmPwd} />
              </Box>
            </Stack>
            <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
              <Button fullWidth className={classname.action_button} onClick={updatePassword}>
                {t("set-57_save")}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Password;
