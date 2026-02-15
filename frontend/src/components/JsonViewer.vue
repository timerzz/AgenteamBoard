<script setup>
import { computed } from 'vue';
import { useMessagesStore } from '../stores/messages.js';

const messagesStore = useMessagesStore();

const jsonData = computed(() => {
  return JSON.stringify(messagesStore.messages, null, 2);
});
</script>

<template>
  <div class="flex-1 overflow-auto p-4">
    <pre
      class="text-sm text-text-secondary bg-deep p-4 rounded-xl overflow-x-auto"
    >{{ jsonData }}</pre>
  </div>
</template>
