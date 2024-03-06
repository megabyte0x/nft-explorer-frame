type NFTS = {
    sucess: boolean,
    total_count: number,
    nfts: string[]
}

type NFT_RESPONSE = {
    totalCount: number,
    ownedNfts: {
        image: {
            pngUrl: string
        }
    }[]
}

type EVM_ADDRESSES = {
    sucess: boolean,
    total_count: number,
    addresses: string[]
}

type DATA = {
    sucess: boolean,
    total_count: number,
    nfts: string[],
    collection_link: string
}

type State = {
    count: number,
    nfts: string[]
}

export type { NFTS, NFT_RESPONSE, EVM_ADDRESSES, State, DATA }
