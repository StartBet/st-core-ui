<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAnglesRight,
  faBolt,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import { computed, normalizeClass, useAttrs, useSlots } from 'vue';

import type { StSuperOddsCardProps } from './StSuperOddsCard.interface';
import {
  buildSuperOddsCardClasses,
  formatSuperOddsDate,
  formatSuperOddsOdd,
  resolveSuperOddsAction,
  resolveSuperOddsSteps,
  ST_SUPER_ODDS_ACTIVE_LABEL,
  ST_SUPER_ODDS_BOOST_ICON,
  ST_SUPER_ODDS_HIGHLIGHT_ICON,
  ST_SUPER_ODDS_TYPE_ICON
} from './styleStSuperOddsCard';
import StAvatar from '../../components/avatars/avatar/StAvatar.vue';
import StButton from '../../components/buttons/button/StButton.vue';
import StBadge from '../../components/badge/StBadge.vue';
import StIcon from '../../components/icon/StIcon.vue';
import StStepper from '../../components/stepper/StStepper.vue';

defineOptions({ name: 'StSuperOddsCard', inheritAttrs: false });

library.add(faAnglesRight, faBolt, faFire);

const props = withDefaults(defineProps<StSuperOddsCardProps>(), {
  type: '',
  typeIcon: ST_SUPER_ODDS_TYPE_ICON,
  date: '',
  startDate: '',
  highlightIcon: ST_SUPER_ODDS_HIGHLIGHT_ICON,
  hideHighlight: false,
  competition: '',
  eventName: '',
  home: '',
  away: '',
  homeLogo: null,
  awayLogo: null,
  versusLabel: 'X',
  selections: () => [],
  price: undefined,
  boostedPrice: undefined,
  active: false,
  activeLabel: ST_SUPER_ODDS_ACTIVE_LABEL,
  disabled: false,
  actionAriaLabel: '',
  ariaLabel: '',
  className: ''
});

const emit = defineEmits<{ select: [] }>();

defineSlots<{
  type?: () => unknown;
  action?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const classes = computed(() =>
  buildSuperOddsCardClasses({
    disabled: props.disabled,
    className: props.className
  })
);

const rootClass = computed(() =>
  normalizeClass([classes.value.root, attrs.class])
);

const rootStyle = computed(() => attrs.style);

const rootAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

/** `date` ja formatada vence; senao o componente formata o ISO recebido. */
const formattedDate = computed(
  () => props.date || formatSuperOddsDate(props.startDate)
);

const steps = computed(() => resolveSuperOddsSteps(props.selections));

const hasTeams = computed(() => Boolean(props.home && props.away));

const oldOdd = computed(() =>
  props.boostedPrice !== undefined && props.boostedPrice !== null
    ? formatSuperOddsOdd(props.price)
    : ''
);

const mainOdd = computed(() =>
  formatSuperOddsOdd(props.boostedPrice ?? props.price)
);

/** `outline`/`primary` fora do bilhete, `solid`/`secondary` dentro dele. */
const action = computed(() => resolveSuperOddsAction(props.active));

const hasType = computed(() => Boolean(props.type) || Boolean(slots.type));

const cardLabel = computed(
  () =>
    props.ariaLabel ||
    (hasTeams.value ? `${props.home} x ${props.away}` : props.eventName) ||
    undefined
);

const onSelect = () => {
  if (props.disabled) return;

  emit('select');
};
</script>

<template>
  <article
    :class="rootClass"
    :style="rootStyle"
    :aria-label="cardLabel"
    data-st-super-odds-card
    v-bind="rootAttrs"
  >
    <header :class="classes.header">
      <span v-if="hasType" :class="classes.typeBadge" data-st-super-odds-type>
        <slot name="type">
          <StIcon
            v-if="props.typeIcon"
            :name="props.typeIcon"
            :size="1"
            aria-hidden="true"
          />
          {{ props.type }}
        </slot>
      </span>
      <span v-else />

      <span :class="classes.headerEnd">
        <StBadge
          v-if="props.active"
          variant="positive"
          pulse
          role="img"
          :aria-label="props.activeLabel"
          data-st-super-odds-active
        />

        <span
          v-if="formattedDate"
          :class="classes.date"
          data-st-super-odds-date
        >
          {{ formattedDate }}
        </span>

        <StIcon
          v-if="!props.hideHighlight && props.highlightIcon"
          :name="props.highlightIcon"
          :size="2"
          :class="classes.highlightIcon"
          aria-hidden="true"
          data-st-super-odds-highlight
        />
      </span>
    </header>

    <div :class="classes.body">
      <span
        v-if="props.competition"
        :class="classes.competition"
        data-st-super-odds-competition
      >
        {{ props.competition }}
      </span>

      <div v-if="hasTeams" :class="classes.teams" data-st-super-odds-teams>
        <span :class="classes.teamNameHome">{{ props.home }}</span>

        <StAvatar
          :src="props.homeLogo ?? ''"
          :name="props.home"
          size="small"
          fit="contain"
        />

        <span :class="classes.versus">{{ props.versusLabel }}</span>

        <StAvatar
          :src="props.awayLogo ?? ''"
          :name="props.away"
          size="small"
          fit="contain"
        />

        <span :class="classes.teamNameAway">{{ props.away }}</span>
      </div>

      <span
        v-else-if="props.eventName"
        :class="classes.eventName"
        data-st-super-odds-event
      >
        {{ props.eventName }}
      </span>

      <span v-if="steps.length > 0" :class="classes.divider" />

      <StStepper
        v-if="steps.length > 0"
        :steps="steps"
        orientation="vertical"
        size="small"
        variant="secondary"
        :interactive="false"
        data-st-super-odds-selections
      />

      <span :class="classes.footerDivider" />

      <slot name="action">
        <StButton
          :variant="action.variant"
          :color="action.color"
          full-width
          :disabled="props.disabled"
          :aria-label="props.actionAriaLabel || undefined"
          data-st-super-odds-action
          @click="onSelect"
        >
          <span :class="classes.action">
            <span v-if="oldOdd" :class="classes.oldOdd">{{ oldOdd }}</span>

            <StIcon
              v-if="oldOdd"
              :name="ST_SUPER_ODDS_BOOST_ICON"
              :size="2"
              :class="classes.boostIcon"
              aria-hidden="true"
            />

            <span :class="classes.newOdd">{{ mainOdd }}</span>
          </span>
        </StButton>
      </slot>
    </div>
  </article>
</template>
