<template>
	<div class="waxelclaim-header">
		<div class="header-logo">DEMOSWAP MANAGE</div>
		<div class="header-nav">
			<ul>
				<li><NuxtLink to="/">Manage contract</NuxtLink></li>
			</ul>
		</div>
		<ClientOnly>
			<div class="header-account">
				<div class="account-name">
					<div v-if="chainStore.currentActor">
						<span>{{ chainStore.currentActor }}</span>
					</div>
					<button @click="chainStore.login()">Login</button>
				</div>
				<div class="account-logout">
					<button v-if="chainStore.currentActor" @click="chainStore.logout()">Logout</button>
				</div>
			</div>
		</ClientOnly>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
const chainStore = useChainStore()
</script>