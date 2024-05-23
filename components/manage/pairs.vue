<template>
	<div class="manage-pairs">
		<h3>Existing pairs:</h3>
		<div class="pairs-list">
			<div v-for="pair of manageStore.pairs">
				<div>#{{ pair.id }} - {{ pair.token1.sym.name }}/{{ pair.token0.sym.name}}</div>
				<div>Reserve 0: {{ pair.reserve0 }}</div>
				<div>Reserve 1: {{ pair.reserve1 }}</div>
				<div>Liquidity: {{ pair.total_liquidity }} {{ pair.code }}</div>
				<div>Created: {{ pair.created_time }}</div>
				<div>Updated: {{ pair.updated_time }}</div>
				<div class="actions">
					<button>Add liquidity</button>
					<button>Remove liquidity</button>
					<button @click="chainManageStore.deletePair(pair.id)">Delete pair</button>
				</div>
			</div>
		</div>
		<ModalsManageLiquidity />
	</div>
</template>
<script setup>
import { useManageStore } from '@/stores/manage'
import { useChainManageStore } from '@/stores/chain/manage'

const manageStore = useManageStore()
const chainManageStore = useChainManageStore()

onMounted(async () => {
  await manageStore.fetchPairs()
})

</script>