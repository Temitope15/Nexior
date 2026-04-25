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
        </div>
        <div class="key-actions">
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener" class="key-action">
            <span class="key-action-icon">+</span>
            <span class="key-action-label">Get a key</span>
            <span class="key-action-arrow">↗</span>
          </a>
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener" class="key-action key-action--accent">
            <span class="key-action-icon">$</span>
            <span class="key-action-label">Top up credits</span>
            <span class="key-action-arrow">↗</span>
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
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 220ms ease;
  &:hover { border-color: var(--vx-rule-strong); }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
  transition: background 200ms ease;
  &:hover { background: rgba(255, 122, 69, 0.04); }
}

.panel-title {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
  &::before {
    content: '◇ ';
    color: var(--vx-ember);
    margin-right: 4px;
  }
}

.panel-chevron {
  color: var(--vx-ash-deep);
  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1), color 220ms ease;

  &--open {
    transform: rotate(180deg);
    color: var(--vx-ember);
  }
}

.panel-body {
  padding: 0 18px 18px;
}

.field-group { margin-bottom: 14px; }

.field-label {
  display: block;
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  gap: 8px;
}

.key-input {
  flex: 1;
  background: var(--vx-ink);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  padding: 10px 12px;
  font-size: 12px;
  font-family: var(--vx-font-mono);
  color: var(--vx-bone);
  outline: none;
  transition: border-color 200ms ease;
  letter-spacing: 0.02em;

  &::placeholder { color: var(--vx-ash-deep); }
  &:focus { border-color: var(--vx-ember); }
}

.toggle-btn {
  background: var(--vx-ink);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  padding: 10px;
  color: var(--vx-ash);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 200ms ease, border-color 200ms ease;

  &:hover { color: var(--vx-ember); border-color: var(--vx-ember); }
}

.field-hint {
  font-family: var(--vx-font-sans);
  font-size: 11px;
  color: var(--vx-ash);
  margin-top: 8px;
  line-height: 1.6;
}

.hint-link {
  color: var(--vx-ember);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 180ms ease;
  &:hover { border-bottom-color: var(--vx-ember); }
}

/* Key actions: row of two compact ledger-style links */
.key-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 10px;
}
.key-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  text-decoration: none;
  background: var(--vx-ink);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  font-family: var(--vx-font-sans);
  font-size: 12px;
  color: var(--vx-bone-soft);
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease;
  &:hover {
    color: var(--vx-ember);
    border-color: var(--vx-ember);
  }
}
.key-action--accent {
  background: rgba(255, 122, 69, 0.06);
  border-color: rgba(255, 122, 69, 0.4);
  color: var(--vx-ember);
  &:hover {
    background: var(--vx-ember);
    color: var(--vx-ink);
    border-color: var(--vx-ember);
  }
}
.key-action-icon {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: currentColor;
  flex-shrink: 0;
}
.key-action-label { flex: 1; letter-spacing: 0.005em; }
.key-action-arrow {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  opacity: 0.7;
  transition: transform 200ms ease, opacity 200ms ease;
}
.key-action:hover .key-action-arrow { transform: translateX(2px); opacity: 1; }
@media (max-width: 540px) {
  .key-actions { grid-template-columns: 1fr; }
}

.save-row { margin-bottom: 14px; }

.save-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--vx-font-sans);
  font-size: 12px;
  color: var(--vx-bone-soft);
  cursor: pointer;
}

.save-checkbox { accent-color: var(--vx-ember); }

.divider {
  height: 1px;
  background: var(--vx-rule);
  margin-bottom: 16px;
}

.wallet-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wallet-title {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
  &::before {
    content: '◈ ';
    color: var(--vx-ember);
    margin-right: 4px;
  }
}

.wallet-description {
  font-family: var(--vx-font-sans);
  font-size: 11px;
  color: var(--vx-ash);
  line-height: 1.6;
}

.wallet-btn-row {
  :deep(.wallet-adapter-button) {
    background: var(--vx-ink) !important;
    border: 1px solid var(--vx-rule-strong) !important;
    border-radius: 2px !important;
    font-family: var(--vx-font-sans) !important;
    font-size: 12px !important;
    padding: 10px 14px !important;
    color: var(--vx-bone) !important;
    height: auto !important;
    transition: border-color 200ms ease, color 200ms ease !important;

    &:hover {
      border-color: var(--vx-ember) !important;
      color: var(--vx-ember) !important;
      background: var(--vx-ink) !important;
    }
  }
}

.wallet-address {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  padding-top: 4px;
}

.wallet-address-label {
  color: var(--vx-ash);
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.18em;
}

.wallet-address-value {
  color: var(--vx-ok);
}
</style>
