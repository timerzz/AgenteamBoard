<script setup>
import { onMounted } from 'vue';
import { useTeamsStore } from './stores/teams.js';
import { useSSE } from './composables/useSSE.js';
import TeamList from './components/TeamList.vue';
import MemberList from './components/MemberList.vue';
import MessageFeed from './components/MessageFeed.vue';

const teamsStore = useTeamsStore();
const { status: sseStatus, connect: connectSSE } = useSSE();

onMounted(async () => {
  // 加载团队列表
  await teamsStore.fetchTeams();

  // 连接SSE
  connectSSE();
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
      <!-- 左侧边栏：团队列表 -->
      <aside class="w-64 bg-deep border-r border-border-subtle flex flex-col">
        <div class="p-4 border-b border-border-subtle">
          <h1 class="text-xl font-semibold text-accent-primary">AgenteamBoard</h1>
          <p class="text-xs text-text-secondary mt-1">Agent Teams监控</p>
        </div>
        <TeamList />
      </aside>

      <!-- 中间侧边栏：成员列表 -->
      <aside
        v-if="teamsStore.showMembersSidebar"
        class="w-80 bg-deep border-l border-border-subtle flex flex-col"
      >
        <MemberList :teamId="teamsStore.activeTeamId" />
      </aside>

      <!-- 右侧主内容：消息 -->
      <main class="flex-1 flex flex-col">
        <!-- 顶部导航栏 -->
        <header class="h-16 bg-surface border-b border-border-subtle flex items-center px-6">
          <div class="flex items-center gap-4 flex-1">
            <button
              v-if="teamsStore.selectedMemberName"
              @click="teamsStore.goBack"
              class="text-text-secondary hover:text-text-primary transition-colors p-2 hover:bg-elevated rounded"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div class="flex items-center gap-2">
              <span
                v-if="teamsStore.activeTeam"
                class="text-text-primary font-medium"
              >
                {{ teamsStore.activeTeam.name }}
              </span>
              <span
                v-if="teamsStore.selectedMemberName"
                class="text-text-secondary"
              >
                /
              </span>
              <span
                v-if="teamsStore.selectedMemberName"
                class="text-text-primary font-medium"
              >
                {{ teamsStore.selectedMemberName }}
              </span>
            </div>
          </div>
        </header>

        <!-- 消息内容 -->
        <MessageFeed />
      </main>
    </div>
  </div>
</template>
