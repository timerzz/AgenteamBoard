<script setup>
import { useViewStore } from '../stores/view.js';

const viewStore = useViewStore();

const views = [
  { id: 'chat', label: '聊天视图', icon: '💬' },
  { id: 'json', label: 'JSON视图', icon: '📄' },
];
</script>

<template>
  <div class="flex bg-deep rounded-lg p-1">
    <button
      v-for="view in views"
      :key="view.id"
      :class="[
        'px-4 py-2 rounded-md text-sm font-medium transition-all',
        viewStore.currentView === view.id
          ? 'bg-accent-primary text-white shadow-glow-sm'
          : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
      ]"
      @click="viewStore.setView(view.id)"
    >
      <span class="mr-2">{{ view.icon }}</span>
      {{ view.label }}
    </button>
  </div>
</template>
