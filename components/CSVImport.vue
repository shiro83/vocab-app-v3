<template>
  <div>
    <!-- インポートボタン -->
    <button
      @click="showModal = true"
      class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
    >
      <span>📁</span>
      <span>CSVから単語をインポート</span>
    </button>

    <!-- モーダル -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- ヘッダー -->
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold flex items-center space-x-2">
            <span>📄</span>
            <span>CSV単語インポート</span>
          </h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-if="!importResults">
            <!-- 説明とサンプル -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 class="font-medium text-blue-800 mb-2">📝 CSVファイル形式</h3>
              <p class="text-blue-700 text-sm mb-3">
                1行目: ヘッダー（英単語,日本語意味）<br />
                2行目以降: データ行（単語,意味）
              </p>
              <button
                @click="downloadSample"
                class="text-blue-600 hover:text-blue-800 underline text-sm flex items-center space-x-1"
              >
                <span>⬇️</span>
                <span>サンプルCSVをダウンロード</span>
              </button>
            </div>

            <!-- ファイル選択 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                CSVファイルを選択
              </label>
              <input
                ref="fileInput"
                type="file"
                accept=".csv"
                @change="handleFileSelect"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <!-- エラー表示 -->
            <div
              v-if="errors.length > 0"
              class="mb-6 p-4 bg-red-50 rounded-lg"
            >
              <h3 class="font-medium text-red-800 mb-2 flex items-center space-x-2">
                <span>⚠️</span>
                <span>エラー ({{ errors.length }}件)</span>
              </h3>
              <ul class="text-red-700 text-sm space-y-1">
                <li v-for="(error, index) in errors" :key="index">
                  • {{ error }}
                </li>
              </ul>
            </div>

            <!-- プレビュー -->
            <div v-if="preview.length > 0" class="mb-6">
              <h3 class="font-medium text-gray-800 mb-3">
                📋 プレビュー ({{ preview.length }}件の単語)
              </h3>
              <div class="max-h-64 overflow-y-auto border rounded-lg">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="px-4 py-2 text-left">英単語</th>
                      <th class="px-4 py-2 text-left">日本語意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(word, index) in previewSliced"
                      :key="word.id"
                      class="border-t"
                    >
                      <td class="px-4 py-2 font-medium">{{ word.text }}</td>
                      <td class="px-4 py-2">{{ word.meaning }}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="preview.length > 50"
                  class="p-2 text-center text-gray-500 text-sm bg-gray-50"
                >
                  他 {{ preview.length - 50 }} 件...
                </div>
              </div>
            </div>

            <!-- アクション -->
            <div class="flex justify-end space-x-3">
              <button
                @click="resetImport"
                :disabled="!file"
                class="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                リセット
              </button>
              <button
                @click="executeImport"
                :disabled="preview.length === 0 || isProcessing"
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <div
                  v-if="isProcessing"
                  class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                ></div>
                <span v-if="isProcessing">処理中...</span>
                <template v-else>
                  <span>✅</span>
                  <span>インポート実行</span>
                </template>
              </button>
            </div>
          </div>

          <!-- 結果表示 -->
          <div v-else class="text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-xl font-semibold text-green-600 mb-4">
              インポート完了！
            </h3>
            <div class="bg-green-50 p-6 rounded-lg mb-6">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-green-600">
                    {{ importResults.success }}
                  </div>
                  <div class="text-sm text-green-700">成功</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-red-600">
                    {{ importResults.failed }}
                  </div>
                  <div class="text-sm text-red-700">失敗</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-blue-600">
                    {{ importResults.total }}
                  </div>
                  <div class="text-sm text-blue-700">合計</div>
                </div>
              </div>
            </div>
            <button
              @click="closeModal"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props and Emits
const emit = defineEmits<{
  'words-imported': [words: any[]]
}>()

// Reactive data
const showModal = ref(false)
const file = ref<File | null>(null)
const preview = ref<any[]>([])
const errors = ref<string[]>([])
const isProcessing = ref(false)
const importResults = ref<any>(null)
const fileInput = ref<HTMLInputElement>()

// Computed
const previewSliced = computed(() => preview.value.slice(0, 50))

// サンプルCSVデータ
const sampleCSV = `英単語,日本語意味
apple,りんご
book,本
cat,猫
dog,犬
elephant,象`

// ファイル選択処理
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  
  if (selectedFile && selectedFile.type === 'text/csv') {
    file.value = selectedFile
    parseCSV(selectedFile)
  } else {
    alert('CSVファイルを選択してください')
  }
}

// CSV解析
const parseCSV = (file: File) => {
  isProcessing.value = true
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const csv = e.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        errors.value = ['CSVファイルにデータが不足しています']
        preview.value = []
        isProcessing.value = false
        return
      }

      // ヘッダー行をスキップして解析
      const dataLines = lines.slice(1)
      const parsedData: any[] = []
      const parseErrors: string[] = []

      dataLines.forEach((line, index) => {
        const columns = parseCSVLine(line)
        
        if (columns.length < 2) {
          parseErrors.push(`${index + 2}行目: 英単語と意味の両方が必要です`)
          return
        }

        const [text, meaning] = columns
        
        if (!text.trim() || !meaning.trim()) {
          parseErrors.push(`${index + 2}行目: 空の値があります`)
          return
        }

        parsedData.push({
          id: `temp-${index}`,
          text: text.trim(),
          meaning: meaning.trim(),
          memorized: false,
          createdAt: new Date().toISOString()
        })
      })

      preview.value = parsedData
      errors.value = parseErrors
      isProcessing.value = false
    } catch (error) {
      errors.value = ['CSVファイルの解析に失敗しました']
      preview.value = []
      isProcessing.value = false
    }
  }

  reader.readAsText(file, 'UTF-8')
}

// CSV行解析（カンマとクオートに対応）
const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

// インポート実行
const executeImport = async () => {
  if (preview.value.length === 0) return

  isProcessing.value = true
  
  try {
    // 親コンポーネントに単語データを送信して実際に登録
    await emit('words-imported', preview.value)
    
    const results = {
      success: preview.value.length,
      failed: 0,
      total: preview.value.length
    }
    
    importResults.value = results
  } catch (error) {
    console.error('インポートエラー:', error)
    const results = {
      success: 0,
      failed: preview.value.length,
      total: preview.value.length
    }
    importResults.value = results
  } finally {
    isProcessing.value = false
  }
}

// リセット
const resetImport = () => {
  file.value = null
  preview.value = []
  errors.value = []
  importResults.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// モーダルを閉じる
const closeModal = () => {
  showModal.value = false
  resetImport()
}

// サンプルCSVダウンロード
const downloadSample = () => {
  const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'sample_words.csv'
  link.click()
}
</script>