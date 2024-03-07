import { jsx as _jsx } from "frog/jsx/jsx-runtime";
import { Button, Frog } from 'frog';
import { neynar } from "frog/middlewares";
import { getData } from './helpers';
import { NEYNAR_API_KEY, FROG_SECRET } from './helpers/constants';
export const app = new Frog({
    assetsPath: '/',
    basePath: '/api',
    headers: {
        'Cache-Control': 'max-age=0'
    },
    initialState: {
        count: 0,
        data: {
            sucess: false,
            total_count: 0,
            nfts: [],
            collection_link: ''
        }
    },
    secret: FROG_SECRET,
    hub: {
        apiUrl: "https://hubs.airstack.xyz",
        fetchOptions: {
            headers: {
                "x-airstack-hubs": "1d3e639d822ec46c5be101be9d8699f46",
            }
        }
    }
});
app.use(neynar({
    apiKey: NEYNAR_API_KEY, features: ['interactor']
}));
app.frame('/', (c) => {
    return c.res({
        image: 'https://i.ibb.co/RNs4mwV/1.png',
        intents: [
            _jsx(Button, { value: "outcast", action: '/collection/outcast', children: "Outcast" }),
            _jsx(Button, { value: "morpheus", action: '/collection/morpheus', children: "Morpheus" }),
            _jsx(Button, { value: "podcats", action: '/collection/podcats', children: "Podcats" })
        ],
    });
});
app.frame('/collection/:collection_name', async (c) => {
    const { buttonValue, deriveState, status } = c;
    const { interactor } = c.var;
    let evm_addresses;
    let data = c.previousState.data;
    const { collection_name } = c.req.param();
    console.log("BUtoon value", buttonValue);
    if (status == 'response' && (buttonValue === 'outcast' || buttonValue === 'morpheus' || buttonValue === 'podcats')) {
        if (interactor) {
            evm_addresses = interactor.verifiedAddresses.ethAddresses;
            // data = await getData(collection_name, ['0xF005Bc919B57DC1a95070A614C0d51A2897d11ff']);
            data = await getData(collection_name, evm_addresses);
            console.log("The data is", data);
        }
        else {
            data = {
                sucess: false,
                total_count: 0,
                nfts: [],
                collection_link: ''
            };
        }
        deriveState(previousState => {
            previousState.data = data;
            console.log("The previous state is", previousState.data);
        });
    }
    if (data && data.sucess) {
        const state = deriveState(previousState => {
            if (buttonValue === 'next')
                previousState.count++;
            if (buttonValue === 'previous')
                previousState.count--;
        });
        console.log(state.count);
        const collection_link = data.collection_link;
        if (data.total_count == 0) {
            return c.res({
                image: 'https://i.ibb.co/88L205q/2.png',
                intents: [
                    _jsx(Button.Link, { href: collection_link, children: " Check Collection" }),
                    // @ts-ignore
                    _jsx(Button.Reset, { children: "Reset" })
                ]
            });
        }
        else if (data.total_count == 1) {
            return c.res({
                image: data.nfts[state.count],
                imageAspectRatio: '1:1',
                intents: [
                    // @ts-ignore
                    _jsx(Button.Reset, { children: "Reset" }),
                    state.count == data.total_count - 1 ? _jsx(Button.Link, { href: collection_link, children: " Check Collection" }) : _jsx(Button, { value: "next", children: "Next" }),
                ]
            });
        }
        else {
            return c.res({
                image: data.nfts[state.count],
                imageAspectRatio: '1:1',
                intents: [
                    _jsx(Button, { value: "previous", children: "Previous" }),
                    // @ts-ignore
                    _jsx(Button.Reset, { children: "Reset" }),
                    state.count == data.total_count - 1 ? _jsx(Button.Link, { href: collection_link, children: " Check Collection" }) : _jsx(Button, { value: "next", children: "Next" }),
                ]
            });
        }
    }
    else {
        return c.res({
            image: 'https://i.ibb.co/V2qQ3qN/3.png',
            intents: [
                // @ts-ignore
                _jsx(Button.Reset, { children: "Reset" })
            ]
        });
    }
});
export default app;
