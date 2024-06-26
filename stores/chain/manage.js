import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js';
import { useManageStore } from '~/stores/manage.js';
import { precise } from '~/composables/utils.js';

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
  	},
  	async deletePair(pair_code) {
  		const chainStore = useChainStore();
  		const manageStore = useManageStore();

  		chainStore.transact({
				actor: chainStore.getCurrentSession().actor.toString(),
				actions: this.getDeletePairActions(pair_code),
				updateAction: () => manageStore.fetchPairs(),
				updateDelay: 4000,
			})
  	},
  	async addLiquidity(pair, token0_amount, token1_amount) {
  		const chainStore = useChainStore();
  		const manageStore = useManageStore();

  		chainStore.transact({
				actor: chainStore.getCurrentSession().actor.toString(),
				actions: this.getAddLiquidityActions(pair, token0_amount, token1_amount),
				updateAction: () => manageStore.fetchPairs(),
				updateDelay: 4000,
			})
  	},
  	async removeLiquidity(pair, lptoken_amount) {
  		const chainStore = useChainStore();
  		const manageStore = useManageStore();

  		chainStore.transact({
				actor: chainStore.getCurrentSession().actor.toString(),
				actions: this.getRemoveLiquidityActions(pair, lptoken_amount),
				updateAction: () => manageStore.fetchPairs(),
				updateDelay: 4000,
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
  	},
  	getDeletePairActions: () => (pair_code) => {
  		const chainStore = useChainStore();

  		return [{
  			account: app_config.swap_contract,
  			name: 'removepair',
  			authorization: [chainStore.getCurrentSession().permissionLevel],
  			data: {
  				code: pair_code
  			}
  		}]
  	},
  	getAddLiquidityActions: () => (pair, token0_amount, token1_amount) => {
  		console.log(pair, token0_amount, token1_amount)
  		const chainStore = useChainStore();

  		return [{
  			account: pair.reserve0.contract,
  			name: 'transfer',
  			authorization: [chainStore.getCurrentSession().permissionLevel],
  			data: {
  				from: chainStore.getCurrentSession().actor.toString(),
  				to: app_config.swap_contract,
  				quantity: precise(Number(token0_amount), pair.reserve0.quantity.symbol.precision)+' '+pair.reserve0.quantity.symbol.name,
  				memo: 'deposit:'+pair.code
  			}
  		},{
  			account: pair.reserve1.contract,
  			name: 'transfer',
  			authorization: [chainStore.getCurrentSession().permissionLevel],
  			data: {
  				from: chainStore.getCurrentSession().actor.toString(),
  				to: app_config.swap_contract,
  				quantity: precise(Number(token1_amount), pair.reserve1.quantity.symbol.precision)+' '+pair.reserve1.quantity.symbol.name,
  				memo: 'deposit:'+pair.code
  			}
  		},{
  			account: app_config.swap_contract,
  			name: 'addliquidity',
  			authorization: [chainStore.getCurrentSession().permissionLevel],
  			data: {
  				owner: chainStore.getCurrentSession().actor.toString(),
  				token0: {
  					sym: pair.reserve0.quantity.symbol.precision+","+pair.reserve0.quantity.symbol.name,
  					contract: pair.reserve0.contract
  				},
  				token1: {
  					sym: pair.reserve1.quantity.symbol.precision+","+pair.reserve1.quantity.symbol.name,
  					contract: pair.reserve1.contract
  				},
  			}
  		}]
  	},
  	getRemoveLiquidityActions: () => (pair, lptoken_amount) => {
  		const chainStore = useChainStore();

  		return[{
  			account: app_config.lptoken_contract,
  			name: 'transfer',
  			authorization: [chainStore.getCurrentSession().permissionLevel],
  			data: {
  				from: chainStore.getCurrentSession().actor.toString(),
  				to: app_config.swap_contract,
  				quantity: precise(Number(lptoken_amount), 0)+' '+pair.code,
  				memo: ''
  			}
  		}]
  	}
  }
})