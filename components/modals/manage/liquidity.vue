<template>
<div>
  <UButton label="Open" @click="modalStore.open('liquidity')" />

  <UModal v-model="modal_open">
    <div class="p-4">
      IT WORKS
    </div>
  </UModal>
</div>
</template>
<script setup>
import { useModalStore } from '~/stores/modal.js';

const modal_open = ref(false)
const modalStore = useModalStore();

watch(() => modalStore.active_modal, (value) => {
  if(modalStore.isOpen('liquidity'))
    modal_open.value = true
})

watch(modal_open, (value) => {
  if(!value)
    modalStore.close()
})

</script>