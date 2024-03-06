import dotenv from 'dotenv';
dotenv.config();

export enum NFT_CONTRACT {
    OUTCAST = "0x73682A7f47Cb707C52cb38192dBB9266D3220315",
    MORPHEUS = "0x670971dCB8e1a510253511427593007e074954b7",
    PODCATS = "0xAD568130193F4672EA3B95E757C0B23285BEf945",
}

export enum COLLECTION_LINK {
    OUTCAST = "https://highlight.xyz/mint/65c36ebc54235eefb1ccb906",
    MORPHEUS = "https://opensea.io/collection/morpheus-pfp",
    PODCATS = "https://highlight.xyz/mint/65e2062678c1914e513310ce",
}

export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY ? process.env.NEYNAR_API_KEY : '';
export const FROG_SECRET = process.env.FROG_SECRET ? process.env.FROG_SECRET : '';
export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ? process.env.ALCHEMY_API_KEY : '';