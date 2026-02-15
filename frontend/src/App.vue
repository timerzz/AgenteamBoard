<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'AgenteamBoard';
});
</script>

<template>
  <div class="min-h-screen bg-abyss">
    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-deep border-r border-border-subtle">
        <div class="p-4 border-b border-border-subtle">
          <h1 class="text-xl font-semibold text-accent-primary">AgenteamBoard</h1>
          <p class="text-xs text-text-secondary mt-1">Agent Teams监控</p>
        </div>
        <div class="p-4">
          <p class="text-text-muted text-sm">加载团队列表...</p>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <header class="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6">
          <h2 class="text-lg font-medium text-text-primary">选择一个团队</h2>
          <div class="flex items-center gap-4">
            <span class="text-sm text-text-muted">开发中</span>
          </div>
        </header>
        <div class="flex-1 flex items-center justify-center">
          <p class="text-text-muted">等待团队加载...</p>
        </div>
      </main>
    </div>
  </div>
</template>
