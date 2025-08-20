<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- ヘッダー -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
          >
            <span class="text-xl">←</span>
            <span class="font-medium">戻る</span>
          </button>
          <h1 class="text-lg font-bold text-gray-800">🃏 フラッシュカード</h1>
          <button
            @click="showSettings = !showSettings"
            class="text-gray-600 hover:text-gray-800 transition text-xl"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- 学習設定パネル -->
      <div v-if="showSettings" class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span class="mr-2">⚙️</span>学習設定
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">学習モード</label>
            <select
              v-model="studyMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="word-to-meaning">英語 → 日本語</option>
              <option value="meaning-to-word">日本語 → 英語</option>
              <option value="mixed">ランダム</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">自動めくり</label>
            <select
              v-model="autoFlipDelay"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="0">オフ</option>
              <option value="3000">3秒</option>
              <option value="5000">5秒</option>
              <option value="8000">8秒</option>
              <option value="10000">10秒</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">学習対象</label>
            <select
              v-model="studyFilter"
              @change="filterStudyWords"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">全ての単語</option>
              <option value="studying">学習中のみ</option>
              <option value="difficult">間違えた単語</option>
              <option value="recent">最近追加した単語</option>
            </select>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            @click="resetProgress"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            🔄 進捗リセット
          </button>
          <button
            @click="shuffleCards"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
          >
            🔀 シャッフル
          </button>
          <button
            @click="markAllAsStudying"
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
          >
            📚 全て学習中に戻す
          </button>
        </div>
      </div>

      <!-- 進捗表示 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-4">
            <span class="text-gray-600 font-medium">
              {{ currentIndex + 1 }} / {{ studyWords.length }}
            </span>
            <span class="text-blue-600 font-semibold">
              {{ Math.round(progress) }}% 完了
            </span>
          </div>
          <div class="flex space-x-6 text-sm">
            <span class="text-green-600 flex items-center">
              <span class="mr-1">✓</span>{{ correctCount }}
            </span>
            <span class="text-red-600 flex items-center">
              <span class="mr-1">✗</span>{{ incorrectCount }}
            </span>
            <span class="text-blue-600 flex items-center" v-if="correctCount + incorrectCount > 0">
              <span class="mr-1">📊</span>{{ Math.round((correctCount / (correctCount + incorrectCount)) * 100) }}%
            </span>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500 relative"
            :style="{ width: `${progress}%` }"
          >
            <div class="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- フラッシュカード -->
      <div class="flex justify-center mb-6">
        <div
          v-if="currentWord"
          class="relative w-full max-w-2xl h-96 perspective-1000"
          @click="flipCard"
        >
          <div
            :class="[
              'absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer',
              isFlipped ? 'rotate-y-180' : ''
            ]"
          >
            <!-- 表面（問題） -->
            <div class="absolute inset-0 w-full h-full backface-hidden">
              <div class="bg-white rounded-2xl shadow-2xl p-8 h-full flex flex-col justify-center items-center border-2 border-blue-200 relative overflow-hidden">
                <!-- 装飾的な背景 -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full -ml-12 -mb-12"></div>
                
                <div class="text-center z-10 relative">
                  <div class="text-sm text-blue-600 mb-4 font-medium flex items-center justify-center">
                    <span class="mr-2">{{ getQuestionIcon() }}</span>
                    {{ getQuestionLabel() }}
                  </div>
                  <div class="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed mb-4">
                    {{ getQuestionText() }}
                  </div>
                  <div v-if="currentWord.pronunciation && getCurrentMode() === 'word-to-meaning'" 
                       class="text-lg text-gray-500 italic">
                    [{{ currentWord.pronunciation }}]
                  </div>
                </div>
                
                <div class="absolute bottom-6 text-gray-400 text-sm flex items-center">
                  <span class="mr-2">👆</span>タップして答えを表示
                </div>
                
                <!-- 難易度インジケーター -->
                <div class="absolute top-4 left-4 flex items-center space-x-1">
                  <span v-for="i in getDifficultyStars()" :key="i" class="text-yellow-400">⭐</span>
                </div>
              </div>
            </div>

            <!-- 裏面（答え） -->
            <div class="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div class="bg-white rounded-2xl shadow-2xl p-8 h-full flex flex-col justify-center items-center border-2 border-green-200 relative overflow-hidden">
                <!-- 装飾的な背景 -->
                <div class="absolute top-0 left-0 w-28 h-28 bg-green-50 rounded-full -ml-14 -mt-14"></div>
                <div class="absolute bottom-0 right-0 w-36 h-36 bg-emerald-50 rounded-full -mr-18 -mb-18"></div>
                
                <div class="text-center z-10 relative mb-8">
                  <div class="text-sm text-green-600 mb-4 font-medium flex items-center justify-center">
                    <span class="mr-2">{{ getAnswerIcon() }}</span>
                    {{ getAnswerLabel() }}
                  </div>
                  <div class="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed mb-4">
                    {{ getAnswerText() }}
                  </div>
                  
                  <!-- 例文表示 -->
                  <div v-if="currentWord.examples && currentWord.examples.length > 0" class="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-600 mb-2">例文</div>
                    <div class="text-base text-gray-700 italic">
                      "{{ currentWord.examples[0].english }}"
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                      {{ currentWord.examples[0].japanese }}
                    </div>
                  </div>
                </div>
                
                <!-- 正解・不正解ボタン -->
                <div class="flex space-x-4 z-10">
                  <button
                    @click.stop="markAnswer(false)"
                    class="flex items-center space-x-2 bg-red-500 text-white px-8 py-4 rounded-xl hover:bg-red-600 transition shadow-lg transform hover:scale-105"
                  >
                    <span class="text-xl">❌</span>
                    <span class="font-medium">不正解</span>
                  </button>
                  <button
                    @click.stop="markAnswer(true)"
                    class="flex items-center space-x-2 bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition shadow-lg transform hover:scale-105"
                  >
                    <span class="text-xl">✅</span>
                    <span class="font-medium">正解</span>
                  </button>
                </div>
                
                <!-- 学習データ表示 -->
                <div class="absolute top-4 right-4 text-xs text-gray-500 text-right">
                  <div>正解: {{ currentWord.correctCount || 0 }}回</div>
                  <div>学習: {{ currentWord.studyCount || 0 }}回</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作ボタン -->
      <div class="flex justify-center space-x-4 mb-6">
        <button
          @click="previousCard"
          :disabled="currentIndex === 0"
          :class="[
            'flex items-center space-x-2 px-6 py-3 rounded-xl transition font-medium',
            currentIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 shadow-md hover:shadow-lg border border-gray-200 transform hover:scale-105'
          ]"
        >
          <span class="text-xl">‹</span>
          <span>前へ</span>
        </button>

        <button
          @click="toggleBookmark"
          :class="[
            'px-6 py-3 rounded-xl shadow-md hover:shadow-lg border transition font-medium transform hover:scale-105',
            currentWord?.starred 
              ? 'bg-yellow-500 text-white border-yellow-500' 
              : 'bg-white text-gray-700 border-gray-200'
          ]"
        >
          {{ currentWord?.starred ? '⭐' : '☆' }} {{ currentWord?.starred ? 'お気に入り' : 'ブックマーク' }}
        </button>

        <button
          @click="nextCard"
          :disabled="currentIndex >= studyWords.length - 1"
          :class="[
            'flex items-center space-x-2 px-6 py-3 rounded-xl transition font-medium',
            currentIndex >= studyWords.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white shadow-md hover:shadow-lg hover:bg-blue-600 transform hover:scale-105'
          ]"
        >
          <span>次へ</span>
          <span class="text-xl">›</span>
        </button>
      </div>

      <!-- 学習完了モーダル -->
      <div v-if="showCompletionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div class="text-center">
            <div class="text-6xl mb-4">{{ getCompletionEmoji() }}</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">学習完了！</h3>
            <div class="space-y-2 text-gray-600 mb-6">
              <p>学習した単語: <span class="font-bold">{{ studyWords.length }}個</span></p>
              <p>正解数: <span class="text-green-600 font-semibold">{{ correctCount }}</span></p>
              <p>不正解数: <span class="text-red-600 font-semibold">{{ incorrectCount }}</span></p>
              <p>正答率: <span class="text-blue-600 font-semibold">{{ getAccuracyPercentage() }}%</span></p>
              <p class="text-sm">学習時間: {{ getStudyTimeText() }}</p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="restartStudy"
                class="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-medium"
              >
                🔄 もう一度
              </button>
              <button
                @click="reviewMistakes"
                v-if="incorrectWords.length > 0"
                class="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition font-medium"
              >
                ❌ 間違いを復習
              </button>
              <button
                @click="goBack"
                class="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition font-medium"
              >
                ✅ 終了
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- キーボードショートカット表示 -->
      <div class="bg-gray-50 rounded-lg p-4 text-center">
        <p class="text-sm text-gray-600 mb-2">⌨️ キーボードショートカット</p>
        <div class="flex justify-center space-x-6 text-xs text-gray-500">
          <span><code class="bg-white px-2 py-1 rounded">Space</code> カードをめくる</span>
          <span><code class="bg-white px-2 py-1 rounded">←</code> 前へ</span>
          <span><code class="bg-white px-2 py-1 rounded">→</code> 次へ</span>
          <span><code class="bg-white px-2 py-1 rounded">1</code> 不正解</span>
          <span><code class="bg-white px-2 py-1 rounded">2</code> 正解</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useWords } from "~/composables/useWords";

const { words, loadWords, markMemorized, deleteWord } = useWords();

// 状態管理
const currentIndex = ref(0);
const isFlipped = ref(false);
const studyWords = ref<any[]>([]);
const correctCount = ref(0);
const incorrectCount = ref(0);
const incorrectWords = ref<any[]>([]);
const showSettings = ref(false);
const showCompletionModal = ref(false);
const studyStartTime = ref<Date>(new Date());

// 設定
const studyMode = ref<'word-to-meaning' | 'meaning-to-word' | 'mixed'>('word-to-meaning');
const autoFlipDelay = ref(0);
const studyFilter = ref<'all' | 'studying' | 'difficult' | 'recent'>('studying');

// 自動めくりのタイマー
let autoFlipTimer: NodeJS.Timeout | null = null;

// 現在の単語
const currentWord = computed(() => studyWords.value[currentIndex.value]);

// 進捗
const progress = computed(() => {
  if (studyWords.value.length === 0) return 0;
  return ((currentIndex.value + 1) / studyWords.value.length) * 100;
});

// 学習モードに応じた表示
const getCurrentMode = () => {
  if (studyMode.value === 'mixed') {
    return Math.random() > 0.5 ? 'word-to-meaning' : 'meaning-to-word';
  }
  return studyMode.value;
};

const getQuestionIcon = () => {
  const mode = getCurrentMode();
  return mode === 'word-to-meaning' ? '🇺🇸' : '🇯🇵';
};

const getAnswerIcon = () => {
  const mode = getCurrentMode();
  return mode === 'word-to-meaning' ? '🇯🇵' : '🇺🇸';
};

const getQuestionLabel = () => {
  const mode = getCurrentMode();
  return mode === 'word-to-meaning' ? '英語' : '日本語';
};

const getAnswerLabel = () => {
  const mode = getCurrentMode();
  return mode === 'word-to-meaning' ? '日本語' : '英語';
};

const getQuestionText = () => {
  if (!currentWord.value) return '';
  const mode = getCurrentMode();
  return mode === 'word-to-meaning' ? currentWord.value.text : currentWord.value.meaning;
};

const getAnswerText = () => {
  if (!currentWord.value) return '';
  const mode = getCurrentMode();
  return mode === 'word-to-meaning' ? currentWord.value.meaning : currentWord.value.text;
};

const getDifficultyStars = () => {
  if (!currentWord.value) return 1;
  const incorrectRate = currentWord.value.incorrectCount / Math.max(currentWord.value.studyCount || 1, 1);
  if (incorrectRate > 0.6) return 3; // 難しい
  if (incorrectRate > 0.3) return 2; // 普通
  return 1; // 簡単
};

// 学習データフィルタリング
const filterStudyWords = () => {
  let filtered = words.value;
  
  switch (studyFilter.value) {
    case 'studying':
      filtered = words.value.filter(word => !word.memorized);
      break;
    case 'difficult':
      filtered = words.value.filter(word => (word.incorrectCount || 0) > 0);
      break;
    case 'recent':
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      filtered = words.value.filter(word => 
        word.createdAt && new Date(word.createdAt) > threeDaysAgo
      );
      break;
    case 'all':
    default:
      filtered = words.value;
      break;
  }
  
  studyWords.value = [...filtered];
  if (studyWords.value.length === 0) {
    alert('条件に合う単語がありません');
    studyFilter.value = 'all';
    studyWords.value = [...words.value];
  }
  
  resetProgress();
};

// カードをめくる
const flipCard = () => {
  isFlipped.value = !isFlipped.value;
  
  if (!isFlipped.value && autoFlipDelay.value > 0) {
    startAutoFlipTimer();
  } else {
    clearAutoFlipTimer();
  }
};

// 自動めくりタイマー
const startAutoFlipTimer = () => {
  clearAutoFlipTimer();
  if (autoFlipDelay.value > 0) {
    autoFlipTimer = setTimeout(() => {
      if (!isFlipped.value) {
        flipCard();
      }
    }, autoFlipDelay.value);
  }
};

const clearAutoFlipTimer = () => {
  if (autoFlipTimer) {
    clearTimeout(autoFlipTimer);
    autoFlipTimer = null;
  }
};

// 答えをマーク
const markAnswer = async (isCorrect: boolean) => {
  if (isCorrect) {
    correctCount.value++;
  } else {
    incorrectCount.value++;
    incorrectWords.value.push(currentWord.value);
  }
  
  // データベースに学習結果を記録
  try {
    const wordRef = currentWord.value;
    const newStudyCount = (wordRef.studyCount || 0) + 1;
    const newCorrectCount = isCorrect ? (wordRef.correctCount || 0) + 1 : (wordRef.correctCount || 0);
    const newIncorrectCount = !isCorrect ? (wordRef.incorrectCount || 0) + 1 : (wordRef.incorrectCount || 0);
    
    // ローカルデータ更新
    wordRef.studyCount = newStudyCount;
    wordRef.correctCount = newCorrectCount;
    wordRef.incorrectCount = newIncorrectCount;
    
    // TODO: Firestoreに保存する処理を追加
    // await updateWord(wordRef.id, {
    //   studyCount: newStudyCount,
    //   correctCount: newCorrectCount,
    //   incorrectCount: newIncorrectCount
    // });
    
  } catch (error) {
    console.error('Error updating word stats:', error);
  }
  
  setTimeout(() => {
    nextCard();
  }, 500);
};

// カードナビゲーション
const nextCard = () => {
  if (currentIndex.value < studyWords.value.length - 1) {
    currentIndex.value++;
    isFlipped.value = false;
    clearAutoFlipTimer();
    if (autoFlipDelay.value > 0) {
      startAutoFlipTimer();
    }
  } else {
    showCompletionModal.value = true;
    clearAutoFlipTimer();
  }
};

const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    isFlipped.value = false;
    clearAutoFlipTimer();
    if (autoFlipDelay.value > 0) {
      startAutoFlipTimer();
    }
  }
};

// その他の機能
const shuffleCards = () => {
  for (let i = studyWords.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [studyWords.value[i], studyWords.value[j]] = [studyWords.value[j], studyWords.value[i]];
  }
  resetProgress();
};

const resetProgress = () => {
  currentIndex.value = 0;
  correctCount.value = 0;
  incorrectCount.value = 0;
  incorrectWords.value = [];
  isFlipped.value = false;
  showCompletionModal.value = false;
  studyStartTime.value = new Date();
  clearAutoFlipTimer();
  if (autoFlipDelay.value > 0) {
    startAutoFlipTimer();
  }
};

const toggleBookmark = async () => {
  if (!currentWord.value) return;
  
  try {
    const newStarred = !currentWord.value.starred;
    currentWord.value.starred = newStarred;
    
    // TODO: Firestoreに保存
    // await updateWord(currentWord.value.id, { starred: newStarred });
    
  } catch (error) {
    console.error('Error updating bookmark:', error);
  }
};

const markAllAsStudying = async () => {
  try {
    for (const word of words.value) {
      if (word.memorized) {
        await markMemorized(word.id);
      }
    }
    await loadWords();
    filterStudyWords();
  } catch (error) {
    console.error('Error marking all as studying:', error);
  }
};

// 学習完了関連
const getCompletionEmoji = () => {
  const accuracy = getAccuracyPercentage();
  if (accuracy >= 90) return '🏆';
  if (accuracy >= 70) return '🎉';
  if (accuracy >= 50) return '👍';
  return '💪';
};

const getAccuracyPercentage = () => {
  const total = correctCount.value + incorrectCount.value;
  return total > 0 ? Math.round((correctCount.value / total) * 100) : 0;
};

const getStudyTimeText = () => {
  const minutes = Math.floor((new Date().getTime() - studyStartTime.value.getTime()) / 60000);
  return minutes > 0 ? `${minutes}分` : '1分未満';
};

const restartStudy = () => {
  showCompletionModal.value = false;
  resetProgress();
};

const reviewMistakes = () => {
  showCompletionModal.value = false;
  studyWords.value = [...incorrectWords.value];
  resetProgress();
};

const goBack = () => {
  clearAutoFlipTimer();
  navigateTo('/');
};

// キーボード操作
const handleKeyPress = (event: KeyboardEvent) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault();
      if (isFlipped.value) {
        nextCard();
      } else {
        flipCard();
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      previousCard();
      break;
    case 'ArrowRight':
      event.preventDefault();
      nextCard();
      break;
    case '1':
      event.preventDefault();
      if (isFlipped.value) markAnswer(false);
      break;
    case '2':
      event.preventDefault();
      if (isFlipped.value) markAnswer(true);
      break;
    case 's':
      event.preventDefault();
      shuffleCards();
      break;
  }
};

// 初期化
onMounted(async () => {
  await loadWords();
  filterStudyWords();
  
  if (studyWords.value.length === 0) {
    alert('学習する単語がありません');
    goBack();
    return;
  }
  
  window.addEventListener('keydown', handleKeyPress);
  
  if (autoFlipDelay.value > 0) {
    startAutoFlipTimer();
  }
});

// 設定変更の監視
watch(autoFlipDelay, () => {
  clearAutoFlipTimer();
  if (!isFlipped.value && autoFlipDelay.value > 0) {
    startAutoFlipTimer();
  }
});

// クリーンアップ
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  clearAutoFlipTimer();
});
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>s