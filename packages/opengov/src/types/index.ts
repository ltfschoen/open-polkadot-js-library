type SubscanAccountsPayload = {
  "row": number,
  "order": string,
  "page": number,
}

type SubscanDemocracyPayload = {
  "account": string,
  "order": string,
  "page": number,
  "referendum_index": number | null,
  "row": number,
  "sort": string | null,
  "status": string | null,
  "valid": string
}

type AddressVotes = {
  address: string | null,
  name: string,
  voteCount: number | null,
}

type AddressVotesDataObj = {
  "data": AddressVotes[]
}

type AnyPayload = SubscanAccountsPayload | SubscanDemocracyPayload;

export type {
  AddressVotes,
  AddressVotesDataObj,
  AnyPayload,
  SubscanAccountsPayload,
  SubscanDemocracyPayload,
}

