
<template>
<!-- components/MigrationStatus.vue -->
  <div v-if="!migrationStatus?.migrationComplete" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-blue-800">
          新しい構造への移行
        </h3>
        <p class="mt-1 text-sm text-blue-700">
          Book > Section > 単語の新しい階層構造に対応するため、既存データの移行が必要です。
        </p>
        
        <div v-if="migrationStatus" class="mt-3">
          <div class="text-sm text-blue-600 mb-2">
            移行状況: {{ migrationStatus.migratedWords }} / {{ migrationStatus.totalWords }} 完了
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${migrationProgress}%` }"
            ></div>
          </div>
        </div>

        <div class="mt-4 flex space-x-3">
          <button
            @click="startMigration"
            :disabled="isMigrating"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isMigrating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isMigrating ? '移行中...' : '移行開始' }}
          </button>
          
          <button
            @click="refreshStatus"
            class="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            更新
          </button>
        </div>

        <!-- 移行完了後の案内 -->
        <div v-if="migrationResult" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium text-green-800">移行完了！</span>
          </div>
          <p class="mt-1 text-sm text-green-700">
            {{ migrationResult.migratedWordsCount }}個の単語を「📚 未分類」ブックに移行しました。
            ページを再読み込みして新しい機能をお試しください。
          </p>
        </div>

        <!-- エラー表示 -->
        <div v-if="migrationError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium text-red-800">移行エラー</span>
          </div>
          <p class="mt-1 text-sm text-red-700">
            {{ migrationError }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMigration } from '~/composables/useMigration';

const { migrateUserWords, checkMigrationStatus } = useMigration();

const migrationStatus = ref<any>(null);
const migrationResult = ref<any>(null);
const migrationError = ref<string>('');
const isMigrating = ref(false);

const migrationProgress = computed(() => {
  if (!migrationStatus.value || migrationStatus.value.totalWords === 0) return 0;
  return Math.round((migrationStatus.value.migratedWords / migrationStatus.value.totalWords) * 100);
});

async function startMigration() {
  isMigrating.value = true;
  migrationError.value = '';
  migrationResult.value = null;

  try {
    console.log('🚀 移行開始...');
    const result = await migrateUserWords();
    migrationResult.value = result;
    console.log('✅ 移行完了:', result);
    
    // ステータス更新
    await refreshStatus();
  } catch (error) {
    console.error('❌ 移行失敗:', error);
    migrationError.value = error.message || '移行中にエラーが発生しました';
  } finally {
    isMigrating.value = false;
  }
}

async function refreshStatus() {
  try {
    migrationStatus.value = await checkMigrationStatus();
    console.log('📊 移行ステータス:', migrationStatus.value);
  } catch (error) {
    console.error('❌ ステータス取得エラー:', error);
  }
}

// コンポーネント初期化時にステータスチェック
onMounted(() => {
  refreshStatus();
});
</script>