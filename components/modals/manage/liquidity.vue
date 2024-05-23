<template>
<div>
  <UModal v-model="modal_open">
    <h3>{{ (manageStore.selected_operation === 'add' ? 'Add' : 'Remove') }} liquidity</h3>
    <div>
      <label>{{ manageStore.getSelectedPair().token0.sym.name }} amount: </label>
      <input type="number" v-model="token0_amount"/>
    </div>
    <div>
      <label>{{ manageStore.getSelectedPair().token1.sym.name }} amount: </label>
      <input type="number" v-model="token1_amount"/>
    </div>
    <div>
      <button @click="doOperation()">{{ (manageStore.selected_operation === 'add' ? 'Add' : 'Remove') }} liquidity</button>
    </div>
  </UModal>
</div>
</template>
<script setup>
const modal_open = ref(false)
const token0_amount = ref(0);
const token1_amount = ref(0);

import { useManageStore } from '~/stores/manage.js';
import { useChainManageStore } from '~/stores/chain/manage.js';
import { useModalStore } from '~/stores/modal.js';

const modalStore = useModalStore();
const manageStore = useManageStore();
const chainManageStore = useChainManageStore();

function doOperation() {
  modal_open.value = false
  modalStore.close()

  if(manageStore.selected_operation === 'add')
    chainManageStore.addLiquidity(manageStore.getSelectedPair(), token0_amount.value, token1_amount.value)
  else
    chainManageStore.removeLiquidity(manageStore.getSelectedPair(), token0_amount.value, token1_amount.value)
}

watch(() => modalStore.active_modal, (value) => {
  if(modalStore.isOpen('liquidity'))
    modal_open.value = true
})

watch(modal_open, (value) => {
  if(!value)
    modalStore.close()
})

</script>