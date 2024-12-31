<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'

const isMobile = ref(false)
const isLowEndDevice = ref(false)
const isVeryLowEndDevice = ref(false)

const FireworksEffect = defineAsyncComponent(() => import('./components/FireworksEffect.vue'))
const PeachBlossoms = defineAsyncComponent(() => import('./components/PeachBlossoms.vue'))
const LuckyMoney = defineAsyncComponent(() => import('./components/LuckyMoney.vue'))
const GreetingCard = defineAsyncComponent(() => import('./components/GreetingCard.vue'))
const AudioPlayer = defineAsyncComponent(() => import('./components/AudioPlayer.vue'))
const SocialShare = defineAsyncComponent(() => import('./components/SocialShare.vue'))

const isLoading = ref(true)
onMounted(() => {
  isMobile.value = window.innerWidth <= 768
  
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as any).deviceMemory || 4
  const fps = 60 

  console.log('Device Info:', {
    cores,
    memory,
    fps,
    width: window.innerWidth
  })

  isLowEndDevice.value = cores <= 2 || memory < 2
  isVeryLowEndDevice.value = cores <= 1 || memory < 1

  console.log('Device Status:', {
    isMobile: isMobile.value,
    isLowEnd: isLowEndDevice.value,
    isVeryLowEnd: isVeryLowEndDevice.value
  })

  const delay = isVeryLowEndDevice.value ? 3000 : (isLowEndDevice.value ? 2000 : 1000)
  setTimeout(() => {
    isLoading.value = false
  }, delay)
})
</script>

<template>
  <main class="tet-app">
    <Suspense>
      <template #default>
        <div>
          <GreetingCard />
          <template v-if="!isLoading">
            <FireworksEffect v-if="!isMobile" :launchSpeed="2" :sparkDensity="1.5" />
          
            <PeachBlossoms :reduced="isLowEndDevice" />
            <LuckyMoney :reduced="isLowEndDevice" />
            <AudioPlayer />
            <SocialShare />
          </template>
        </div>
      </template>
      <template #fallback>
        <div class="loading">Đang tải...</div>
      </template>
    </Suspense>
  </main>
</template>

<style>
.tet-app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e74c3c 0%, #ff9b11 100%),
              url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23ffd700" stroke-width="0.5"/></svg>') !important;
  background-blend-mode: overlay;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s;
}
.tet-app:hover {
  transform: scale(1.02);
}

.tet-app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;

  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, transparent 90%, rgba(231, 76, 60, 0.2));
  pointer-events: none;
}
</style>
