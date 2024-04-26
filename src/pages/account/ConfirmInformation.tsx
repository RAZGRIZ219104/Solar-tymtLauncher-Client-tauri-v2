import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import createKeccakHash from "keccak";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../components/account/Back";
import AccountHeader from "../../components/account/AccountHeader";
import AccountNextButton from "../../components/account/AccountNextButton";
import Stepper from "../../components/account/Stepper";
import WalletList from "../../components/account/WalletList";

import tymt2 from "../../assets/account/tymt2.png";

import "../../global.css";

import { getAccount, setAccount } from "../../features/account/AccountSlice";

import {
  getNonCustodial,
  setNonCustodial,
} from "../../features/account/NonCustodialSlice";
import { setCustodial } from "../../features/account/CustodialSlice";
import {
  getTempNonCustodial,
  setTempNonCustodial,
} from "../../features/account/TempNonCustodialSlice";
import { getTempCustodial } from "../../features/account/TempCustodialSlice";

import {
  loginEnum,
  accountType,
  walletEnum,
  nonCustodialType,
  custodialType,
} from "../../types/accountTypes";
import {
  getMultiWallet,
  setMultiWallet,
} from "../../features/wallet/MultiWalletSlice";
import { setChainAsync } from "../../features/wallet/ChainSlice";
import { ID53Password, multiWalletType } from "../../types/walletTypes";
import { getTempMultiWallet } from "../../features/wallet/TempMultiWalletSlice";
import { encrypt } from "../../lib/api/Encrypt";
import AuthAPI from "../../lib/api/AuthAPI";
import { AppDispatch } from "../../store";
import {
  getD53Password,
  setD53Password,
} from "../../features/wallet/D53PasswordSlice";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
import { useNotification } from "../../providers/NotificationProvider";
import { selectWallet, setWallet } from "../../features/settings/WalletSlice";
import { walletType } from "../../types/settingTypes";

const ConfirmInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const walletStore: walletType = useSelector(selectWallet);
  const accountStore: accountType = useSelector(getAccount);
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const tempNonCustodialStore: nonCustodialType =
    useSelector(getTempNonCustodial);
  const tempCustodialStore: custodialType = useSelector(getTempCustodial);
  const tempMultiWallet: multiWalletType = useSelector(getTempMultiWallet);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const tempD53PasswordStore: ID53Password = JSON.parse(
    tymtStorage.get(`tempD53Password_${tymt_version}`)
  );
  const d53PasswordStore: ID53Password = useSelector(getD53Password);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  useEffect(() => {
    dispatch(
      setWallet({
        ...walletStore,
        refreshed: false,
      })
    );
  }, []);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleConfirmClick = async () => {
    if (accountStore.wallet === walletEnum.custodial) {
      if (accountStore.mode === loginEnum.login) {
        navigate("/home");
      } else if (accountStore.mode === loginEnum.signup) {
        dispatch(setCustodial(tempCustodialStore));
        navigate("/custodial/login/1");
      } else if (accountStore.mode === loginEnum.reset) {
        dispatch(setCustodial(tempCustodialStore));
        navigate("/custodial/login/1");
      }
    } else if (accountStore.wallet === walletEnum.noncustodial) {
      if (accountStore.mode === loginEnum.login) {
        try {
          const res = await AuthAPI.nonCustodySignin({
            sxpAddress: multiWalletStore.Solar.chain.wallet,
          });
          dispatch(
            setAccount({
              ...accountStore,
              accessToken: res.data.accessToken,
              isLoggedIn: true,
            })
          );
          const data = multiWalletStore.Solar;
          const updateData = { ...data, currentToken: "chain" };
          dispatch(setChainAsync(updateData));
          navigate("/home");
        } catch (err) {
          console.log(err);
          setNotificationStatus("failed");
          setNotificationTitle("Error");
          setNotificationDetail(err);
          setNotificationOpen(true);
          setNotificationLink(null);
        }
      } else if (accountStore.mode === loginEnum.import) {
        try {
          const _mnemonic = await encrypt(
            tempNonCustodialStore.mnemonic.toString(),
            tempNonCustodialStore.password.toString()
          );
          const _password = createKeccakHash("keccak256")
            .update(tempNonCustodialStore.password)
            .digest("hex");
          const _nickname = tempNonCustodialStore.nickname;
          const _avatar = tempNonCustodialStore.avatar;
          const _length = tempNonCustodialStore.mnemonicLength;
          dispatch(
            setNonCustodial({
              ...nonCustodialStore,
              mnemonic: _mnemonic,
              mnemonicLength: _length,
              password: _password,
              nickname: _nickname,
              avatar: _avatar,
            })
          );
          dispatch(
            setD53Password({
              ...d53PasswordStore,
              password: tempD53PasswordStore.password,
            })
          );
          dispatch(
            setTempNonCustodial({
              mnemonic: "",
              mnemonicLength: 12,
              avatar: "",
              nickname: "",
              password: "",
            })
          );
          dispatch(setMultiWallet(tempMultiWallet));
          setLoading(true);
          const userExist = await AuthAPI.getUserBySolarAddress(
            tempMultiWallet.Solar.chain.wallet
          );
          if (userExist.data.users.length === 0) {
            const res = await AuthAPI.nonCustodySignup(
              {
                nickName: tempNonCustodialStore.nickname,
                password: _password,
                wallet: [
                  {
                    chainId: tempMultiWallet.Arbitrum.chain.chainId,
                    chainName: tempMultiWallet.Arbitrum.chain.name,
                    address: tempMultiWallet.Arbitrum.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Avalanche.chain.chainId,
                    chainName: tempMultiWallet.Avalanche.chain.name,
                    address: tempMultiWallet.Avalanche.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Binance.chain.chainId,
                    chainName: tempMultiWallet.Binance.chain.name,
                    address: tempMultiWallet.Binance.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Bitcoin.chain.chainId,
                    chainName: tempMultiWallet.Bitcoin.chain.name,
                    address: tempMultiWallet.Bitcoin.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Ethereum.chain.chainId,
                    chainName: tempMultiWallet.Ethereum.chain.name,
                    address: tempMultiWallet.Ethereum.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Optimism.chain.chainId,
                    chainName: tempMultiWallet.Optimism.chain.name,
                    address: tempMultiWallet.Optimism.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Polygon.chain.chainId,
                    chainName: tempMultiWallet.Polygon.chain.name,
                    address: tempMultiWallet.Polygon.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Solana.chain.chainId,
                    chainName: tempMultiWallet.Solana.chain.name,
                    address: tempMultiWallet.Solana.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Solar.chain.chainId,
                    chainName: tempMultiWallet.Solar.chain.name,
                    address: tempMultiWallet.Solar.chain.wallet,
                  },
                ],
                sxpAddress: tempMultiWallet.Solar.chain.wallet,
              },
              "/auth/non-custody/signup"
            );
            dispatch(
              setAccount({
                ...accountStore,
                uid: res.data._id,
              })
            );
          } else {
            dispatch(
              setAccount({
                ...accountStore,
                uid: userExist.data.users[0]._id,
              })
            );
          }
          setLoading(false);
          navigate("/non-custodial/login/1");
        } catch (err) {
          console.log(err);
          setNotificationStatus("failed");
          setNotificationTitle("Error");
          setNotificationDetail(err);
          setNotificationOpen(true);
          setNotificationLink(null);
        }
      } else if (accountStore.mode === loginEnum.reset) {
        try {
          const _mnemonic = await encrypt(
            tempNonCustodialStore.mnemonic.toString(),
            tempNonCustodialStore.password.toString()
          );
          const _password = createKeccakHash("keccak256")
            .update(tempNonCustodialStore.password)
            .digest("hex");
          const _nickname = tempNonCustodialStore.nickname;
          const _avatar = tempNonCustodialStore.avatar;
          const _length = tempNonCustodialStore.mnemonicLength;
          dispatch(
            setNonCustodial({
              ...nonCustodialStore,
              mnemonic: _mnemonic,
              mnemonicLength: _length,
              password: _password,
              nickname: _nickname,
              avatar: _avatar,
            })
          );
          dispatch(
            setD53Password({
              ...d53PasswordStore,
              password: tempD53PasswordStore.password,
            })
          );
          dispatch(
            setTempNonCustodial({
              mnemonic: "",
              mnemonicLength: 12,
              avatar: "",
              nickname: "",
              password: "",
            })
          );
          dispatch(setMultiWallet(tempMultiWallet));
          setLoading(true);
          const userExist = await AuthAPI.getUserBySolarAddress(
            tempMultiWallet.Solar.chain.wallet
          );
          if (userExist.data.users.length === 0) {
            const res = await AuthAPI.nonCustodySignup(
              {
                nickName: tempNonCustodialStore.nickname,
                password: _password,
                wallet: [
                  {
                    chainId: tempMultiWallet.Arbitrum.chain.chainId,
                    chainName: tempMultiWallet.Arbitrum.chain.name,
                    address: tempMultiWallet.Arbitrum.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Avalanche.chain.chainId,
                    chainName: tempMultiWallet.Avalanche.chain.name,
                    address: tempMultiWallet.Avalanche.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Binance.chain.chainId,
                    chainName: tempMultiWallet.Binance.chain.name,
                    address: tempMultiWallet.Binance.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Bitcoin.chain.chainId,
                    chainName: tempMultiWallet.Bitcoin.chain.name,
                    address: tempMultiWallet.Bitcoin.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Ethereum.chain.chainId,
                    chainName: tempMultiWallet.Ethereum.chain.name,
                    address: tempMultiWallet.Ethereum.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Optimism.chain.chainId,
                    chainName: tempMultiWallet.Optimism.chain.name,
                    address: tempMultiWallet.Optimism.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Polygon.chain.chainId,
                    chainName: tempMultiWallet.Polygon.chain.name,
                    address: tempMultiWallet.Polygon.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Solana.chain.chainId,
                    chainName: tempMultiWallet.Solana.chain.name,
                    address: tempMultiWallet.Solana.chain.wallet,
                  },
                  {
                    chainId: tempMultiWallet.Solar.chain.chainId,
                    chainName: tempMultiWallet.Solar.chain.name,
                    address: tempMultiWallet.Solar.chain.wallet,
                  },
                ],
                sxpAddress: tempMultiWallet.Solar.chain.wallet,
              },
              "/auth/non-custody/signup"
            );
            dispatch(
              setAccount({
                ...accountStore,
                uid: res.data._id,
              })
            );
          } else {
            dispatch(
              setAccount({
                ...accountStore,
                uid: userExist.data.users[0]._id,
              })
            );
          }
          setLoading(false);
          navigate("/non-custodial/login/1");
        } catch (err) {
          console.log(err);
          setNotificationStatus("failed");
          setNotificationTitle("Error");
          setNotificationDetail(err);
          setNotificationOpen(true);
          setNotificationLink(null);
        }
      } else if (accountStore.mode === loginEnum.signup) {
        try {
          const _mnemonic = await encrypt(
            tempNonCustodialStore.mnemonic.toString(),
            tempNonCustodialStore.password.toString()
          );
          const _password = createKeccakHash("keccak256")
            .update(tempNonCustodialStore.password)
            .digest("hex");
          const _nickname = tempNonCustodialStore.nickname;
          const _avatar = tempNonCustodialStore.avatar;
          const _length = tempNonCustodialStore.mnemonicLength;
          dispatch(
            setNonCustodial({
              ...nonCustodialStore,
              mnemonic: _mnemonic,
              mnemonicLength: _length,
              password: _password,
              nickname: _nickname,
              avatar: _avatar,
            })
          );
          dispatch(
            setD53Password({
              ...d53PasswordStore,
              password: tempD53PasswordStore.password,
            })
          );
          dispatch(
            setTempNonCustodial({
              mnemonic: "",
              mnemonicLength: 12,
              avatar: "",
              nickname: "",
              password: "",
            })
          );
          dispatch(setMultiWallet(tempMultiWallet));
          setLoading(true);
          const res = await AuthAPI.nonCustodySignup(
            {
              nickName: tempNonCustodialStore.nickname,
              password: _password,
              wallet: [
                {
                  chainId: tempMultiWallet.Arbitrum.chain.chainId,
                  chainName: tempMultiWallet.Arbitrum.chain.name,
                  address: tempMultiWallet.Arbitrum.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Avalanche.chain.chainId,
                  chainName: tempMultiWallet.Avalanche.chain.name,
                  address: tempMultiWallet.Avalanche.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Binance.chain.chainId,
                  chainName: tempMultiWallet.Binance.chain.name,
                  address: tempMultiWallet.Binance.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Bitcoin.chain.chainId,
                  chainName: tempMultiWallet.Bitcoin.chain.name,
                  address: tempMultiWallet.Bitcoin.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Ethereum.chain.chainId,
                  chainName: tempMultiWallet.Ethereum.chain.name,
                  address: tempMultiWallet.Ethereum.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Optimism.chain.chainId,
                  chainName: tempMultiWallet.Optimism.chain.name,
                  address: tempMultiWallet.Optimism.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Polygon.chain.chainId,
                  chainName: tempMultiWallet.Polygon.chain.name,
                  address: tempMultiWallet.Polygon.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Solana.chain.chainId,
                  chainName: tempMultiWallet.Solana.chain.name,
                  address: tempMultiWallet.Solana.chain.wallet,
                },
                {
                  chainId: tempMultiWallet.Solar.chain.chainId,
                  chainName: tempMultiWallet.Solar.chain.name,
                  address: tempMultiWallet.Solar.chain.wallet,
                },
              ],
              sxpAddress: tempMultiWallet.Solar.chain.wallet,
            },
            "/auth/non-custody/signup"
          );
          setLoading(false);
          dispatch(
            setAccount({
              ...accountStore,
              uid: res.data._id,
            })
          );
          navigate("/non-custodial/login/1");
        } catch (err) {
          console.log(err);
          setNotificationStatus("failed");
          setNotificationTitle("Error");
          setNotificationDetail(err);
          setNotificationOpen(true);
          setNotificationLink(null);
        }
      }
    }
  };

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12}>
          <Stack direction={"row"}>
            <Stack
              sx={{
                width: "calc(100vw - 656px)",
                height: "1008px",
              }}
            >
              <Grid container justifyContent={"center"} pt={"56px"}>
                <Grid
                  item
                  container
                  sx={{
                    width: "520px",
                  }}
                >
                  <Grid item xs={12} container justifyContent={"space-between"}>
                    <Back onClick={handleBackClick} />
                    <Stepper
                      all={0}
                      now={0}
                      texts={[t("ncca-48_almost-done-confirm")]}
                    />
                  </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader
                      title={t("ncca-49_confirm-information")}
                      text={t("ncca-50_welcome-to-kingdom")}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <WalletList
                      mode={
                        accountStore.mode === loginEnum.login
                          ? "login"
                          : "signup"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} mt={"40px"}>
                    <AccountNextButton
                      text={t("ncca-51_confirm")}
                      onClick={handleConfirmClick}
                      disabled={loading}
                      loading={loading}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
            <Box
              component={"img"}
              src={tymt2}
              sx={{
                width: "656px",
                height: "1008px",
                padding: "32px",
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default ConfirmInformation;
