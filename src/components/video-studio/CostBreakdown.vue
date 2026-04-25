<template>
  <div class="ledger-card">
    <div class="ledger-head">
      <span class="ledger-num">∑</span>
      <span class="ledger-tag">Ledger · this take</span>
    </div>

    <dl class="ledger-rows">
      <div v-for="step in steps" :key="step.id" class="ledger-row">
        <dt class="ledger-label">{{ step.label }}</dt>
        <dd class="ledger-amount">${{ step.costUsd.toFixed(3) }}</dd>
      </div>
    </dl>

    <div class="ledger-total">
      <span class="total-label">Total</span>
      <span class="total-amount">
        <span class="total-currency">$</span>{{ totalCostUsd.toFixed(3) }}
      </span>
    </div>

    <div class="ledger-compare">
      <div class="compare-tag">vs ${{ subscriptionMonthly }}/mo subscription</div>
      <p class="compare-line">
        Pay <strong>${{ totalCostUsd.toFixed(3) }}</strong> instead of
        ${{ (subscriptionMonthly / 30).toFixed(2) }}/day —
        <em class="savings-highlight">{{ savingsPercent }}% lighter per take.</em>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { IPipelineStep } from '@/models';
import { SUBSCRIPTION_MONTHLY_USD } from '@/constants/videoStudio';

export default defineComponent({
  name: 'CostBreakdown',
  props: {
    steps: {
      type: Array as PropType<IPipelineStep[]>,
      required: true
    },
    totalCostUsd: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const subscriptionMonthly = SUBSCRIPTION_MONTHLY_USD;
    const savingsPercent = computed(() => {
      const dailyCost = SUBSCRIPTION_MONTHLY_USD / 30;
      if (dailyCost <= 0) return 0;
      return Math.round(((dailyCost - props.totalCostUsd) / dailyCost) * 100);
    });
    return { subscriptionMonthly, savingsPercent };
  }
});
</script>

<style scoped lang="scss">
.ledger-card {
  padding: 22px;
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
}

.ledger-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--vx-rule);
}
.ledger-num { color: var(--vx-ember); font-size: 14px; }
.ledger-tag { color: var(--vx-ash); }

.ledger-rows {
  display: flex;
  flex-direction: column;
  margin: 0 0 18px 0;
}

.ledger-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px dotted var(--vx-rule);

  &:last-child { border-bottom: 0; }
}

.ledger-label {
  font-family: var(--vx-font-sans);
  font-size: 13px;
  color: var(--vx-bone-soft);
  position: relative;

  /* leader dots between label and amount */
  &::after {
    content: '';
    flex: 1;
  }
}

.ledger-amount {
  font-family: var(--vx-font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--vx-bone);
  margin: 0;
}

.ledger-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 14px 0;
  border-top: 1px double var(--vx-rule-strong);
  border-bottom: 1px solid var(--vx-rule);
  margin-bottom: 18px;
}

.total-label {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
}

.total-amount {
  font-family: var(--vx-font-display);
  font-weight: 400;
  font-size: 32px;
  letter-spacing: -0.02em;
  color: var(--vx-bone);
  font-variation-settings: 'opsz' 36;
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}
.total-currency {
  font-style: italic;
  color: var(--vx-ember);
  font-size: 22px;
  margin-right: 1px;
}

.ledger-compare {
  background: rgba(255, 122, 69, 0.04);
  border-left: 1px solid var(--vx-ember);
  padding: 12px 14px;
}

.compare-tag {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--vx-ash);
  margin-bottom: 6px;
}

.compare-line {
  font-family: var(--vx-font-sans);
  font-size: 12px;
  line-height: 1.6;
  color: var(--vx-bone-soft);
  margin: 0;

  strong { color: var(--vx-bone); font-weight: 500; }
}

.savings-highlight {
  font-family: var(--vx-font-display);
  font-style: italic;
  color: var(--vx-ember);
  font-size: 13px;
  font-variation-settings: 'opsz' 14;
}
</style>
