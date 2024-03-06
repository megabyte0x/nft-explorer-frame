import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog } from 'frog'
import { neynar } from 'frog/hubs'
import { getData } from './helpers'
import { DATA, State } from './helpers/types'
import { handle } from 'frog/vercel'


export const app = new Frog<State>({
  basePath: '/nft-explorer',
  initialState: {
    count: 0,
    nfts: []
  },
  secret: process.env.FROG_SECRET,
  // hubApiUrl: 'https://api.hub.wevm.dev'
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ? process.env.NEYNAR_API_KEY : '' })
})
let data: DATA;

app.use('/*', serveStatic({ root: './public' }))

app.frame('/', async (c) => {

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Explore your favourite NFTs
        </div>
      </div>
    ),
    intents: [
      <Button value="outcast" action='/collection/outcast'>Outcast</Button>,
      <Button value="morpheus" action='/collection/morpheus'>Morpheus</Button>,
      <Button value="podcats" action='/collection/podcats'>Podcats</Button>
    ],
  })
})

app.frame('/collection/:collection_name', async (c) => {
  const { frameData, buttonValue, deriveState } = c
  const { collection_name } = c.req.param();

  if (frameData) {
    const { fid } = frameData;
    data = await getData(collection_name, fid);
  } else {
    data = {
      sucess: false,
      total_count: 0,
      nfts: [],
      collection_link: ''
    }
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
        image: (
          <div
            style={{
              alignItems: 'center',
              background:
                'black',
              backgroundSize: '100% 100%',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              height: '100%',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: 60,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1.4,
                marginTop: 30,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
              }}
            >
              You don't own any NFTs from this collection
            </div>
          </div>
        ),
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
      image: (
        <div>
          An error occured, please report to @megabyte
        </div>
      ),
      intents: [
        <Button.Reset>Reset</Button.Reset>
      ]
    })
  }
});

export const GET = handle(app)
export const POST = handle(app)
