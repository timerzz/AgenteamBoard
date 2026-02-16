import { ref, onUnmounted } from 'vue';
import { useTeamsStore } from '../stores/teams.js';
import { useMessagesStore } from '../stores/messages.js';

/**
 * SSE连接composable
 * @param {string} url - SSE连接URL
 */
export function useSSE(url = '/api/events') {
  const status = ref('disconnected'); // 'disconnected' | 'connecting' | 'connected'
  const clientId = ref(null);
  const reconnectAttempts = ref(0);
  const maxReconnectDelay = 30000; // 最大重连延迟30秒

  let eventSource = null;
  let reconnectTimeout = null;

  /**
   * 计算重连延迟（指数退避）
   * @returns {number} 延迟毫秒数
   */
  function getReconnectDelay() {
    return Math.min(1000 * 2 ** reconnectAttempts.value, maxReconnectDelay);
  }

  /**
   * 连接SSE
   */
  function connect() {
    if (eventSource) {
      eventSource.close();
    }

    status.value = 'connecting';
    eventSource = new EventSource(url);

    // 连接成功
    eventSource.addEventListener('connected', (event) => {
      const data = JSON.parse(event.data);
      clientId.value = data.clientId;
      status.value = 'connected';
      reconnectAttempts.value = 0;
      console.log('SSE已连接:', data);
    });

    // 团队更新事件
    eventSource.addEventListener('team:updated', (event) => {
      const { teamId, team } = JSON.parse(event.data);
      const teamsStore = useTeamsStore();
      teamsStore.updateTeam(teamId, team);
    });

    // 团队删除事件
    eventSource.addEventListener('team:deleted', (event) => {
      const { teamId } = JSON.parse(event.data);
      const teamsStore = useTeamsStore();
      const teams = teamsStore.teams.filter(t => t.id !== teamId);
      teamsStore.teams = teams;
    });

    // 新消息事件
    eventSource.addEventListener('message:new', (event) => {
      const { teamId, messages } = JSON.parse(event.data);
      const teamsStore = useTeamsStore();
      const messagesStore = useMessagesStore();

      // 如果是当前活动团队，更新消息
      if (teamsStore.activeTeamId === teamId) {
        messagesStore.messages = messages;
      }
    });

    // 错误处理
    eventSource.onerror = () => {
      status.value = 'disconnected';
      eventSource.close();
      eventSource = null;

      // 尝试重连
      const delay = getReconnectDelay();
      reconnectAttempts.value++;
      console.log(`SSE断开，${delay}ms后重连...`);

      reconnectTimeout = setTimeout(() => {
        connect();
      }, delay);
    };
  }

  /**
   * 断开连接
   */
  function disconnect() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    status.value = 'disconnected';
  }

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect();
  });

  return {
    status,
    clientId,
    connect,
    disconnect,
  };
}
