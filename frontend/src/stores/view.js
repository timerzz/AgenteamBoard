import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('view', () => {
  const currentView = ref('chat'); // 'chat' | 'json'
  const searchQuery = ref('');
  const filterMember = ref(null);

  function setView(view) {
    currentView.value = view;
  }

  function setSearchQuery(query) {
    searchQuery.value = query;
  }

  function setFilterMember(memberName) {
    filterMember.value = memberName;
  }

  function clearFilters() {
    searchQuery.value = '';
    filterMember.value = null;
  }

  return {
    currentView,
    searchQuery,
    filterMember,
    setView,
    setSearchQuery,
    setFilterMember,
    clearFilters,
  };
});
