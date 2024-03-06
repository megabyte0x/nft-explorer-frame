import { EVM_ADDRESSES } from "./types";

const options = {
    method: 'GET',
    headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' }
};

async function getEVMAddresses(fid: number): Promise<EVM_ADDRESSES> {
    let response;
    let evm_address: EVM_ADDRESSES;
    let filtered_response: string[] = [];


    try {
        response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, options);
        response = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }

    if (response != undefined) {
        let eth_address_count: number = response.users[0].verified_addresses.eth_addresses.length;
        if (eth_address_count === 0) {
            evm_address = {
                sucess: false,
                total_count: 0,
                addresses: []
            }
        } else if (eth_address_count === 1) {
            filtered_response.push(response.users[0].verified_addresses.eth_addresses[0]);
            evm_address = {
                sucess: true,
                total_count: 1,
                addresses: filtered_response
            }
        } else {
            for (let i = 0; i < eth_address_count; i++) {
                filtered_response.push(response.users[0].verified_addresses.eth_addresses[i]);
            }

            evm_address = {
                sucess: true,
                total_count: eth_address_count,
                addresses: filtered_response
            }
        }
    } else {
        evm_address = {
            sucess: false,
            total_count: 0,
            addresses: []
        }
    }
    return evm_address;
}

export { getEVMAddresses };