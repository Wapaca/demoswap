import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js';
import { useManageStore } from '~/stores/manage.js';

import app_config from '~/config.js';

export const useChainManageStore = defineStore('chainManage', {
  state: () => ({

  }),
  actions: {
		async updateConfig(config) {
			const chainStore = useChainStore();
			const manageStore = useManageStore();

			chainStore.transact({
				actor: chainStore.getCurrentSession().actor.toString(),
				actions: this.getConfigActions(config),
				updateAction: () => manageStore.fetchConfig(),
				updateDelay: 4000,
			})
  	},
  	async createPair(balA, balB) {
  		const chainStore = useChainStore();
  		const manageStore = useManageStore();

  		chainStore.transact({
				actor: chainStore.getCurrentSession().actor.toString(),
				actions: this.getCreatePairActions(balA, balB),
				updateAction: () => manageStore.fetchPairs(),
				updateDelay: 4000,
			})
  	}
  },
  getters: {
  	getConfigActions: () => (config) => {
  		const chainStore = useChainStore();
			const actions = [];

			for(const name of Object.keys(config)) {
				if(config[name].value === '')
					continue;

				actions.push({
					account: app_config.swap_contract,
					name: config[name].action,
					authorization: [chainStore.getCurrentSession().permissionLevel],
					data: {
						key: name,
						value: config[name].value
					}
				})
			}

			return actions;
  	},
  	getCreatePairActions: () => (balA, balB) => {
  		const chainStore = useChainStore();

  		return [{
  			account: app_config.swap_contract,
  			name: 'createpair',
  			authorization: [chainStore.getCurrentSession().permissionLevel],
  			data: {
  				creator: chainStore.getCurrentSession().actor.toString(),
  				token0: {contract: balA.contract, sym: balA.decimals+','+balA.currency},
  				token1: {contract: balB.contract, sym: balB.decimals+','+balB.currency}
  			}
  		}]
  	}
  }
})