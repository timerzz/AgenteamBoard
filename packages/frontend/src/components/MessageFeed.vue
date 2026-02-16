<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { useTeamsStore } from '../stores/teams.js';
import { useMessagesStore } from '../stores/messages.js';
import { useViewStore } from '../stores/view.js';
import MessageCard from './MessageCard.vue';

const teamsStore = useTeamsStore();
const messagesStore = useMessagesStore();
const viewStore = useViewStore();

const messagesContainer = ref(null);

// 判断是否是系统协议消息
function isSystemMessage(message) {
  try {
    const parsed = JSON.parse(message.text);
    // 如果text是JSON且包含type字段，认为是系统消息
    return parsed && typeof parsed === 'object' && 'type' in parsed;
  } catch {
    // JSON解析失败，说明是普通消息
    return false;
  }
}

const filteredMessages = computed(() => {
  let messages = messagesStore.messages;

  // 成员筛选
  if (teamsStore.selectedMemberName) {
    messages = messages.filter(m => m.from === teamsStore.selectedMemberName);
  }

  // 搜索过滤
  if (viewStore.searchQuery) {
    const query = viewStore.searchQuery.toLowerCase();
    messages = messages.filter(m =>
      m.text.toLowerCase().includes(query) ||
      (m.summary && m.summary.toLowerCase().includes(query))
    );
  }

  return messages;
});

// 监听活动团队变化，加载消息
watch(() => teamsStore.activeTeamId, async (newTeamId) => {
  if (newTeamId) {
    await messagesStore.fetchMessages(newTeamId, { limit: 100 });
  } else {
    messagesStore.clearMessages();
  }
}, { immediate: true });

// 监听选中的成员，更新筛选
watch(() => teamsStore.selectedMemberName, (memberName) => {
  if (memberName) {
    viewStore.setFilterMember(memberName);
  } else {
    viewStore.setFilterMember(null);
  }
});
</script>

<template>
  <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
    <!-- 加载状态 -->
    <div v-if="messagesStore.loading" class="flex items-center justify-center h-full">
      <p class="text-text-muted">加载消息中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="messagesStore.error" class="flex items-center justify-center h-full">
      <p class="text-error">{{ messagesStore.error }}</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!messagesStore.hasMessages" class="flex items-center justify-center h-full">
      <p class="text-text-muted">等待消息...</p>
    </div>

    <!-- 消息列表 -->
    <template v-else>
      <MessageCard
        v-for="message in filteredMessages"
        :key="message.timestamp + message.from"
        :message="message"
      />
    </template>
  </div>
</template>
