<template>
  <div class="api-key-panel">
    <div class="panel-header" @click="expanded = !expanded">
      <span class="panel-title">API Credentials</span>
      <span class="panel-chevron" :class="{ 'panel-chevron--open': expanded }">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>

    <div v-show="expanded" class="panel-body">
      <div class="field-group">
        <label class="field-label">Ace Data Cloud API Key</label>
        <div class="input-row">
          <input
            :type="showKey ? 'text' : 'password'"
            class="key-input"
            :value="modelValue"
            placeholder="sk-acedata-..."
            @input="onInput"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="toggle-btn" @click="showKey = !showKey" type="button">
            <svg v-if="showKey" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div class="field-hint">
          Your key is used only for API calls. It is never sent to our servers.
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener" class="hint-link">
            Get a key &rarr;
          </a>
        </div>
      </div>

      <div class="save-row">
        <label class="save-label">
          <input type="checkbox" v-model="saveLocally" class="save-checkbox" />
          <span>Remember in this browser</span>
        </label>
      </div>

      <div class="divider" />

      <div class="wallet-section">
        <div class="wallet-title">Pay with Solana (x402)</div>
        <div class="wallet-description">
          Connect a wallet to pay per-generation via x402 protocol instead of using an API key.
        </div>
        <div class="wallet-btn-row">
          <wallet-multi-button class="wallet-btn" />
        </div>
        <div v-if="walletAddress" class="wallet-address">
          <span class="wallet-address-label">Connected:</span>
          <span class="wallet-address-value">{{ shortAddress }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { WalletMultiButton } from 'solana-wallets-vue';

const STORAGE_KEY = 'vs_api_key';

export default defineComponent({
  name: 'ApiKeyPanel',
  components: { WalletMultiButton },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'wallet-address'],
  setup(props, { emit }) {
    const expanded = ref(true);
    const showKey = ref(false);
    const saveLocally = ref(!!localStorage.getItem(STORAGE_KEY));

    const { publicKey } = useWallet();
    const walletAddress = computed(() => publicKey.value?.toBase58() ?? null);
    const shortAddress = computed(() => {
      const addr = walletAddress.value;
      if (!addr) return '';
      return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
    });

    watch(walletAddress, (addr) => {
      emit('wallet-address', addr);
    });

    watch(saveLocally, (save) => {
      if (save && props.modelValue) {
        localStorage.setItem(STORAGE_KEY, props.modelValue);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    const onInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      emit('update:modelValue', value);
      if (saveLocally.value) {
        localStorage.setItem(STORAGE_KEY, value);
      }
    };

    const loadedKey = localStorage.getItem(STORAGE_KEY);
    if (loadedKey && !props.modelValue) {
      emit('update:modelValue', loadedKey);
    }

    return { expanded, showKey, saveLocally, walletAddress, shortAddress, onInput };
  }
});
</script>

<style scoped lang="scss">
.api-key-panel {
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;

  &:hover { background: #161616; }
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #888;
}

.panel-chevron {
  color: #555;
  transition: transform 0.2s;

  &--open { transform: rotate(180deg); }
}

.panel-body {
  padding: 0 16px 16px;
}

.field-group {
  margin-bottom: 10px;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}

.input-row {
  display: flex;
  gap: 8px;
}

.key-input {
  flex: 1;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #e5e5e5;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: #444; }
  &:focus { border-color: #0070f3; }
}

.toggle-btn {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 8px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover { color: #888; border-color: #444; }
}

.field-hint {
  font-size: 11px;
  color: #444;
  margin-top: 6px;
  line-height: 1.4;
}

.hint-link {
  color: #0070f3;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}

.save-row {
  margin-bottom: 12px;
}

.save-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}

.save-checkbox {
  accent-color: #0070f3;
}

.divider {
  height: 1px;
  background: #1a1a1a;
  margin-bottom: 14px;
}

.wallet-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wallet-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #555;
}

.wallet-description {
  font-size: 11px;
  color: #444;
  line-height: 1.5;
}

.wallet-btn-row {
  :deep(.wallet-adapter-button) {
    background: #0a0a0a !important;
    border: 1px solid #333 !important;
    border-radius: 6px !important;
    font-size: 12px !important;
    padding: 8px 12px !important;
    color: #e5e5e5 !important;
    height: auto !important;

    &:hover {
      background: #111 !important;
      border-color: #444 !important;
    }
  }
}

.wallet-address {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.wallet-address-label { color: #555; }

.wallet-address-value {
  font-family: 'JetBrains Mono', monospace;
  color: #00d084;
}
</style>
