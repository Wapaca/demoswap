import { defineStore } from 'pinia'

import { BrowserLocalStorage, SessionKit } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';
import WebRenderer from '@wharfkit/web-renderer';

export const useChainStore = defineStore('chain', {
  state: () => ({
  	sessions: {},
  	currentActor: null,
  	sessionKit: null
  }),
  actions: {
  	async init() {
  		const ui = (process.client) ? new WebRenderer() : null;
			const authStorageKey = 'totoromanage-auth';

			this.sessionKit = new SessionKit({
				appName: 'totoromanage',
				chains: [{
					id: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
			    url: 'https://waxtest.api.eosnation.io',//'https://waxtest.defibox.xyz',
				}],
				storage: new BrowserLocalStorage(authStorageKey),
				ui,
				walletPlugins: [new WalletPluginAnchor()]
			});

      const sessions = await this.sessionKit.restoreAll();
      this.sessions = {}
      for(const s of sessions) {
      	const actor = s.actor.toString();
      	this.currentActor = actor;
      	this.sessions[actor] = s;
      }
  	},
		async login() {
			const response = await this.sessionKit.login();
			const actor = response.session.actor.toString();
			this.currentActor = actor;
			this.sessions[actor] = response.session;
			this.saveSessions()
			this.afterLoginHook();
		},
		afterLoginHook() {
		},
		async logout(actor) {
			if(actor === undefined)
				actor = this.currentActor;

			if(actor === null)
				return;

			await this.sessionKit.logout(this.sessions[actor]);
			this.removeSession(actor)
			this.currentActor = null;
			const currentActors = Object.keys(this.sessions)
			if(currentActors.length)
				this.currentActor = currentActors[currentActors.length - 1]
		},
		removeSession(actor) {
			if(this.sessions[actor] === undefined)
				return;

			delete this.sessions[actor];
			this.saveSessions();
		},
		saveSessions() {
			for(const actor of Object.keys(this.sessions))
				this.sessionKit.persistSession(this.sessions[actor])
		},
		async transact({
			actor,
			actions,
			updateAction,
			quickUpdateAction,
			updateFailedAction,
			updateDelay,
			updateFailedDelay,
		}) {
			let session = null
			if(actor !== undefined) {
				if(this.sessions[actor] !== undefined)
					session =	this.sessions[actor]
				else {
					throw new Error('Requested actor is not in sessions')
					return;
				}
			}

			try {
				const trx_result = await session.transact({ actions })

				if(quickUpdateAction !== undefined)
					quickUpdateAction()

				if(updateAction !== undefined)
					setTimeout(() => updateAction(), updateDelay)

				console.log(trx_result, 'trx_result')
			}
			catch(e) {
				if(updateFailedAction !== undefined)
					setTimeout(() => updateFailedAction(), updateFailedAction)

				console.log('error caught in transact', e);
			}
		}
  },
  getters: {
  	getCurrentSession: () => () => {
			const thisStore = useChainStore()

			if(!Object.keys(thisStore.sessions).length)
  			return null;

  		if(thisStore.sessions[thisStore.currentActor] === undefined)
  			return null;

  		return thisStore.sessions[thisStore.currentActor];
  	},
  	isLoggedActor: (state) => (actor) => {
  		const thisStore = useChainStore()

  		if(!Object.keys(thisStore.sessions).length)
  			return false;

  		return Object.keys(thisStore.sessions).includes(actor)
  	}
  }
})