<template>
	<div class="manage-config">
		<h3>Configs:</h3>
		<form @submit.prevent="manageStore.updateConfig">
			<div>
				<label>fee.account: </label>
				<input type="text" v-model="fee_account" data-action="setname" name="fee.account"/>
			</div>
			<div>
				<label>fee.trade: </label>
				<input type="number" v-model="fee_trade" data-action="setconfig" name="fee.trade"/>
			</div>
			<div>
				<label>fee.protocol: </label>
				<input type="number" v-model="fee_protocol" data-action="setconfig" name="fee.protocol"/>
			</div>
			<div>
				<label>manager: </label>
				<input type="text" v-model="manager" data-action="setname" name="manager"/>
			</div>
			<div>
				<label>status: </label>
				<input type="text" v-model="status" data-action="setconfig" name="status"/>
			</div>
			<div>
				<button type="submit">Update</button>
			</div>
		</form>
	</div>
</template>
<script setup>
import { Name, UInt64 } from "@wharfkit/antelope"
import { useManageStore } from '@/stores/manage'

const manageStore = useManageStore();

const fee_account = ref('')
const fee_trade = ref(0)
const fee_protocol = ref(0)
const manager = ref('')
const status = ref(0)

onMounted(async () => {
  await manageStore.fetchConfig()

  if(manageStore.config['fee.account'] !== undefined)
  	fee_account.value = String(Name.from(UInt64.from(manageStore.config['fee.account'])))
  if(manageStore.config['fee.protocol'] !== undefined)
  	fee_protocol.value = manageStore.config['fee.protocol']
  if(manageStore.config['fee.trade'] !== undefined)
  	fee_trade.value = manageStore.config['fee.trade']
  if(manageStore.config['manager'] !== undefined)
  	manager.value = String(Name.from(UInt64.from(manageStore.config['manager'])))
  if(manageStore.config['status'] !== undefined)
  	status.value = manageStore.config['status']
})

</script>