import {delay, shuffleArray} from '@/composables/utils.js'

const min_delay = 1000 // min_delay before doing request on same endpoint

let endpoints = shuffleArray([
  {url: 'https://testnet-lightapi.eosams.xeos.me/api/', lastusage: 0},
])

const safeFetchLightApi = async(req) => {
  endpoints.sort((a, b) => a.lastusage - b.lastusage)
  const now = Date.now()

  if(now - endpoints[0].lastusage < min_delay)
    await delay(min_delay - now + endpoints[0].lastusage)

  let ret = null
  const { data, pending, error, refresh } = await useFetch(endpoints[0].url + req, {
    onResponse({ request, response, options }) {
      endpoints[0].lastusage = now
      ret = response._data
    },
    async onRequestError({ request, options, error }) {
      console.warn('Request error', error)
      console.info('Retry with another endpoint')
      endpoints[0].lastusage = now
      
    },
    async onResponseError({ request, response, options }) {
      console.warn('Response error')
      console.info('Retry with another endpoint')
      endpoints[0].lastusage = now
    }
  })

  if(ret !== null)
    return ret;
  else
    return await safeFetchLightApi(req)
}
export const getBalances = async(wallet) => {
  const req = 'balances/waxtest/'+wallet
  
  const balances = await safeFetchLightApi(req)
  return balances  
}