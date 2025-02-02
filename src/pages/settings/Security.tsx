import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Box, Button, Divider, Stack } from "@mui/material";

import ComingModal from "../../components/modals/ComingModal";

import { getAccount } from "../../features/account/AccountSlice";

import { getKeccak256Hash } from "../../lib/api/Encrypt";

import backIcon from "../../assets/settings/back-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";

import { propsType } from "../../types/settingTypes";
import { IAccount } from "../../types/accountTypes";
import { emit } from "@tauri-apps/api/event";
import { TauriEventNames } from "../../consts/TauriEventNames";

const Security = ({ view, setView }: propsType) => {
  const { t } = useTranslation();

  const accountStore: IAccount = useSelector(getAccount);

  const isGuest = useMemo(() => accountStore?.nickName === "Guest" && accountStore?.password === getKeccak256Hash(""), [accountStore]);

  const [coming, setComing] = useState<boolean>(false);

  const handleBackupClick = () => {
    try {
      if (isGuest) {
        emit(TauriEventNames.GUEST_MODAL_VIEW, true);
        return;
      }
      setView("backup");
    } catch (err) {
      console.log("Failed to handleBackupClick: ", err);
    }
  };

  return (
    <>
      {view === "security" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-14_security-privacy")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => setView("password")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-71_change-password")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={handleBackupClick}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-89_backup-passphrase")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack
              direction={"column"}
              justifyContent={"flex-start"}
              gap={1}
              padding={"20px"}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ffffff1a",
                },
              }}
              onClick={() => setComing(true)}
            >
              <Box className="fs-h4 white">{t("set-72_multi-factor-auth")}</Box>
              <Box
                className="fs-16-regular gray"
                sx={{
                  whiteSpace: "normal",
                }}
              >
                {t("set-73_multi-factor-detail")}
              </Box>
            </Stack>
          </Stack>
          <ComingModal open={coming} setOpen={setComing} />
        </Stack>
      )}
    </>
  );
};

export default Security;
