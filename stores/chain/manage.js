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
			})
  	},
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

				console.log(actions)
			return actions;
  	}
  }
})