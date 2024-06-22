<template>
	<div class="manage-pairs">
		<h3>Existing pairs:</h3>
		<div class="pairs-list">
			<div v-for="pair of manageStore.pairs">
				<div>#{{ pair.code }} - {{ pair.reserve1.quantity.symbol.name }}/{{ pair.reserve0.quantity.symbol.name}}</div>
				<div>Reserve 0: {{ pair.reserve0.quantity }}</div>
				<div>Reserve 1: {{ pair.reserve1.quantity }}</div>
				<div>Liquidity: {{ pair.total_liquidity }} {{ pair.code }}</div>
				<div>Created: {{ pair.created_time }}</div>
				<div>Updated: {{ pair.updated_time }}</div>
				<div class="actions">
					<button @click="updateLiquidityPair('add', pair.code)">Add liquidity</button>
					<button v-if="pair.total_liquidity <= 0" disabled class="disabled">Remove liquidity</button>
					<button v-else @click="updateLiquidityPair('remove', pair.code)">Remove liquidity</button>
					<button @click="chainManageStore.deletePair(pair.code)">Delete pair</button>
				</div>
			</div>
		</div>
		<ModalsManageLiquidity />
	</div>
</template>
<script setup>
import { useManageStore } from '@/stores/manage'
import { useBalancesStore } from '~/stores/balances.js';
import { useChainManageStore } from '@/stores/chain/manage'
import { useModalStore } from '~/stores/modal.js';

const manageStore = useManageStore()
const balancesStore = useBalancesStore();
const chainManageStore = useChainManageStore()
const modalStore = useModalStore();

async function updateLiquidityPair(operation, pair_code) {
	await balancesStore.getBalances()
	manageStore.selectLiquidityPair(operation, pair_code)
	modalStore.open('liquidity')
}

onMounted(async () => {
  await manageStore.fetchPairs()
})

</script>