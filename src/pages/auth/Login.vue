<script lang="ts">
import { defineComponent } from 'vue';
import { credentialOperator } from '@/operators';
import { ROUTE_AUTH_TOKENS } from '@/router/constants';

interface IData {
  redirect: string | undefined;
}

export default defineComponent({
  name: 'AuthLogin',
  data(): IData {
    return {
      redirect: this.$route.query.redirect?.toString()
    };
  },
  async mounted() {
    if (!!this.$store.state.token.access) {
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
        } else {
          await this.$router.push(this.redirect || '/');
        }
      } catch (error) {
        await this.$router.push(this.redirect || '/');
      }
    } else {
      this.$store.dispatch('login');
    }
  }
});
</script>
