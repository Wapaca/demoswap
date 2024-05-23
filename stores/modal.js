import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
  	active_modal: null
  }),
  actions: {
  	open(name) {
  		this.active_modal = name
  	},
  	close() {
  		this.active_modal = null
  	}
  },
  getters: {
  	isOpen: () => (name) => {
  		const thisStore = useModalStore()
  		return thisStore.active_modal === name;
  	}
  }
})