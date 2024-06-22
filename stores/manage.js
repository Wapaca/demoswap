import { defineStore } from 'pinia'
import { fetchTable } from '~/composables/useRpc.js';
import { useChainManageStore } from '~/stores/chain/manage.js'

import config from '~/config.js';

export const useManageStore = defineStore('manage', {
  state: () => ({
    config: {},
    pairs: [],
    selected_operation: null,
    selected_pair: null,
  }),
  actions: {
  	async fetchConfig() {
  		const configs = await fetchTable(config.swap_contract, config.swap_contract, 'configs', true);
  		for(const config of configs)
        this.config[config.key] = config.value
  	},
    async fetchPairs() {
      const pairs = await fetchTable(config.swap_contract, config.swap_contract, 'pairs')
      this.pairs = pairs
    },
  	async updateConfig(event) {
  		const config = {}
  		for(const input of event.target) {
  			if(input.getAttribute('data-action') === null)
  				continue;

  			config[input.name] = {
  				action: input.getAttribute('data-action'),
  				type: input.type,
  				value: input.value
  			}
  		}

  		const chainManageStore = useChainManageStore()
  		await chainManageStore.updateConfig(config)
  	},
    selectLiquidityPair(operation, pair_code) {
      this.selected_operation = operation
      this.selected_pair = pair_code
    }
  },
  getters: {
    getSelectedPair: () => () => {
      const thisStore = useManageStore();
      return thisStore.pairs.find(p => p.code === thisStore.selected_pair)
    }
  }
})