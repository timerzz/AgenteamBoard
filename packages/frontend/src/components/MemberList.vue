<script setup>
import { computed } from 'vue';
import { useTeamsStore } from '../stores/teams.js';

const teamsStore = useTeamsStore();
const props = defineProps({
  teamId: {
    type: String,
    required: true,
  },
});

const activeTeam = computed(() =>
  teamsStore.teams.find(t => t.id === props.teamId)
);

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

function selectMember(memberName) {
  teamsStore.selectMember(memberName);
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 成员列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="!activeTeam" class="p-4">
        <p class="text-text-muted text-sm">团队不存在</p>
      </div>

      <div v-else class="p-4 space-y-2">
        <div
          v-for="member in activeTeam.members"
          :key="member.name"
          @click="selectMember(member.name)"
          class="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border-subtle hover:border-accent-primary cursor-pointer transition-all duration-200"
        >
          <!-- 成员头像 -->
          <div
            :style="{ backgroundColor: getAgentColor(member.color) }"
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          >
            {{ member.name.charAt(0).toUpperCase() }}
          </div>

          <!-- 成员信息 -->
          <div class="flex-1">
            <h3 class="text-text-primary font-medium">{{ member.name }}</h3>
            <p class="text-xs text-text-secondary mt-1">
              {{ member.agentType }}
            </p>
          </div>

          <!-- 箭头 -->
          <div class="text-text-muted">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
