import numeral from "numeral";
import { formatUnits } from "ethers";
import { IChain, ISupportChain, IWallet } from "../types/walletTypes";
import {
  sol_scan_path,
  btc_scan_path,
  solar_scan_path,
  bsc_scan_path,
  eth_scan_path,
  pol_scan_path,
  opt_scan_path,
  avax_scan_path,
  arb_scan_path,
  net_name,
  eth_api_url,
  eth_api_key,
  arb_api_url,
  arb_api_key,
  avax_api_url,
  bsc_api_url,
  bsc_api_key,
  op_api_url,
  op_api_key,
  matic_api_url,
  matic_api_key,
  eth_rpc_url,
  arb_rpc_url,
  avax_rpc_url,
  bsc_rpc_url,
  op_rpc_url,
  matic_rpc_url,
} from "../configs";
import { getCurrentChainWalletAddress } from "./helper/WalletHelper";
import { ChainNames } from "../consts/Chains";

export const formatDate = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ; ${hours}:${minutes}`;
};

export const formatDateAsMMDDYYYY = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}.${date.getFullYear()}`;
    return formattedDate;
  } catch (err) {
    console.log("Failed to formatDateAsMMDDYYYY: ", err);
  }
};

export const formatDecimal = (number, count = 8) => {
  const cryptoAmount = formatUnits(number, count);
  return numeral(cryptoAmount).format("0,0.[00000000]");
};

export const formatBalance = (number, count = 2) => {
  const cryptoAmount = number?.toLocaleString("en", {
    minimumFractionDigits: count,
    maximumFractionDigits: count,
  });
  return numeral(cryptoAmount)?.format("0,0.0[0000]");
};
export const getExplorerUrl = (chain: ISupportChain, walletStore: IWallet): string => {
  let url = "";
  const currentChainWallet = getCurrentChainWalletAddress(walletStore, chain?.chain?.name);
  switch (chain.chain.symbol) {
    case "SXP": {
      url = solar_scan_path + "wallet/" + currentChainWallet;
      break;
    }
    case "BNB": {
      url = bsc_scan_path + "address/" + currentChainWallet;
      break;
    }
    case "Ethereum": {
      url = eth_scan_path + "address/" + currentChainWallet;
      break;
    }
    case "Bitcoin": {
      url = btc_scan_path + "address/" + currentChainWallet;
      break;
    }
    case "Solana": {
      if (net_name == "testnet") {
        url = sol_scan_path + "account/" + currentChainWallet + "?cluster=testnet";
      } else {
        url = sol_scan_path + "account/" + currentChainWallet;
      }

      break;
    }
    case "MATIC": {
      url = pol_scan_path + "address/" + currentChainWallet;
      break;
    }
    case "AVAX": {
      url = avax_scan_path + "address/" + currentChainWallet;
      break;
    }
    case "ARBETH": {
      url = arb_scan_path + "address/" + currentChainWallet;
      break;
    }
    case "OETH": {
      url = opt_scan_path + "address/" + currentChainWallet;
      break;
    }
  }
  return url;
};
export const formatTransaction = (walletStore: IWallet, chain: ISupportChain, currentTokenSymbol: string, data: any) => {
  const currentChainWallet = getCurrentChainWalletAddress(walletStore, chain?.chain?.name);

  let direction = 0;
  let address = "";
  let time = "";
  let url = "";
  let amount = "";
  let logo = chain?.chain?.logo;
  let symbol = chain?.chain?.symbol;

  const isNativeToken = chain.chain.symbol === currentTokenSymbol;
  if (isNativeToken) {
    if (chain.chain.symbol == "SXP") {
      if (data?.type === 6) {
        // transfer
        if (currentChainWallet?.toLowerCase() == data?.sender?.toLowerCase()) {
          //send
          direction = 1;
          address = data?.asset.transfers[0].recipientId;
          amount = formatDecimal(data?.amount ?? 0, 8);
        } else {
          // receive
          direction = 0;
          address = data?.sender;
          amount = formatDecimal(
            data?.asset?.transfers.find((element: any) => element?.recipientId?.toLowerCase() === currentChainWallet?.toLocaleLowerCase())?.amount ?? 0,
            8
          );
        }
        time = formatDate(data?.timestamp?.unix);
        url = solar_scan_path + "transaction/" + data?.id;
      } else if (data?.type === 2) {
        // vote
        direction = 2;
        address = data?.sender;
        time = formatDate(data?.timestamp?.unix);
        url = solar_scan_path + "transaction/" + data?.id;
        amount = formatDecimal(data?.fee ?? 0, 8);
      } else {
        direction = 0;
        address = "";
        time = formatDate(0);
        url = "";
        amount = formatDecimal(0);
      }
    } else if (chain.chain.symbol === "BTC") {
      if (data?.result >= 0) {
        direction = 0;
        if (Array.isArray(data?.inputs)) address = data?.inputs[0]?.prev_out?.addr ?? "";
        time = formatDate(data?.time);
        url = btc_scan_path + "tx/" + data?.hash;
        amount = formatDecimal(data?.result, 8);
      } else if (data?.result < 0) {
        direction = 1;
        if (Array.isArray(data?.out)) address = data?.out[0]?.addr ?? "";
        time = formatDate(data?.time);
        url = btc_scan_path + "tx/" + data?.hash;
        amount = formatDecimal(-data?.result, 8);
      }
    } else if (chain.chain.symbol === "SOL") {
      const amountSOL = data?.result?.meta?.postBalances[1] - data?.result?.meta?.preBalances[1];
      if (currentChainWallet === data?.result?.transaction.message.instructions[0].parsed.info.source) {
        direction = 1;
        address = data?.result?.transaction.message.instructions[0].parsed.info.destination;
      } else {
        direction = 0;
        address = data?.result?.transaction.message.instructions[0].parsed.info.source;
      }
      amount = formatDecimal(amountSOL ?? 0, 9);
      time = formatDate(data?.result?.blockTime);
      url = sol_scan_path + "tx/" + data?.result?.transaction.signatures[0];
    } else if (chain.chain.symbol == "ETH") {
      if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
        direction = 1;
        address = data?.to;
      } else {
        direction = 0;
        address = data?.from;
      }
      time = formatDate(data?.timeStamp);
      url = eth_scan_path + "tx/" + data?.hash;
      amount = formatDecimal(data?.value ?? 0, 18);
    } else if (chain.chain.symbol == "ARBETH") {
      if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
        direction = 1;
        address = data?.to;
      } else {
        direction = 0;
        address = data?.from;
      }
      time = formatDate(data?.timeStamp);
      url = arb_scan_path + "tx/" + data?.hash;
      amount = formatDecimal(data?.value ?? 0, 18);
    } else if (chain.chain.symbol == "AVAX") {
      if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
        direction = 1;
        address = data?.to;
      } else {
        direction = 0;
        address = data?.from;
      }
      if (net_name === "mainnet") {
        url = avax_scan_path + "tx/" + data?.txHash;
        time = data?.timeStamp;
        amount = formatDecimal(data?.amount ?? 0, 18);
      } else {
        time = data?.timestamp;
        url = avax_scan_path + "tx/" + data?.id;
        amount = formatDecimal(data?.value ?? 0, 18);
      }
    } else if (chain.chain.symbol == "BNB") {
      if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
        direction = 1;
        address = data?.to;
      } else {
        direction = 0;
        address = data?.from;
      }
      time = formatDate(data?.timeStamp);
      url = bsc_scan_path + "tx/" + data?.hash;
      amount = formatDecimal(data?.value ?? 0, 18);
    } else if (chain.chain.symbol == "OETH") {
      if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
        direction = 1;
        address = data?.to;
      } else {
        direction = 0;
        address = data?.from;
      }
      time = formatDate(data?.timeStamp);
      url = opt_scan_path + "tx/" + data?.hash;
      amount = formatDecimal(data?.value ?? 0, 18);
    } else if (chain.chain.symbol == "MATIC") {
      if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
        direction = 1;
        address = data?.to;
      } else {
        direction = 0;
        address = data?.from;
      }
      time = formatDate(data?.timeStamp);
      url = pol_scan_path + "tx/" + data?.hash;
      amount = formatDecimal(data?.value ?? 0, 18);
    }
  } else {
    chain.tokens.map((token) => {
      if (token.symbol == currentTokenSymbol) {
        logo = token.logo;
        symbol = token.displaySymbol;
        if (currentChainWallet?.toLowerCase() == data?.from?.toLowerCase()) {
          direction = 1;
          address = data?.to;
        } else {
          direction = 0;
          address = data?.from;
        }
        time = formatDate(data?.timeStamp);
        url = bsc_scan_path + "tx/" + data?.hash;
        amount = formatDecimal(data?.value ?? 0, 18);
      }
    });
  }

  return { direction, address, time, url, amount, logo, symbol };
};
export const getBalanceUrl = (chain: IChain): string => {
  if (chain.chain.symbol === "ETH") {
    return `${eth_api_url}?module=account&action=balance&address=${chain.chain.wallet}&tag=latest&apikey=${eth_api_key}`;
  }
  if (chain.chain.symbol === "ARBETH") {
    return `${arb_api_url}?module=account&action=balance&address=${chain.chain.wallet}&tag=latest&apikey=${arb_api_key}`;
  }
  if (chain.chain.symbol === "AVAX") {
    if (net_name === "mainnet") {
      return `${avax_api_url}/address/${chain.chain.wallet}/erc20-transfers?limit=25`;
    } else {
      return `${avax_api_url}/address/${chain.chain.wallet}/transactions?sort=desc&limit=10`;
    }
  }

  if (chain.chain.symbol === "BNB") {
    return `${bsc_api_url}?module=account&action=balance&address=${chain.chain.wallet}&apikey=${bsc_api_key}`;
  }
  if (chain.chain.symbol === "OETH") {
    return `${op_api_url}?module=account&action=balance&address=${chain.chain.wallet}&tag=latest&apikey=${op_api_key}`;
  }
  if (chain.chain.symbol === "MATIC") {
    return `${matic_api_url}?module=account&action=balance&address=${chain.chain.wallet}&apikey=${matic_api_key}`;
  }
};
export const getTransactionUrl = (walletAddress: string, chainName: string, page: number): string => {
  if (chainName === ChainNames.ETHEREUM) {
    return `${eth_api_url}?module=account&action=txlist&address=${walletAddress}&page=${page}&offset=15&sort=desc&apikey=${eth_api_key}`;
  }
  if (chainName === ChainNames.ARBITRUM) {
    return `${arb_api_url}?module=account&action=txlist&address=${walletAddress}&page=${page}&offset=15&sort=desc&apikey=${arb_api_key}`;
  }
  if (chainName === ChainNames.AVALANCHE) {
    if (net_name === "mainnet") {
      return `${avax_api_url}/address/${walletAddress}/erc20-transfers?limit=15`;
    } else {
      return `${avax_api_url}/address/${walletAddress}/transactions?sort=desc&limit=15`;
    }
  }
  if (chainName === ChainNames.BINANCE) {
    return `${bsc_api_url}?module=account&action=txlist&address=${walletAddress}&page=${page}&offset=15&sort=desc&apikey=${bsc_api_key}`;
  }
  if (chainName === ChainNames.OPTIMISM) {
    return `${op_api_url}?module=account&action=txlist&address=${walletAddress}&page=${page}&offset=15&sort=desc&apikey=${op_api_key}`;
  }
  if (chainName === ChainNames.POLYGON) {
    return `${matic_api_url}?module=account&action=txlist&address=${walletAddress}&page=${page}&offset=15&sort=desc&apikey=${matic_api_key}`;
  }
};

export const getRPCUrl = (currentTokenSymbol: string): string => {
  if (currentTokenSymbol === "ETH") {
    return eth_rpc_url;
  }
  if (currentTokenSymbol === "ARBETH") {
    return arb_rpc_url;
  }
  if (currentTokenSymbol === "AVAX") {
    return avax_rpc_url;
  }
  if (currentTokenSymbol === "BNB") {
    return bsc_rpc_url;
  }
  if (currentTokenSymbol === "OETH") {
    return op_rpc_url;
  }
  if (currentTokenSymbol === "MATIC") {
    return matic_rpc_url;
  }
};

export const getRPCUrlFromChainName = (chain: string): string => {
  if (chain === "ethereum") {
    return eth_rpc_url;
  }
  if (chain === "arbitrum") {
    return arb_rpc_url;
  }
  if (chain === "avalanche") {
    return avax_rpc_url;
  }

  if (chain === "binance") {
    return bsc_rpc_url;
  }
  if (chain === "optimism") {
    return op_rpc_url;
  }
  if (chain === "polygon") {
    return matic_rpc_url;
  }
};

export const getAPIAndKey = (chainName: string) => {
  let api_url,
    api_key = "";
  switch (chainName) {
    case ChainNames.BINANCE: {
      api_url = bsc_api_url;
      api_key = bsc_api_key;
      break;
    }
    case ChainNames.ETHEREUM: {
      api_url = eth_api_url;
      api_key = eth_api_key;
      break;
    }
    case ChainNames.POLYGON: {
      api_url = matic_api_url;
      api_key = matic_api_key;
      break;
    }
    case ChainNames.AVALANCHE: {
      api_url = avax_api_url;
      api_key = "";
      break;
    }
    case ChainNames.ARBITRUM: {
      api_url = arb_api_url;
      api_key = arb_api_key;
      break;
    }
    case ChainNames.OPTIMISM: {
      api_url = op_api_url;
      api_key = op_api_key;
      break;
    }
  }
  return { api_url, api_key };
};

export const getQueryParam = (chain: IChain) => {
  if (chain.currentToken == "" || chain.currentToken == "chain") {
    if (chain.chain.symbol === "ETH") {
      return { ids: "ethereum", vs_currencies: "usd" };
    }
    if (chain.chain.symbol === "ARBETH") {
      return { ids: "arbitrum", vs_currencies: "usd" };
    }
    if (chain.chain.symbol === "AVAX") {
      return { ids: "avalanche-2", vs_currencies: "usd" };
    }

    if (chain.chain.symbol === "BNB") {
      return { ids: "binancecoin", vs_currencies: "usd" };
    }
    if (chain.chain.symbol === "OETH") {
      return { ids: "optimism", vs_currencies: "usd" };
    }
    if (chain.chain.symbol === "MATIC") {
      return { ids: "matic-network", vs_currencies: "usd" };
    }
  } else {
    if (chain.currentToken == "WBNB.BNB") {
      return { ids: "wbnb", vs_currencies: "usd" };
    }
    if (chain.currentToken == "BUSD.BNB") {
      return { ids: "binance-usd", vs_currencies: "usd" };
    }
    if (chain.currentToken == "WMATIC.MATIC") {
      return { ids: "wmatic", vs_currencies: "usd" };
    }
    if (chain.currentToken == "WETH") {
      return { ids: "wrapped-ether-mantle-bridge", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDT") {
      return { ids: "tether", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDC") {
      return { ids: "usd-coin", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDC.MATIC") {
      return { ids: "matic-aave-usdc", vs_currencies: "usd" };
    }
    if (chain.currentToken == "WMATIC.MATIC") {
      return { ids: "wmatic", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDT.MATIC") {
      return { ids: "tether", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDC.AVAX") {
      return { ids: "usd-coin", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDT.ARBETH") {
      return { ids: "tether", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDC.ARBETH") {
      return { ids: "usd-coin", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDD.ARBETH") {
      return { ids: "usdd", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDC.OETH") {
      return { ids: "usd-coin", vs_currencies: "usd" };
    }
    if (chain.currentToken == "USDT.OETH") {
      return { ids: "tether", vs_currencies: "usd" };
    }
  }
};
