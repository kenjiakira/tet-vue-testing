<template>
  <div class="social-share" :class="{ 'collapsed': isCollapsed }">
    <button class="toggle-btn" @click.stop="toggleMenu">
      <span class="icon">{{ isCollapsed ? '📱' : '✕' }}</span>
    </button>

    <div class="share-menu" :class="{ 'hidden': isCollapsed }">
      <Teleport to="body">
        <div v-if="showQR" class="qr-modal" @click="showQR = false">
          <div class="qr-container" @click.stop>
            <div class="qr-header">
              <h3>Quét mã QR</h3>
              <button class="close-btn" @click="showQR = false">✕</button>
            </div>
            <qrcode-vue
              :value="websiteUrl"
              :size="180"
              level="H"
              render-as="svg"
              :background="'#ffffff'"
              :foreground="'#e74c3c'"
              :margin="2"
              class="qr-code"
            />
            <p class="qr-text">Quét để xem lời chúc Tết</p>
          </div>
        </div>
      </Teleport>

      <div class="share-buttons">
        <button class="share-btn qr" @click="showQR = true">
          <span class="icon">📱</span>
          <span class="label">Mã QR</span>
        </button>

        <button class="share-btn facebook" @click="shareToFacebook">
          <span class="icon">📱</span>
          <span class="label">Facebook</span>
        </button>
        <button class="share-btn zalo" @click="shareToZalo">
          <span class="icon">💬</span>
          <span class="label">Zalo</span>
        </button>
        <button class="share-btn copy" @click="copyLink">
          <span class="icon">📋</span>
          <span class="label">Copy Link</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'vue-qrcode';

const showQR = ref(false);
const isCollapsed = ref(true); 

const toggleMenu = () => {
  isCollapsed.value = !isCollapsed.value;

  if (isCollapsed.value) {
    showQR.value = false;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const shareEl = document.querySelector('.social-share');
  if (shareEl && !shareEl.contains(event.target as Node)) {
    isCollapsed.value = true;
    showQR.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  const isMobile = window.innerWidth <= 768;
  isCollapsed.value = isMobile;
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const shareMessage = "🎊 Chúc Mừng Năm Mới 2025 - Năm Rồng 🐲";
const websiteUrl = window.location.href;

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(shareMessage)}`;
  window.open(url, '_blank');
};

const shareToZalo = () => {
  const url = `https://zalo.me/share?u=${encodeURIComponent(websiteUrl)}&t=${encodeURIComponent(shareMessage)}`;
  window.open(url, '_blank');
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(websiteUrl);
    alert('Đã sao chép link!');
  } catch (err) {
    console.error('Không thể sao chép:', err);
  }
};
</script>

<style scoped>
.social-share {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 100;
}

.toggle-btn {
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #ffd700;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 101;
  transition: all 0.3s ease;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.share-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
}

.share-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ffd700;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.share-btn:hover {
  transform: translateX(5px);
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  color: white;
}

.icon {
  font-size: 1.2rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
}

.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}

.qr-container {
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  text-align: center;
}

.qr-header {
  display: flex;

  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.qr-header h3 {
  margin: 0;
  color: #e74c3c;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  color: #666;
}

.qr-text {
  margin-top: 15px;
  color: #666;
  font-size: 0.9rem;
}

.share-btn.qr {
  background: linear-gradient(45deg, #ffd700, #e74c3c);
  color: white;
}

.qr-code {
  display: block;
  width: 180px !important;
  height: 180px !important;
  margin: 0 auto;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .social-share {
    left: 10px;
    bottom: 10px;
  }

  .share-btn {
    padding: 8px 12px;
  }

  .label {
    display: none;
  }

  .icon {
    font-size: 1.5rem;
  }

  .qr-container {
    width: min(320px, calc(100vw - 32px));
    padding: 15px;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .social-share.collapsed .share-menu {
    visibility: hidden;
  }

  .share-menu {
    position: absolute;
    bottom: 55px;
    left: 0;
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease;
  }

  .share-menu.hidden {
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
  }

  .qr-modal {
    padding: 0;
  }

  .qr-code {
    width: 160px !important;
    height: 160px !important;
  }

  qrcode-vue {
    width: 100% !important;
    height: auto !important;
    max-width: 200px !important;
    margin: 0 auto;
  }

  .qr-header h3 {
    font-size: 1.1rem;
  }

  .qr-text {
    font-size: 0.85rem;
    margin-top: 10px;
  }
}
</style>
