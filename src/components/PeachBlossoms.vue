<template>
  <div class="peach-blossoms">
    <div v-for="(blossom, index) in blossoms"
         :key="index"
         class="blossom"
         :style="blossom.style">
      🌸
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue';

interface BlossomStyle {
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  fontSize: string;
}

const blossoms = ref<{ style: BlossomStyle }[]>([]);

const createBlossom = () => {
  const style = {
    left: `${Math.random() * 160 - 30}vw`, 
    top: '-10vh', 
    animationDuration: `${Math.random() * 4 + 3}s`,
    animationDelay: `${Math.random() * 2}s`,
    fontSize: `${Math.random() * 0.3 + 0.8}rem`
  };
  blossoms.value.push({ style });
};

const props = defineProps<{
  reduced?: boolean
}>()

onMounted(() => {
  const isMobile = window.innerWidth <= 768;
  const initialCount = props.reduced ? 2 : (isMobile ? 4 : 15);
  const maxCount = props.reduced ? 3 : (isMobile ? 8 : 25);
  const interval = props.reduced ? 6000 : (isMobile ? 4000 : 2000);
  const minDuration = props.reduced ? 6 : 4;

  const createOptimizedBlossom = () => {
    if (document.hidden || !document.hasFocus()) return;
    const style = {
      left: `${Math.random() * 160 - 30}vw`, 
      top: '-10vh', 
      animationDuration: `${Math.random() * 2 + minDuration}s`,
      animationDelay: `${Math.random() * 2}s`,
      fontSize: `${Math.random() * 0.3 + 0.8}rem`
    };
    blossoms.value.push({ style });
  };

  const createWithIdle = () => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => createOptimizedBlossom());
    } else {
      requestAnimationFrame(() => createOptimizedBlossom());
    }
  };

  for (let i = 0; i < initialCount; i++) {
    createBlossom();
  }

  let timer = setInterval(() => {
    if (document.hidden) return;
    if (blossoms.value.length > maxCount) {
      blossoms.value.shift();
    }
    createWithIdle();
  }, interval);

  onUnmounted(() => clearInterval(timer));
});
</script>

<style scoped>
.peach-blossoms {
  position: fixed;
  width: 160vw;
  height: 120vh;
  pointer-events: none;
  z-index: 1;
  overflow: visible; 
  left: -30vw; 
  top: -20vh; 
}

.blossom {
  position: absolute;
  top: -50px;
  animation: falling linear infinite;
  filter: drop-shadow(0 0 3px rgba(255, 192, 203, 0.5));
  will-change: transform;
  contain: layout style paint;
}

@keyframes falling {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(70vh) translateX(calc(15vw * var(--direction, 1))) rotate(180deg) scale(1.2);
  }
  100% {
    transform: translateY(140vh) translateX(0) rotate(360deg) scale(1);
  }
}

@media (max-width: 768px) {
  .blossom {
    filter: drop-shadow(0 0 2px rgba(255, 192, 203, 0.3));
    transform: translateZ(0);
    backface-visibility: hidden;
  }
}
</style>

