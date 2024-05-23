import { getBalances as lightApiGetBalances } from '@/composables/useLightApi.js';

import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js';

export const useBalancesStore = defineStore('balances', {
  state: () => ({
  	balances: []
  }),
  actions: {
		async getBalances() {
			const chainStore = useChainStore();
			const resp = await lightApiGetBalances(chainStore.getCurrentSession().actor.toString());
			this.balances = resp.balances;
		}
  },
  getters: {
  	getBalance: () => (i) => {
  		const thisStore = useBalancesStore()
  		return thisStore.balances[i]
  	}
  }
})