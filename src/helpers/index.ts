import { getNFTs } from "./alchemy";
import { getEVMAddresses } from "./neyar";
import { EVM_ADDRESSES, NFTS, DATA } from "./types";
import { COLLECTION_LINK } from "./constants";

function getCollectionLink(collection_name: string): string {
    let link: string;
    switch (collection_name) {
        case "outcast":
            link = COLLECTION_LINK.OUTCAST;
            break;
        case "morpheus":
            link = COLLECTION_LINK.MORPHEUS;
            break;
        case "podcats":
            link = COLLECTION_LINK.PODCATS;
            break;
        default:
            throw new Error('Invalid collection name');
    }
    return link;
}

async function getData(collection_name: string, fid: number): Promise<DATA> {
    let evm_address: EVM_ADDRESSES;
    let nfts_response: NFTS;
    let data: DATA;
    let totalCount: number = 0;
    const nfts: string[] = [];
    const collection_link: string = getCollectionLink(collection_name);

    evm_address = await getEVMAddresses(fid);

    if (evm_address.sucess) {
        // if there's a single address
        if (evm_address.total_count === 1) {
            nfts_response = await getNFTs(evm_address.addresses[0], collection_name);
            if (nfts_response.sucess) {
                // if there's a single nft
                if (nfts_response.total_count === 1) {
                    totalCount++;
                    nfts.push(nfts_response.nfts[0]);
                } else if (nfts_response.total_count > 1) {
                    for (let i = 0; i < nfts_response.total_count; i++) {
                        totalCount++;
                        nfts.push(nfts_response.nfts[i]);
                    }
                }
            }
        } else {
            for (let i = 0; i < evm_address.total_count; i++) {
                nfts_response = await getNFTs(evm_address.addresses[i], collection_name);
                if (nfts_response.sucess) {
                    // if there's a single nft
                    if (nfts_response.total_count === 1) {
                        totalCount++;
                        nfts.push(nfts_response.nfts[0]);
                    } else if (nfts_response.total_count > 1) {
                        for (let j = 0; j < nfts_response.total_count; j++) {
                            totalCount++;
                            nfts.push(nfts_response.nfts[j]);
                        }
                    }
                }
            }
        }
        data = {
            sucess: true,
            total_count: totalCount,
            nfts: nfts,
            collection_link: collection_link
        }
    } else {
        data = {
            sucess: false,
            total_count: 0,
            nfts: [],
            collection_link: collection_link
        }
    }
    return data;
}

export { getData };