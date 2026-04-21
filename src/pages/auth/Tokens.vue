<template>
  <div class="tokens-container">
    <el-card class="tokens-card" shadow="always">
      <div class="header">
        <el-image :src="site?.logo" class="logo" fit="contain" />
        <h2 class="title">{{ $t('auth.title.setupApi') }}</h2>
        <p class="subtitle">{{ $t('auth.subtitle.setupApi') }}</p>
      </div>

      <el-form :model="form" @submit.prevent="onConfirm">
        <el-form-item>
          <el-input
            v-model="form.token"
            :placeholder="$t('auth.placeholder.apiToken')"
            size="large"
            prefix-icon="fa-solid fa-key"
            clearable
          />
        </el-form-item>

        <div class="tip-box">
          <p class="tip">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-2" />
            {{ $t('auth.message.tokenTip') }}
          </p>
        </div>

        <el-button type="primary" size="large" class="w-full mt-4" :loading="loading" @click="onConfirm">
          {{ $t('auth.button.continueToStudio') }}
        </el-button>
      </el-form>

      <div class="footer">
        <p>
          {{ $t('auth.message.noToken') }}
          <a :href="baseUrlPlatform" target="_blank" class="link">
            {{ $t('auth.link.getOne') }}
          </a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElImage, ElMessage } from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getBaseUrlPlatform } from '@/utils';
import { credentialOperator } from '@/operators';
import { ICredentialType } from '@/models';

export default defineComponent({
  name: 'AuthTokens',
  components: {
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElImage,
    FontAwesomeIcon
  },
  data() {
    return {
      loading: false,
      form: {
        token: ''
      }
    };
  },
  computed: {
    site() {
      return this.$store.getters.site;
    },
    baseUrlPlatform() {
      return getBaseUrlPlatform();
    }
  },
  methods: {
    async onConfirm() {
      if (!this.form.token) {
        ElMessage.warning(this.$t('auth.message.tokenRequired'));
        return;
      }

      this.loading = true;
      try {
        // Create a default credential with the provided token
        // We'll use a placeholder application ID or handle it in the backend
        // For this app, usually we create a credential for the user's global application
        const applications = await this.$store.dispatch('getApplications');
        const globalApp = applications?.find((app: any) => app.scope === 'Global');

        if (!globalApp) {
          throw new Error('No global application found');
        }

        await credentialOperator.create({
          application_id: globalApp.id,
          token: this.form.token,
          type: ICredentialType.TOKEN,
          name: 'Default Token'
        });

        ElMessage.success(this.$t('auth.message.setupSuccess'));
        this.$router.push('/studio');
      } catch (error: any) {
        console.error('Failed to setup token:', error);
        ElMessage.error(error.message || this.$t('auth.message.setupFailed'));
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.tokens-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.tokens-card {
  width: 100%;
  max-width: 480px;
  border-radius: 20px;
  padding: 30px 20px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  .header {
    text-align: center;
    margin-bottom: 30px;

    .logo {
      height: 60px;
      margin-bottom: 20px;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .tip-box {
    background: var(--el-fill-color-light);
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 20px;

    .tip {
      font-size: 13px;
      color: var(--el-text-color-regular);
      line-height: 1.5;
    }
  }

  .footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    .link {
      color: var(--el-color-primary);
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 8px 15px;
}

:deep(.el-button--large) {
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
}
</style>
