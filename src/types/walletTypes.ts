import solarIcon from "../assets/chains/solar.svg";
import ethereumIcon from "../assets/chains/ethereum.svg";
import solanaIcon from "../assets/chains/solana.svg";
import avalancheIcon from "../assets/chains/avalanche.svg";
import optimismIcon from "../assets/chains/optimism.svg";
import binanceIcon from "../assets/chains/binance.svg";
import bitcoinIcon from "../assets/chains/bitcoin.svg";
import polygonIcon from "../assets/chains/polygon.svg";
import arbitrumoneIcon from "../assets/chains/arbitrum.svg";
import transactionInIcon from "../assets/wallet/trans-in-icon.svg";
import transactionOutIcon from "../assets/wallet/trans-out-icon.svg";
import transactionSwtichIcon from "../assets/wallet/vote-icon.svg";

export enum chainEnum {
  "solar",
  "ethereum",
  "solana",
  "avalanche",
  "optimism",
  "binance",
  "bitcoin",
  "polygon",
  "arbitrumone",
}

export const chainIconMap: Map<number, string> = new Map([
  [chainEnum.solar, solarIcon],
  [chainEnum.ethereum, ethereumIcon],
  [chainEnum.solana, solanaIcon],
  [chainEnum.avalanche, avalancheIcon],
  [chainEnum.optimism, optimismIcon],
  [chainEnum.binance, binanceIcon],
  [chainEnum.bitcoin, bitcoinIcon],
  [chainEnum.polygon, polygonIcon],
  [chainEnum.arbitrumone, arbitrumoneIcon],
]);

export enum transactionEnum {
  "in",
  "out",
  "switch",
}

export enum transStatusEnum {
  "saved",
  "pending",
  "failed",
  "done",
}

export const transactionIconMap: Map<number, string> = new Map([
  [transactionEnum.in, transactionInIcon],
  [transactionEnum.out, transactionOutIcon],
  [transactionEnum.switch, transactionSwtichIcon],
]);

export interface transactionType {
  mode: transactionEnum;
  address: string;
  time: Date;
  chain: chainEnum;
  symbol: string;
  amount: number;
  usd: number;
  status: transStatusEnum;
}

export interface IGetTokenBalanceRes {
  cmc: string;
  balance: number;
}

export interface IChain {
  chain: INative;
  tokens: IToken[];
  currentToken: string;
}

export interface ISupportChains {
  Arbitrum: ISupportChain;
  Avalanche: ISupportChain;
  Bitcoin: ISupportChain;
  Binance: ISupportChain;
  Ethereum: ISupportChain;
  Optimism: ISupportChain;
  Polygon: ISupportChain;
  Solana: ISupportChain;
  Solar: ISupportChain;
}

export interface ISupportChain {
  chain: ISupportNative;
  tokens: ISupportToken[];
}

export interface ISupportNative {
  address: string;
  symbol: string;
  name: string;
  key: string;
  decimals: Number;
  logo: string;
  website: string;
  chainId: Number;
  cmc: string;
}

export interface ISupportToken {
  address: string;
  decimals: Number;
  displaySymbol: string;
  logo: string;
  name: string;
  symbol: string;
  website: string;
  cmc: string;
}

export interface INative {
  address: string;
  symbol: string;
  name: string;
  key: string;
  decimals: Number;
  logo: string;
  website: string;
  chainId: Number;
  wallet: string;
  balance: Number;
  price: Number;
  cmc: string;
}

export interface IToken {
  address: string;
  decimals: Number;
  displaySymbol: string;
  logo: string;
  name: string;
  symbol: string;
  website: string;
  balance: Number;
  price: Number;
  cmc: string;
}

// export interface multiWalletType {
//   Arbitrum: IChain;
//   Avalanche: IChain;
//   Bitcoin: IChain;
//   Binance: IChain;
//   Ethereum: IChain;
//   Optimism: IChain;
//   Polygon: IChain;
//   Solana: IChain;
//   Solar: IChain;
// }

export interface IWallet {
  arbitrum: string;
  avalanche: string;
  bitcoin: string;
  binance: string;
  ethereum: string;
  optimism: string;
  polygon: string;
  solana: string;
  solar: string;
}

export interface IWalletList {
  list: IWallet[];
}

export interface qrModalType {
  data: IChain;
  open: boolean;
  setOpen: (status: boolean) => void;
}

export interface ID53Password {
  password: string;
}

// export interface ICurrency {
//   data: { [key: string]: Number };
// }

export interface ISupportCurrency {
  name: string;
  icon: string;
  symbol: string;
}

export interface ICurrency {
  name: string;
  reserve: number;
}

export interface ICurrencyList {
  list: ICurrency[];
}

export interface IVotingData {
  [key: string]: number;
}

export interface ICurrentChain {
  chain: string;
}

export interface ICurrentToken {
  token: string;
}

export interface ICurrentCurrency {
  currency: string;
}

export interface IBalanceList {
  list: IBalance[];
}

export interface IBalance {
  symbol: string;
  balance: number;
}

export interface IPrice {
  cmc: string;
  price: number;
}

export interface IPriceList {
  list: IPrice[];
}

export interface IParamsFetchChainBalance {
  walletStore: IWallet;
  chainName: string;
}

export interface ITransactionList {
  list: any[];
}
