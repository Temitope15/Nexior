<script lang="ts">
import { defineComponent } from 'vue';
import { credentialOperator } from '@/operators';
import { ROUTE_AUTH_TOKENS } from '@/router/constants';

interface IData {
  redirect: string | undefined;
}

export default defineComponent({
  name: 'AuthCallback',
  data(): IData {
    return {
      redirect: this.$route.query.redirect?.toString()
    };
  },
  async mounted() {
    // Check if user has any credentials
    try {
      const { data } = await credentialOperator.getAll({
        user_id: this.$store.getters.user?.id,
        limit: 1
      });

      if (data.items.length === 0) {
        await this.$router.push({
          name: ROUTE_AUTH_TOKENS,
          query: { redirect: this.redirect }
        });
      } else if (this.redirect) {
        await this.$router.push(this.redirect);
      } else {
        await this.$router.push('/');
      }
    } catch (error) {
      console.error('Failed to check credentials:', error);
      if (this.redirect) {
        await this.$router.push(this.redirect);
      } else {
        await this.$router.push('/');
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.panel {
  .title {
    text-align: center;
    font-size: 22px;
  }
}
</style>
