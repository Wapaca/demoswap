<template>
	<div class="manage-create">
		<h3>Create pair:</h3>
		<div>
			<label>Token A: </label>
			<select v-model="indexBalA">
				<option :value="null">-</option>
				<option v-for="(bal, i) of balancesStore.balances" :value="i">{{ bal.currency }}@{{ bal.contract }}</option>
			</select>
		</div>
		<div>
			<label>Token B: </label>
			<select v-model="indexBalB">
				<option :value="null">-</option>
				<option v-for="(bal, i) of balancesStore.balances" :value="i">{{ bal.currency }}@{{ bal.contract }}</option>
			</select>
		</div>
		<div>
			<button v-if="indexBalA === null || indexBalB === null || indexBalA === indexBalB" disabled class="disabled">Create Pair</button>
			<button v-else @click="chainManageStore.createPair(balancesStore.getBalance(indexBalA), balancesStore.getBalance(indexBalB))">Create Pair</button>
		</div>
	</div>
</template>
<script setup>
import { Name, UInt64 } from "@wharfkit/antelope"
import { useChainManageStore } from '@/stores/chain/manage'

const chainManageStore = useChainManageStore();
const balancesStore = useBalancesStore();

const indexBalA = ref(null);
const indexBalB = ref(null);

onMounted(async () => {
  await balancesStore.getBalances()
})

</script>