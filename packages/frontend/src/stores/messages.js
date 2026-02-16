import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const hasMessages = computed(() => messages.value.length > 0);

  async function fetchMessages(teamId, options = {}) {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (options.limit) {
        params.append('limit', options.limit);
      }
      if (options.before) {
        params.append('before', options.before);
      }

      const response = await fetch(`/api/teams/${teamId}/messages?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      messages.value = await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('加载消息失败:', err);
    } finally {
      loading.value = false;
    }
  }

  function addMessage(message) {
    messages.value.unshift(message);
  }

  function clearMessages() {
    messages.value = [];
  }

  return {
    messages,
    loading,
    error,
    hasMessages,
    fetchMessages,
    addMessage,
    clearMessages,
  };
});
