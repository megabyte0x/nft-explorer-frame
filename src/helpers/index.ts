import { getNFTs } from "./alchemy";
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

async function getData(collection_name: string, evm_address: EVM_ADDRESSES): Promise<DATA> {
    let nfts_response: NFTS;
    let data: DATA;
    let totalCount: number = 0;
    const totalEVMAddresses: number = evm_address.length;
    const nfts: string[] = [];
    const collection_link: string = getCollectionLink(collection_name);
    let status: boolean = false;


    if (totalEVMAddresses > 0) {
        // if there's a single address
        if (totalEVMAddresses === 1) {
            nfts_response = await getNFTs(evm_address[0], collection_name);
            if (nfts_response.sucess) {
                if (nfts_response.total_count === 0) {
                    totalCount = 0;
                    status = true;
                } else if (nfts_response.total_count === 1) {
                    totalCount++;
                    nfts.push(nfts_response.nfts[0]);
                } else if (nfts_response.total_count > 1) {
                    for (let i = 0; i < nfts_response.total_count; i++) {
                        totalCount++;
                        nfts.push(nfts_response.nfts[i]);
                    }
                }
                status = true;
            }
        } else {
            for (let i = 0; i < totalEVMAddresses; i++) {
                nfts_response = await getNFTs(evm_address[i], collection_name);
                if (nfts_response.sucess) {
                    if (nfts_response.total_count === 0) {
                        totalCount = 0;
                        status = true;
                    } else if (nfts_response.total_count === 1) {
                        totalCount++;
                        nfts.push(nfts_response.nfts[0]);
                    } else if (nfts_response.total_count > 1) {
                        for (let j = 0; j < nfts_response.total_count; j++) {
                            totalCount++;
                            nfts.push(nfts_response.nfts[j]);
                        }
                    }
                    status = true;
                }
            }
        }
        data = {
            sucess: status,
            total_count: totalCount,
            nfts: nfts,
            collection_link: collection_link
        }
    } else {
        data = {
            sucess: status,
            total_count: 0,
            nfts: [],
            collection_link: collection_link
        }
    }
    return data;
}

export { getData };