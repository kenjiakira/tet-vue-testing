<template>
  <div class="fireworks-container" ref="fireworksContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Fireworks } from 'fireworks-js';

const fireworksContainer = ref<HTMLElement | null>(null);
let fireworks: Fireworks;

const colors = {
  red: ['#ff0000', '#ff4444', '#ff8888'],
  gold: ['#ffd700', '#ffed4a', '#fff4b0'],
  rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff']
};

onMounted(() => {
  if (!fireworksContainer.value) return;

  const isMobile = window.innerWidth <= 768;
  const isLowEnd = navigator.hardwareConcurrency <= 4;

  // Không khởi tạo fireworks trên thiết bị yếu
  if (isLowEnd || isMobile) return;

  fireworks = new Fireworks(fireworksContainer.value, {
    speed: isMobile ? 1 : 4,
    acceleration: 1.05,
    friction: 0.95,
    gravity: 1,
    particles: isLowEnd ? 30 : (isMobile ? 50 : 100),
    trace: isLowEnd ? 3 : (isMobile ? 5 : 10),
    explosion: isLowEnd ? 3 : (isMobile ? 5 : 8),
    mouse: {
      click: !isMobile && !isLowEnd,
      move: false,
      max: 2
    },
    boundaries: {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
    },
    sound: false,
    colors: [...colors.red, ...colors.gold],
    rocketsPoint: {
      min: 0,
      max: 100
    },
    intensity: isLowEnd ? 10 : (isMobile ? 15 : 25)
  });

  fireworks.start();

  setInterval(() => {
    if (document.hidden) {
      fireworks.stop();
    } else {
      fireworks.start();
    }
  }, 30000);
});

onUnmounted(() => {
  if (fireworks) {
    fireworks.stop();
  }
});
</script>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
