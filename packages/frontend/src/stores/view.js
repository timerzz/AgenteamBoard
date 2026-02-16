import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('view', () => {
  const searchQuery = ref('');
  const filterMember = ref(null);

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
    searchQuery,
    filterMember,
    setSearchQuery,
    setFilterMember,
    clearFilters,
  };
});
