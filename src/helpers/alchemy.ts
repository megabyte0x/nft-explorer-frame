import { NFTS } from './types';
import { NFT_CONTRACT } from './constants';

const options = { method: 'GET', headers: { accept: 'application/json' } };
const API_KEY: string = process.env.ALCHEMY_API_KEY ? process.env.ALCHEMY_API_KEY : '';

async function getNFTs(user_address: string, button_value: string): Promise<NFTS> {
    let contract_address: string;
    let response;
    let nfts: NFTS;
    let filtered_response: string[] = [];

    switch (button_value) {
        case 'outcast':
            contract_address = NFT_CONTRACT.OUTCAST;
            break;
        case 'morpheus':
            contract_address = NFT_CONTRACT.MORPHEUS;
            break;
        case 'podcats':
            contract_address = NFT_CONTRACT.PODCATS;
            break;
        default:
            throw new Error('Invalid button value');
    }

    try {
        response = await fetch(`https://base-mainnet.g.alchemy.com/nft/v3/${API_KEY}/getNFTsForOwner?owner=${user_address}&contractAddresses[]=${contract_address}&withMetadata=true&pageSize=100`, options);
        response = await response.json();

    } catch (error) {
        console.error('Error:', error);
    }

    if (response != undefined) {
        if (response.totalCount === 0) {
            nfts = {
                sucess: false,
                total_count: 0,
                nfts: []
            }
        } else if (response.totalCount === 1) {
            filtered_response.push(response.ownedNfts[0].image.cachedUrl);
            nfts = {
                sucess: true,
                total_count: 1,
                nfts: filtered_response
            }
        } else {
            for (let i = 0; i < response.totalCount; i++) {
                filtered_response.push(response.ownedNfts[i].image.cachedUrl);
            }

            nfts = {
                sucess: true,
                total_count: response.totalCount,
                nfts: filtered_response
            }
        }
    } else {
        nfts = {
            sucess: false,
            total_count: 0,
            nfts: []
        }
    }
    return nfts;
}

export { getNFTs }