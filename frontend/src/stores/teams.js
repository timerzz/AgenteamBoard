import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref([]);
  const activeTeamId = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const activeTeam = computed(() =>
    teams.value.find(t => t.id === activeTeamId.value)
  );

  const hasTeams = computed(() => teams.value.length > 0);

  async function fetchTeams() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      teams.value = await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('加载团队列表失败:', err);
    } finally {
      loading.value = false;
    }
  }

  function setActiveTeam(teamId) {
    activeTeamId.value = teamId;
  }

  function updateTeam(teamId, updates) {
    const index = teams.value.findIndex(t => t.id === teamId);
    if (index !== -1) {
      teams.value[index] = { ...teams.value[index], ...updates };
    }
  }

  return {
    teams,
    activeTeamId,
    activeTeam,
    loading,
    error,
    hasTeams,
    fetchTeams,
    setActiveTeam,
    updateTeam,
  };
});
