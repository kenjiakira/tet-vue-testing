<template>
  <div class="lucky-money-container">
    <div v-for="(envelope, index) in envelopes"
         :key="index"
         class="envelope"
         :style="envelope.style"
         @click="openEnvelope(index)"
         :class="{ 'opened': envelope.opened }">
      🧧
    </div>
    <div v-if="showMessage" class="lucky-message">
      <div class="message-content">
        {{ currentMessage }}
        <div class="decoration">✨</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const luckyMessages = [
  "Phát tài phát lộc! 💰",
  "Vạn sự như ý! ✨",
  "Sức khỏe dồi dào! 💪",
  "May mắn tới tấp! 🍀",
  "Tiền vào như nước! 💸"
];

interface EnvelopeStyle {
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  '--direction': number;
}

interface Envelope {
  style: EnvelopeStyle;
  opened: boolean;
  message: string;
}


const envelopes = ref<Envelope[]>([]);
const showMessage = ref(false);
const currentMessage = ref('');

const createEnvelope = () => {
  const randomDirection = Math.random() > 0.5 ? 1 : -1;
  const animDuration = window.innerWidth <= 768 ? 5 : 3; 
  const style: EnvelopeStyle = {
    left: `${Math.random() * 160 - 30}vw`,
    top: '-50px',
    animationDuration: `${Math.random() * 2 + animDuration}s`,
    animationDelay: `${Math.random() * 3}s`,
    '--direction': randomDirection 
  };
  const message = luckyMessages[Math.floor(Math.random() * luckyMessages.length)];
  envelopes.value.push({ style, opened: false, message });
};

const openEnvelope = (index: number) => {
  if (!envelopes.value[index].opened && !showMessage.value) {
    envelopes.value[index].opened = true;
    currentMessage.value = envelopes.value[index].message;
    showMessage.value = true;

    requestAnimationFrame(() => {
      setTimeout(() => {
        showMessage.value = false;
        envelopes.value = envelopes.value.filter((_, i) => i !== index);
      }, 2000);
    });
  }
};

const props = defineProps<{
  reduced?: boolean
}>()

// Thêm biến để theo dõi hiệu năng
let performanceMode = ref('high'); // high, medium, low
let fpsHistory: number[] = [];
const FPS_SAMPLE_SIZE = 5;

onMounted(() => {
  const isMobile = window.innerWidth <= 768;
  const isLowEnd = props.reduced;
  let lastFrameTime = performance.now();
  let frameCount = 0;

  // Khởi tạo với số lượng ít hơn
  const initialCount = isMobile ? 2 : (isLowEnd ? 3 : 8);
  for(let i = 0; i < initialCount; i++) {
    createEnvelope();
  }

  const createOptimizedEnvelope = () => {
    if (document.hidden || !document.hasFocus()) return;
    
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastFrameTime > 1000) {
      const currentFps = frameCount / ((currentTime - lastFrameTime) / 1000);
      
      fpsHistory.push(currentFps);
      if (fpsHistory.length > FPS_SAMPLE_SIZE) {
        fpsHistory.shift();
      }

      const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
      console.log('Average FPS:', avgFps);

      if (avgFps < 20) {
        performanceMode.value = 'low';
      
        if (envelopes.value.length > 2) {
          envelopes.value = envelopes.value.slice(0, 2);
        }
      } else if (avgFps < 30) {
        performanceMode.value = 'medium';
        if (envelopes.value.length > 4) {
          envelopes.value = envelopes.value.slice(0, 4);
        }
      } else {
        performanceMode.value = 'high';
      }

      frameCount = 0;
      lastFrameTime = currentTime;
    }

    const maxEnvelopes = {
      low: 2,
      medium: 4,
      high: isMobile ? 6 : 12
    }[performanceMode.value];

    if (envelopes.value.length < maxEnvelopes) {
      createEnvelope();
    }
  };

  const interval = isMobile ? 4000 : (isLowEnd ? 3000 : 2000);
  let rafId: number;

  const queueNextEnvelope = () => {
    if (performanceMode.value === 'low') {
     
      setTimeout(() => {
        createOptimizedEnvelope();
        queueNextEnvelope();
      }, 2000);
    } else {
      rafId = requestAnimationFrame(() => {
        createOptimizedEnvelope();
        queueNextEnvelope();
      });
    }
  };

  queueNextEnvelope();
  
  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });
});
</script>

<style scoped>
.lucky-money-container {
  position: fixed;
  width: 160vw; 
  height: 120vh;
  pointer-events: none;
  z-index: 2;
  overflow: visible; 
  left: -30vw; 
  top: -20vh;
}

.envelope {
  position: absolute;
  top: -50px; 
  font-size: min(2rem, 8vw);
  padding: 5px;
  border-radius: 8px;
  animation: falling linear infinite;
  background: linear-gradient(45deg, #ffd700, #e74c3c);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;
  transition: all 0.5s ease;
  pointer-events: auto;
}

.envelope:hover {
  transform: scale(1.2);
}

.envelope.opened {
  animation: disappear 0.5s forwards;
  pointer-events: none;
}

.lucky-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  padding: 20px;
  border-radius: 20px;
  font-size: min(1.8rem, 6vw);
  white-space: normal;
  max-width: 90vw;
  text-align: center;
  animation: appearMessage 0.5s ease-out;
  z-index: 1000;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.message-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.decoration {
  animation: sparkle 1s infinite;
}

@keyframes falling {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(70vh) translateX(calc(20vw * var(--direction, 1))) rotate(180deg) scale(1.2);
  }
  100% {
    transform: translateY(140vh) translateX(0) rotate(360deg) scale(1);
  }
}

@keyframes disappear {
  to {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes appearMessage {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes sparkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .envelope {
    font-size: min(1.5rem, 6vw);
    padding: 3px;
    animation-duration: 5s !important;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0.8; 
  }

  .lucky-message {
    font-size: min(1.5rem, 5vw);
    padding: 15px 20px;
  }
}
</style>

