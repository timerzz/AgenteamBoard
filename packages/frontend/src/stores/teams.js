import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref([]);
  const activeTeamId = ref(null);
  const selectedMemberName = ref(null);
  const showMembersSidebar = ref(false);
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

  function selectTeam(teamId) {
    activeTeamId.value = teamId;
    selectedMemberName.value = null;
    showMembersSidebar.value = true;
  }

  function toggleMembersSidebar() {
    if (showMembersSidebar.value) {
      showMembersSidebar.value = false;
      selectedMemberName.value = null;
    } else {
      if (activeTeamId.value) {
        showMembersSidebar.value = true;
      }
    }
  }

  function selectMember(memberName) {
    selectedMemberName.value = memberName;
  }

  function closeMembersSidebar() {
    showMembersSidebar.value = false;
    selectedMemberName.value = null;
  }

  function goBack() {
    closeMembersSidebar();
  }

  function goHome() {
    activeTeamId.value = null;
    showMembersSidebar.value = false;
    selectedMemberName.value = null;
  }

  function setActiveTeam(teamId) {
    activeTeamId.value = teamId;
  }

  function updateTeam(teamId, updates) {
    const index = teams.value.findIndex(t => t.id === teamId);
    if (index !== -1) {
      // 更新已存在的团队
      teams.value[index] = { ...teams.value[index], ...updates };
    } else if (updates) {
      // 添加新团队
      teams.value.push({ id: teamId, ...updates });
    }
  }

  return {
    teams,
    activeTeamId,
    selectedMemberName,
    showMembersSidebar,
    activeTeam,
    loading,
    error,
    hasTeams,
    fetchTeams,
    selectTeam,
    selectMember,
    closeMembersSidebar,
    goBack,
    goHome,
    setActiveTeam,
    updateTeam,
  };
});
