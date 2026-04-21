<template>
  <div class="provider-token">
    <el-input
      v-model="token"
      placeholder="Enter custom API token (optional)"
      class="token-input"
      clearable
      @change="onTokenChange"
    />
    <p class="settings-tip mt-2">Override the default service token with your own API key to bypass platform limits.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElInput } from 'element-plus';

export default defineComponent({
  name: 'ProviderToken',
  components: {
    ElInput
  },
  computed: {
    token: {
      get() {
        return this.$store.state.token?.provider_token || '';
      },
      set(value: string) {
        this.$store.commit('setProviderToken', value);
      }
    }
  },
  methods: {
    onTokenChange(value: string) {
      console.debug('Provider token changed', value);
      this.$store.commit('setProviderToken', value);
    }
  }
});
</script>

<style lang="scss" scoped>
.provider-token {
  width: 100%;
}
.token-input {
  width: 100%;
}
</style>
