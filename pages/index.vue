<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white"
  >
    <h1 class="text-4xl font-bold">🎉 Tailwind CSS OK</h1>
  </div>
  <div class="text-3xl text-blue-500 font-bold">Tailwind テスト</div>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">📘 単語暗記帳</h1>

    <div v-if="user">
      <p>👋 {{ user.name }} さん</p>
      <img
        :src="user.photoURL"
        alt="User Photo"
        class="w-16 h-16 rounded-full mt-2"
      />
      <button
        @click="logout"
        class="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        ログアウト
      </button>
    </div>

    <div v-else>
      <button @click="login" class="px-4 py-2 bg-blue-500 text-white rounded">
        Googleでログイン
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

const { user, login, logout } = useAuth();
</script>

<style scoped>
img {
  border: 2px solid #ccc;
}
</style>
