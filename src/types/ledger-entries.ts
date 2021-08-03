export type LedgerIndex = number | ("validated" | "closed" | "current");

export type AccountObjectType =
  | "check"
  | "escrow"
  | "offer"
  | "payment_channel"
  | "signer_list"
  | "state";

export interface XRP {
  currency: "XRP";
}

export interface IssuedCurrency {
  currency: string;
  issuer: string;
}

export type Currency = IssuedCurrency | XRP;

export interface IssuedCurrencyAmount extends IssuedCurrency {
  value: string;
}

export type Amount = IssuedCurrencyAmount | string;

export interface AccountRoot {
  LedgerEntryType: "AccountRoot";
  Account: string;
  Balance: string;
  Flags: number;
  OwnerCount: number;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  Sequence: number;
  AccountTxnID?: string;
  Domain?: string;
  EmailHash?: string;
  MessageKey?: string;
  RegularKey?: string;
  TicketCount?: number;
  TickSize?: number;
  TransferRate?: number;
}

interface Majority {
  Majority: {
    Amendment: string;
    CloseTime: number;
  };
}

export interface Amendments {
  LedgerEntryType: "Amendments";
  Amendments?: string[];
  Majorities?: Majority[];
  Flags: 0;
}

export interface Check {
  LedgerEntryType: "Check";
  Account: string;
  Destination: string;
  Flags: 0;
  OwnerNode: string;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  SendMax: Amount;
  Sequence: number;
  DestinationNode?: string;
  DestinationTag?: number;
  Expiration?: number;
  InvoiceID?: string;
  SourceTag?: number;
}

export interface DepositPreauth {
  LedgerEntryType: "DepositPreauth";
  Account: string;
  Authorize: string;
  Flags: 0;
  OwnerNode: string;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
}

export interface DirectoryNode {
  LedgerEntryType: "DirectoryNode";
  Flags: number;
  RootIndex: string;
  Indexes: string[];
  IndexNext?: number;
  IndexPrevious?: number;
  Owner?: string;
  TakerPaysCurrency?: string;
  TakerPaysIssuer?: string;
  TakerGetsCurrency?: string;
  TakerGetsIssuer?: string;
}

export interface Escrow {
  LedgerEntryType: "Escrow";
  Account: string;
  Destination: string;
  Amount: string;
  Condition?: string;
  CancelAfter?: number;
  FinishAfter?: number;
  Flags: number;
  SourceTag?: number;
  DestinationTag?: number;
  OwnerNode: string;
  DestinationNode?: string;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
}

export interface FeeSettings {
  LedgerEntryType: "FeeSettings";
  BaseFee: string;
  ReferenceFeeUnits: number;
  ReserveBase: number;
  ReserveIncrement: number;
  Flags: number;
}

export interface LedgerHashes {
  LedgerEntryType: "LedgerHashes";
  LastLedgerSequence?: number;
  Hashes: string[];
  Flags: number;
}

interface DisabledValidator {
  FirstLedgerSequence: number;
  PublicKey: string;
}

export interface NegativeUNL {
  LedgerEntryType: "NegativeUNL";
  DisabledValidators?: DisabledValidator[];
  ValidatorToDisable?: string;
  ValidatorToReEnable?: string;
}

export interface Offer {
  LedgerEntryType: "Offer";
  Flags: number;
  Account: string;
  Sequence: number;
  TakerPays: Amount;
  TakerGets: Amount;
  BookDirectory: string;
  BookNode: string;
  OwnerNode: string;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  Expiration?: number;
}

export interface PayChannel {
  LedgerEntryType: "PayChannel";
  Account: string;
  Destination: string;
  Amount: string;
  Balance: string;
  PublicKey: string;
  SettleDelay: number;
  OwnerNode: string;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  Flags: number;
  Expiration?: number;
  CancelAfter?: number;
  SourceTag?: number;
  DestinationTag?: number;
  index: string;
}

export interface RippleState {
  LedgerEntryType: "RippleState";
  Flags: number;
  Balance: Amount;
  LowLimit: Amount;
  HighLimit: Amount;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  LowNode?: string;
  HighNode?: string;
  LowQualityIn?: number;
  LowQualityOut?: number;
  HighQualityIn?: number;
  HighQualityOut?: number;
}

interface SignerEntry {
  SignerEntry: {
    Account: string;
    SignerWeight: number;
  };
}

export interface SignerList {
  LedgerEntryType: "SignerList";
  Flags: number;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  OwnerNode: string;
  SignerEntries: SignerEntry[];
  SignerListID: number;
  SignerQuorum: number;
}

export interface Ticket {
  LedgerEntryType: "Ticket";
  Account: string;
  Flags: number;
  OwnerNode: string;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  TicketSequence: number;
}

export type XrpLedgerEntry =
  | AccountRoot
  | Amendments
  | Check
  | DepositPreauth
  | DirectoryNode
  | Escrow
  | FeeSettings
  | LedgerHashes
  | NegativeUNL
  | Offer
  | PayChannel
  | RippleState
  | SignerList
  | Ticket;
