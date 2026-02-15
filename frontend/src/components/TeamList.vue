<script setup>
import { computed } from 'vue';
import { useTeamsStore } from '../stores/teams.js';
import { useViewStore } from '../stores/view.js';

const teamsStore = useTeamsStore();
const viewStore = useViewStore();

const activeTeamId = computed(() => teamsStore.activeTeamId);

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
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 团队列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="teamsStore.loading" class="p-4">
        <p class="text-text-muted text-sm">加载中...</p>
      </div>

      <div v-else-if="teamsStore.error" class="p-4">
        <p class="text-error text-sm">{{ teamsStore.error }}</p>
      </div>

      <div v-else-if="!teamsStore.hasTeams" class="p-4">
        <p class="text-text-muted text-sm">暂无团队</p>
      </div>

      <div v-else class="space-y-1 p-2">
        <div
          v-for="team in teamsStore.teams"
          :key="team.id"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-2',
            activeTeamId === team.id
              ? 'bg-elevated border-accent-primary shadow-glow-sm'
              : 'bg-transparent border-transparent hover:bg-surface'
          ]"
          @click="teamsStore.setActiveTeam(team.id)"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-text-primary font-medium truncate">{{ team.name }}</h3>
            <span class="text-xs text-text-secondary">{{ team.memberCount }}</span>
          </div>

          <!-- 成员头像预览 -->
          <div class="flex -space-x-2 mt-2">
            <div
              v-for="member in team.members.slice(0, 5)"
              :key="member.name"
              :style="{ backgroundColor: getAgentColor(member.color) }"
              class="w-6 h-6 rounded-full border-2 border-deep"
              :title="member.name"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="p-3 border-t border-border-subtle">
      <div class="flex items-center justify-between text-xs text-text-muted">
        <span>{{ teamsStore.teams.length }} 个团队</span>
      </div>
    </div>
  </div>
</template>
