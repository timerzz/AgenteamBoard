<script setup>
import { onMounted } from 'vue';
import { useTeamsStore } from './stores/teams.js';
import { useSSE } from './composables/useSSE.js';
import TeamList from './components/TeamList.vue';
import MessageFeed from './components/MessageFeed.vue';
import JsonViewer from './components/JsonViewer.vue';
import ViewToggle from './components/ViewToggle.vue';
import { useViewStore } from './stores/view.js';

const teamsStore = useTeamsStore();
const viewStore = useViewStore();
const { status: sseStatus, connect: connectSSE } = useSSE();

onMounted(async () => {
  // 加载团队列表
  await teamsStore.fetchTeams();

  // 连接SSE
  connectSSE();

  // 默认选中第一个团队
  if (teamsStore.hasTeams) {
    teamsStore.setActiveTeam(teamsStore.teams[0].id);
  }
});
</script>

<template>
  <div class="min-h-screen bg-abyss">
    <!-- SSE状态指示器 -->
    <div class="fixed top-4 right-4 z-50">
      <div
        :class="[
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
          sseStatus === 'connected' ? 'bg-success/20 text-success' :
          sseStatus === 'connecting' ? 'bg-warning/20 text-warning' :
          'bg-error/20 text-error'
        ]"
      >
        <span
          :class="[
            'w-2 h-2 rounded-full animate-pulse',
            sseStatus === 'connected' ? 'bg-success' :
            sseStatus === 'connecting' ? 'bg-warning' :
            'bg-error'
          ]"
        />
        {{ sseStatus === 'connected' ? '已连接' : sseStatus === 'connecting' ? '连接中' : '未连接' }}
      </div>
    </div>

    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-deep border-r border-border-subtle flex flex-col">
        <div class="p-4 border-b border-border-subtle">
          <h1 class="text-xl font-semibold text-accent-primary">AgenteamBoard</h1>
          <p class="text-xs text-text-secondary mt-1">Agent Teams监控</p>
        </div>
        <TeamList />
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <header
          v-if="teamsStore.activeTeam"
          class="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6"
        >
          <div>
            <h2 class="text-lg font-medium text-text-primary">
              {{ teamsStore.activeTeam.name }}
            </h2>
            <p class="text-xs text-text-secondary">
              {{ teamsStore.activeTeam.memberCount }} 位成员
            </p>
          </div>

          <div class="flex items-center gap-4">
            <ViewToggle />
          </div>
        </header>

        <div
          v-else
          class="h-16 bg-surface border-b border-border-subtle flex items-center px-6"
        >
          <h2 class="text-lg font-medium text-text-primary">选择一个团队</h2>
        </div>

        <!-- 消息/JSON视图 -->
        <MessageFeed v-if="viewStore.currentView === 'chat'" />
        <JsonViewer v-else />
      </main>
    </div>
  </div>
</template>
