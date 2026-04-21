<template>
  <div class="settings-list">
    <section class="settings-item">
      <div class="settings-label">
        <p class="settings-title">{{ $t('common.settings.theme') }}</p>
      </div>
      <div class="settings-content">
        <theme-switcher />
      </div>
    </section>
    <section class="settings-item">
      <div class="settings-label">
        <p class="settings-title">{{ $t('common.settings.language') }}</p>
      </div>
      <div class="settings-content">
        <locale-switcher />
      </div>
    </section>
    <section class="settings-item">
      <div class="settings-label">
        <p class="settings-title">Custom API Token</p>
        <p class="settings-tip">Override the default service token with your own API key to bypass platform limits.</p>
      </div>
      <div class="settings-content">
        <provider-token />
      </div>
    </section>
    <section class="settings-item">
      <div class="settings-label">
        <p class="settings-title">{{ $t('common.settings.github') }}</p>
      </div>
      <div class="settings-content">
        <a href="https://github.com/AceDataCloud/Nexior" target="_blank" rel="noopener noreferrer" class="github-link">
          <font-awesome-icon :icon="faGithub" class="icon" />
        </a>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import ThemeSwitcher from '@/components/user/Theme.vue';
import LocaleSwitcher from '@/components/user/Locale.vue';
import ProviderToken from '@/components/user/ProviderToken.vue';

export default defineComponent({
  name: 'GeneralSettings',
  components: {
    ThemeSwitcher,
    LocaleSwitcher,
    ProviderToken,
    FontAwesomeIcon
  },
  data() {
    return {
      faGithub
    };
  }
});
</script>

<style lang="scss" scoped>
.github-link {
  display: inline-flex;
  align-items: center;
  color: var(--el-text-color-regular);
  text-decoration: none;
  transition: color 0.3s;

  .icon {
    font-size: 18px;
  }

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
