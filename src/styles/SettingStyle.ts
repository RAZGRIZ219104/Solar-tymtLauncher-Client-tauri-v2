import { makeStyles } from "@mui/styles";
const SettingStyle = makeStyles({
  input: {
    width: "100%",
    textAlign: "right",

    height: "58px",
    borderRadius: "16px",
    border: "1px solid #FFFFFF1A",
    background: "#8080801A",
    backgroundBlendMode: "luminosity",
    color: "white",
    boxShadow: "none",
    "& .MuiInputBase-input": {
      font: "unset",
      color: "white",
      fontFamily: "Cobe",
      fontSize: "18px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "24px",
      letterSpacing: "-0.36px",
      padding: "0px 3px 5px  5px",
      border: "none",
      background: "none",
    },
    "& .MuiInputBase-root": {
      font: "unset",
      height: "58px",
      borderRadius: "16px",
      border: "1px solid #FFFFFF1A",
      background: "#8080801A",
      backgroundBlendMode: "luminosity",
      fontFamily: "Cobe",
      color: "var(--Basic-Light, #AFAFAF)",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF33",
      borderWidth: "3px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF33",
      borderWidth: "3px",
    },
  },
  border_container: {
    border: "1px solid #FFFFFF1A",
    padding: "24px 16px 24px 16px",
    borderRadius: "16px",
    gap: "8px",
  },
  adornment: {
    "& .MuiBox-root": { color: "white" },
    "& .MuiTypography-root": { color: "white" },
  },
  setting_container: {
    height: "98% !important",
    minWidth: "550px",
    display: "flex",
    borderRadius: "32px",
    backgroundColor: "#8080804D !important",
    backgroundBlendMode: "luminosity",
    backdropFilter: "blur(4px)",
    margin: "10px",
    position: "fixed",
    "&.MuiPaper-root": {
      flexDirection: "row",
    },
  },
  tooltip: {
    padding: "6px 8px 6px 8px",
    borderRadius: "32px",
    border: "1px",
    borderColor: "#FFFFFF1A",
    backgroundColor: "#8080804D",
  },
  collaps_pan: {
    width: "45px",
    height: "100%",
    position: "relative",
  },
  setting_pan: {
    maxWidth: "505px",
    width: "100%",
    height: "100%",
    overflow: "scroll",
    borderRadius: "24px",
    backgroundColor: "#071516",
    whiteSpace: "nowrap",
    overFlowX: "auth",
    scrollbarWidth: "none",
    position: "relative",
  },
  close_icon: {
    cursor: "pointer",
    position: "absolute",
    bottom: "40px",
  },
  main_container: {
    display: "flex",
    gap: "16px",
    borderRadius: "24px",
    margin: "16px",
    flexDirection: "column",
    border: "solid 1px #FFFFFF1A",
  },
  user_pad: {
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
    alignItems: "center",
    padding: "15px",
  },
  wallet_pad: {
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
    alignItems: "center",
    padding: "15px",
  },
  addresss_pad: {
    backgroundColor: "#0f2727",
    margin: "15px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
  },
  wallet_add_panel: {
    margin: "15px",
    paddingBottom: "15px",
    display: "flex",
    justifyContent: "space-around",
  },
  icon_pad: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItem: "center",
    gap: "45px",
    margin: "20px",
  },
  fee_switch_container: {
    padding: "2px",
    borderRadius: "16px",
    gap: "2px",
    border: "1px solid",
    borderColor: "#FFFFFF1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fee_switch_button: {
    "&.MuiButtonBase-root, &.MuiBox-root": {
      display: "block",
      textTransform: "none",
      color: "#52E1F21A",
      minWidth: "unset",
      boxShadow: "none",
      padding: "0px",
      borderRadius: "16px",
    },
  },
  switch_button: {
    padding: "8px 16px 8px 16px",
    fontFeatureSettings: "'calt' off",
    fontFamily: "Cobe",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "24px" /* 133.333% */,
    letterSpacing: "-0.36px",
  },
  action_button: {
    "&.MuiButtonBase-root": {
      textTransform: "none",
      fontSize: "18px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "24px" /* 133.333% */,
      letterSpacing: "-0.36px",
      height: "46px",
      borderRadius: "16px",
      backgroundColor: "transparent",
      color: "#52E1F2",
      borderColor: "#EF4444",
      fontFamily: "Cobe",
      boxShadow: "none",
      border: "1px solid",
      paddingTop: "5px",
      "&:hover": {
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
      },
      "&:active": {
        backgroundColor: "#EF4444",
        boxShadow: "1px 1px #EF44445F",
      },
      "&:disabled": {
        backgroundColor: "#222222", // Example: light gray background
        color: "#A0A0A0", // Example: gray text color
        borderColor: "#222222", // Example: gray border color
      },
    },
  },
});
export default SettingStyle;
