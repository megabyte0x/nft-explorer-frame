import { Button, Frog } from 'frog'
import { neynar as neynarHub } from 'frog/hubs'
import { type NeynarVariables, neynar } from "frog/middlewares";
import { getData } from './helpers'
import { DATA, EVM_ADDRESSES, State } from './helpers/types'
import { handle } from 'frog/vercel'
import { NEYNAR_API_KEY, FROG_SECRET } from './helpers/constants';

export const app = new Frog<{ State: State, Variables: NeynarVariables }>({
  basePath: '/nft-explorer',
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
  hub: neynarHub({
    apiKey:
      NEYNAR_API_KEY
  })
})

app.use(
  neynar({
    apiKey:
      NEYNAR_API_KEY, features: ['interactor']
  })
);

app.frame('/', async (c) => {
  return c.res({
    image: 'https://i.ibb.co/RNs4mwV/1.png',
    intents: [
      <Button value="outcast" action='/collection/outcast'>Outcast</Button>,
      <Button value="morpheus" action='/collection/morpheus'>Morpheus</Button>,
      <Button value="podcats" action='/collection/podcats'>Podcats</Button>
    ],
  })
})

app.frame('/collection/:collection_name', async (c) => {
  const { buttonValue, deriveState, status } = c;
  const { interactor } = c.var;
  let evm_addresses: EVM_ADDRESSES;
  let data: DATA = c.previousState.data;
  const { collection_name } = c.req.param();
  console.log("BUtoon value", buttonValue)
  if (status == 'response' && (buttonValue === 'outcast' || buttonValue === 'morpheus' || buttonValue === 'podcats')) {
    if (interactor) {
      evm_addresses = interactor.verifiedAddresses.ethAddresses;
      // data = await getData(collection_name, ['0xF005Bc919B57DC1a95070A614C0d51A2897d11ff']);
      data = await getData(collection_name, evm_addresses);
      console.log("The data is", data)
    } else {
      data = {
        sucess: false,
        total_count: 0,
        nfts: [],
        collection_link: ''
      }
    }
    deriveState(previousState => {
      previousState.data = data;
      console.log("The previous state is", previousState.data)
    });
  }

  if (data && data.sucess) {
    const state = deriveState(previousState => {
      if (buttonValue === 'next') previousState.count++
      if (buttonValue === 'previous') previousState.count--
    })
    console.log(state.count)
    const collection_link = data.collection_link;
    if (data.total_count == 0) {
      return c.res({
        image: 'https://i.ibb.co/88L205q/2.png',
        intents: [
          <Button.Link href
            ={collection_link}> Check Collection</Button.Link>,
          <Button.Reset>Reset</Button.Reset>
        ]
      })
    }
    else if (data.total_count == 1) {
      return c.res({
        image: data.nfts[state.count],
        imageAspectRatio: '1:1',
        intents: [
          <Button.Reset>Reset</Button.Reset>,
          state.count == data.total_count - 1 ? <Button.Link href
            ={collection_link} > Check Collection</Button.Link > : <Button value="next">Next</Button>,
        ]
      })
    } else {
      return c.res({
        image: data.nfts[state.count],
        imageAspectRatio: '1:1',
        intents: [
          <Button value="previous">Previous</Button>,
          <Button.Reset>Reset</Button.Reset>,
          state.count == data.total_count - 1 ? <Button.Link href
            ={collection_link} > Check Collection</Button.Link > : <Button value="next">Next</Button>,
        ]
      })
    }
  } else {
    return c.res({
      image: 'https://i.ibb.co/V2qQ3qN/3.png',
      intents: [
        <Button.Reset>Reset</Button.Reset>
      ]
    })
  }
});

export const GET = handle(app)
export const POST = handle(app)