<template>
	<div class="manage-pairs">
		<h3>Existing pairs:</h3>
	</div>
</template>
<script setup>
import { useManageStore } from '@/stores/manage'

const manageStore = useManageStore()

onMounted(async () => {
  await manageStore.fetchPairs()
})

</script>