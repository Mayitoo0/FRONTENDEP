<template>
  <teleport to="body" v-if="floating">
    <q-icon
      name="arrow_back"
      :size="numericSize + 'px'"
      class="back-icon"
      :style="iconStyle"
      @click="handleClick"
      :aria-label="ariaLabel"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
    />
  </teleport>

  <q-icon
    v-else
    name="arrow_back"
    :size="numericSize + 'px'"
    :class="['back-icon']"
    :style="iconStyle"
    @click="handleClick"
    :aria-label="ariaLabel"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  to: { type: String, default: null },
  size: { type: [String, Number], default: 50 },
  color: { type: String, default: '#39A900' },
  ariaLabel: { type: String, default: 'Volver' },
  floating: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  // Nuevo prop para controlar el z-index
  zIndex: { type: Number, default: 1000 }
})

const emit = defineEmits(['click'])
const router = useRouter()

const numericSize = computed(() => {
  return typeof props.size === 'number' ? props.size : parseInt(props.size, 10) || 50
})

const iconStyle = computed(() => {
  const s = {
    color: props.color,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.12s ease, opacity 0.12s ease'
  }

  if (props.floating) {
    s.position = 'fixed'
    s.left = '20px'
    s.top = '98px'
  }

  if (props.disabled) {
    s.opacity = 0.4
    s.pointerEvents = 'none'
  }

  return s
})

function handleClick(evt) {
  if (props.disabled) return
  
  emit('click', evt)
  if (props.to) router.push(props.to)
  else router.back()
}
</script>

<style scoped>
.back-icon {
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.back-icon:hover {
  transform: translateX(-4px);
}
</style>