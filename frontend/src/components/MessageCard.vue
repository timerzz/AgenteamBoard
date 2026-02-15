<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const messageType = computed(() => {
  try {
    const parsed = JSON.parse(props.message.text);
    return parsed.type ? 'protocol' : 'normal';
  } catch {
    return 'normal';
  }
});

const protocolData = computed(() => {
  if (messageType.value === 'protocol') {
    return JSON.parse(props.message.text);
  }
  return null;
});

function getAgentColor(colorName) {
  const colors = {
    blue: '#60a5fa',
    green: '#34d399',
    yellow: '#fbbf24',
    purple: '#a78bfa',
    orange: '#fb923c',
    pink: '#f472b6',
    cyan: '#22d3ee',
    red: '#f87171',
  };
  return colors[colorName] || colors.blue;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
</script>

<template>
  <div
    :class="[
      'p-4 rounded-xl border transition-all',
      messageType === 'protocol'
        ? 'bg-deep border-border-subtle'
        : 'bg-surface border-border-subtle hover:border-border-active'
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Agent头像 -->
      <div
        :style="{
          backgroundColor: getAgentColor(message.color),
          boxShadow: `0 0 20px ${getAgentColor(message.color)}40`
        }"
        class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center animate-pulse-slow"
      >
        <span class="text-white text-xs font-bold">
          {{ message.from.charAt(0).toUpperCase() }}
        </span>
      </div>

      <!-- 消息内容 -->
      <div class="flex-1 min-w-0">
        <!-- 头部：名称 + 时间 -->
        <div class="flex items-baseline gap-2 mb-1">
          <span
            :style="{ color: getAgentColor(message.color) }"
            class="font-semibold text-sm"
          >
            {{ message.from }}
          </span>
          <span class="text-xs text-text-muted">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>

        <!-- 普通消息 -->
        <template v-if="messageType === 'normal'">
          <p class="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
            {{ message.text }}
          </p>

          <div
            v-if="message.summary"
            class="mt-2 text-xs text-text-secondary italic"
          >
            {{ message.summary }}
          </div>
        </template>

        <!-- 协议消息 -->
        <div v-else class="bg-deep rounded p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">⚙️</span>
            <span class="text-xs text-text-muted">系统消息</span>
          </div>
          <pre class="text-xs text-text-secondary overflow-x-auto">{{ JSON.stringify(protocolData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
