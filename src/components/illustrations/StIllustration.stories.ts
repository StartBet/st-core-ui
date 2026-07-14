import type { Meta, StoryObj } from '@storybook/vue3';

import StIllustration from './StIllustration.vue';

const illustrationCategories = {
  arrows: [
    'arrows/chip_3d',
    'arrows/chip_angled',
    'arrows/chip_front',
    'arrows/chip_side',
    'arrows/circular_arrow_01',
    'arrows/circular_arrow_02',
    'arrows/circular_arrow_03',
    'arrows/circular_arrow_04',
    'arrows/play_button'
  ],
  balls: [
    'balls/basketball_01',
    'balls/basketball_02',
    'balls/basketball_03',
    'balls/soccer_ball_01',
    'balls/soccer_ball_02',
    'balls/soccer_ball_green'
  ],
  brands: [
    'brands/cash_days',
    'brands/cash_days_02',
    'brands/cash_days_carnival',
    'brands/cash_days_christmas',
    'brands/fortune_cup',
    'brands/illustrated_symbol',
    'brands/logo_dark',
    'brands/logo_fav-dark-1',
    'brands/logo_fav-dark',
    'brands/logo_icon_green',
    'brands/logo_icon_purple',
    'brands/logo_icon_white',
    'brands/logo_light',
    'brands/lucky_spins_carnival',
    'brands/open_and_win',
    'brands/private_club',
    'brands/purple_days',
    'brands/purple_odd_01',
    'brands/purple_wave',
    'brands/roulette_start_logo',
    'brands/saturday_start',
    'brands/scratch_card_maumau',
    'brands/scratch_card_start',
    'brands/scratch_card_start_logo',
    'brands/spin_and_win',
    'brands/star_tv',
    'brands/stv',
    'brands/sweet_sunday',
    'brands/thursday_spin_01'
  ],
  casino: [
    'casino/biplane_01',
    'casino/biplane_02',
    'casino/biplane_03',
    'casino/casino_table_scene',
    'casino/classic_airplane',
    'casino/green_dice',
    'casino/green_poker_chip',
    'casino/green_slot_machine',
    'casino/horizontal_slot_machine',
    'casino/poker_table_3d',
    'casino/poker_table_players',
    'casino/purple_dice',
    'casino/purple_poker_chip',
    'casino/purple_slot_machine',
    'casino/roulette_money',
    'casino/roulette_perspective',
    'casino/roulette_top'
  ],
  characters: [
    'characters/basketball_player_01',
    'characters/basketball_player_02',
    'characters/basketball_player_03',
    'characters/basketball_player_04',
    'characters/basketball_player_05',
    'characters/basketball_player_06',
    'characters/basketball_player_07',
    'characters/basketball_player_08',
    'characters/basketball_player_09',
    'characters/basketball_player_10',
    'characters/basketball_player_11',
    'characters/basketball_player_12',
    'characters/basketball_player_13',
    'characters/basketball_player_dribble',
    'characters/bull_head_happy',
    'characters/bull_head_sunglasses',
    'characters/dragon_head_furious',
    'characters/dragon_head_happy',
    'characters/dragon_head_nervous',
    'characters/dragon_head_sunglasses',
    'characters/fan_01',
    'characters/fan_02',
    'characters/fan_03',
    'characters/fan_04',
    'characters/fan_05',
    'characters/fan_06',
    'characters/fan_07',
    'characters/female_badminton_player_01',
    'characters/female_badminton_player_02',
    'characters/female_badminton_player_03',
    'characters/female_tennis_player_01',
    'characters/female_tennis_player_02',
    'characters/female_tennis_player_03',
    'characters/female_tennis_player_04',
    'characters/female_tennis_player_05',
    'characters/football_player_01',
    'characters/football_player_02',
    'characters/football_player_03',
    'characters/football_player_04',
    'characters/formula_1_driver_01',
    'characters/formula_1_driver_02',
    'characters/formula_1_driver_03',
    'characters/formula_1_driver_04',
    'characters/formula_1_driver_05',
    'characters/formula_1_driver_06',
    'characters/formula_1_driver_07',
    'characters/formula_1_driver_08',
    'characters/formula_1_flags',
    'characters/formula_1_helmet',
    'characters/formula_1_steering_wheel',
    'characters/fortune_rabbit',
    'characters/fortune_rat',
    'characters/fortune_tiger',
    'characters/goalkeeper_save',
    'characters/lumberjack_head_beanie',
    'characters/male_tennis_player_01',
    'characters/male_tennis_player_02',
    'characters/male_tennis_player_03',
    'characters/male_tennis_player_04',
    'characters/male_tennis_player_05',
    'characters/mobile_bettor',
    'characters/monkey_head_cap',
    'characters/mouse_head_happy',
    'characters/mouse_head_laughing',
    'characters/rabbit_head_cap',
    'characters/runner_01',
    'characters/snake_head_cap',
    'characters/soccer_player_01',
    'characters/soccer_player_02',
    'characters/soccer_player_03',
    'characters/soccer_player_04',
    'characters/soccer_player_05',
    'characters/soccer_player_06',
    'characters/soccer_player_07',
    'characters/soccer_player_08',
    'characters/soccer_player_ball_control',
    'characters/soccer_player_kick',
    'characters/soccer_player_slide_tackle',
    'characters/thinking_man',
    'characters/thinking_woman',
    'characters/tiger_head_angry',
    'characters/tiger_head_happy',
    'characters/tiger_head_medallion',
    'characters/tiger_head_serious',
    'characters/tiger_head_smirk',
    'characters/volleyball_player_01',
    'characters/zeus_head_laurel'
  ],
  coins: [
    'coins/banknote_01',
    'coins/chip_arrow_front',
    'coins/chip_perspective',
    'coins/chip_start',
    'coins/coin_01',
    'coins/coin_02',
    'coins/coin_03',
    'coins/coin_04',
    'coins/coin_05',
    'coins/coin_06',
    'coins/coin_stack',
    'coins/flying_banknote',
    'coins/flying_coin',
    'coins/folded_banknote',
    'coins/fortune_coin_back',
    'coins/fortune_coin_front',
    'coins/gold_bar_01',
    'coins/gold_bar_02',
    'coins/gold_pack_01',
    'coins/gold_pack_02',
    'coins/gold_pack_03',
    'coins/holed_coin_01',
    'coins/holed_coin_02',
    'coins/money_01',
    'coins/money_02',
    'coins/money_03',
    'coins/money_04',
    'coins/money_05',
    'coins/money_pile_01',
    'coins/money_pile_02',
    'coins/side_coin'
  ],
  cup: [
    'cup/brazilian_league_trophy',
    'cup/brazil_cup_trophy',
    'cup/champions_league_trophy',
    'cup/club_world_cup_trophy',
    'cup/generic_trophy_01',
    'cup/generic_trophy_02',
    'cup/generic_trophy_03',
    'cup/kings_cup_trophy',
    'cup/libertadores_trophy',
    'cup/nba_trophy',
    'cup/premier_league_trophy',
    'cup/sudamericana_trophy',
    'cup/uefa_trophy',
    'cup/world_cup_trophy',
    'cup/world_trophy'
  ],
  football: [
    'football/brazilian_league_trophy_sticker',
    'football/fans_watching_tv',
    'football/field_mobile_betting',
    'football/grass_field',
    'football/stadium_aerial',
    'football/stadium_esplanade',
    'football/whistle'
  ],
  papers: ['papers/clipboard', 'papers/pen', 'papers/stamp'],
  random: [
    'random/candy',
    'random/christmas_bells',
    'random/christmas_candle',
    'random/christmas_candy_cane',
    'random/christmas_fruit',
    'random/christmas_gifts',
    'random/christmas_gingerbread',
    'random/christmas_house',
    'random/christmas_lights',
    'random/christmas_ornament_01',
    'random/christmas_ornament_02',
    'random/christmas_penguin',
    'random/christmas_reindeer',
    'random/christmas_snowflakes',
    'random/christmas_snowman',
    'random/christmas_star',
    'random/christmas_stocking',
    'random/christmas_tree',
    'random/christmas_wreath',
    'random/green_streaks',
    'random/heart_circle',
    'random/large_lightning_01',
    'random/large_lightning_02',
    'random/large_lightning_03',
    'random/large_lightning_04',
    'random/lightning_3d',
    'random/question_mark_3d',
    'random/santa_claus',
    'random/scratch_card',
    'random/star_3d_01',
    'random/star_3d_02'
  ],
  safety: [
    'safety/chest',
    'safety/triple_chest',
    'safety/verified_shield_01',
    'safety/verified_shield_02'
  ],
  smoke: [
    'smoke/bubble_cloud',
    'smoke/cloud_01',
    'smoke/cloud_02',
    'smoke/cloud_03',
    'smoke/dense_cloud_01',
    'smoke/dense_cloud_02',
    'smoke/explosion_01',
    'smoke/explosion_02',
    'smoke/explosion_03',
    'smoke/explosion_04',
    'smoke/generic_smoke',
    'smoke/green_smoke_01',
    'smoke/green_smoke_02',
    'smoke/green_smoke_03',
    'smoke/green_smoke_04',
    'smoke/green_smoke_05',
    'smoke/green_smoke_06',
    'smoke/green_smoke_07',
    'smoke/green_smoke_08',
    'smoke/green_smoke_09',
    'smoke/green_smoke_10',
    'smoke/green_smoke_11',
    'smoke/green_smoke_12',
    'smoke/green_smoke_13',
    'smoke/green_smoke_14',
    'smoke/green_smoke_15',
    'smoke/green_smoke_16',
    'smoke/green_smoke_17',
    'smoke/green_smoke_18',
    'smoke/green_smoke_19',
    'smoke/green_smoke_20',
    'smoke/green_smoke_21',
    'smoke/green_smoke_22',
    'smoke/ground_cloud',
    'smoke/lightning_01',
    'smoke/purple_smoke_01',
    'smoke/purple_smoke_02',
    'smoke/purple_smoke_03',
    'smoke/purple_smoke_04',
    'smoke/purple_smoke_05',
    'smoke/purple_smoke_06',
    'smoke/purple_smoke_07',
    'smoke/purple_smoke_08',
    'smoke/spiral_cloud',
    'smoke/wavy_smoke',
    'smoke/white_lightning'
  ],
  stickers: [
    'stickers/aviator_01',
    'stickers/aviator_02',
    'stickers/big_fish_01',
    'stickers/big_fish_02',
    'stickers/bunny_01',
    'stickers/bunny_02',
    'stickers/candy_1000_01',
    'stickers/candy_1000_02',
    'stickers/cat_01',
    'stickers/cat_02',
    'stickers/chinese_dragon_01',
    'stickers/chinese_dragon_02',
    'stickers/congo_cash_01',
    'stickers/congo_cash_02',
    'stickers/crab_01',
    'stickers/crab_02',
    'stickers/dog_01',
    'stickers/dog_02',
    'stickers/dragon_01',
    'stickers/dragon_02',
    'stickers/dragon_03',
    'stickers/dragon_04',
    'stickers/fortune_dragon_01',
    'stickers/fortune_dragon_02',
    'stickers/fortune_ox_01',
    'stickers/fortune_ox_02',
    'stickers/frog_01',
    'stickers/frog_02',
    'stickers/jaguar_01',
    'stickers/jaguar_02',
    'stickers/jewels_01',
    'stickers/jewels_02',
    'stickers/joker_01',
    'stickers/joker_02',
    'stickers/little_mouse_01',
    'stickers/little_mouse_02',
    'stickers/lollipop_01',
    'stickers/lollipop_02',
    'stickers/lucky_bull_01',
    'stickers/lucky_bull_02',
    'stickers/lucky_tiger_01',
    'stickers/lucky_tiger_02',
    'stickers/man_01',
    'stickers/man_02',
    'stickers/medieval_soldier_01',
    'stickers/medieval_soldier_02',
    'stickers/monkey_01',
    'stickers/monkey_02',
    'stickers/monkey_03',
    'stickers/monkey_04',
    'stickers/panda_01',
    'stickers/panda_02',
    'stickers/pig_01',
    'stickers/pig_02',
    'stickers/roulette_01',
    'stickers/roulette_02',
    'stickers/snake_01',
    'stickers/snake_02',
    'stickers/sorceress_01',
    'stickers/sorceress_02',
    'stickers/sugar_rush_01',
    'stickers/sugar_rush_02',
    'stickers/sugar_rush_1000_01',
    'stickers/sugar_rush_1000_02',
    'stickers/sumo_wrestler_01',
    'stickers/sumo_wrestler_02',
    'stickers/western_01',
    'stickers/western_02',
    'stickers/wild_bandit_01',
    'stickers/wild_bandit_02',
    'stickers/woman_01',
    'stickers/woman_02',
    'stickers/zeus_01',
    'stickers/zeus_02',
    'stickers/zeus_03',
    'stickers/zeus_04',
    'stickers/zeus_1000_01',
    'stickers/zeus_1000_02'
  ],
  time: ['time/green_watch', 'time/purple_watch'],
  various: [
    'various/air_jordan_sneaker',
    'various/basketball_hoop',
    'various/basketball_sneaker_01',
    'various/basketball_sneaker_02',
    'various/billiard_ball_09',
    'various/billiard_ball_10',
    'various/foam_hand',
    'various/football_helmet',
    'various/formula_1_car',
    'various/freebet_ticket_green_multiple',
    'various/freebet_ticket_green_single',
    'various/freebet_ticket_purple_multiple',
    'various/freebet_ticket_purple_single'
  ]
} as const;

const categoryLabels = {
  arrows: 'Arrows',
  balls: 'Balls',
  brands: 'Brands',
  casino: 'Casino',
  characters: 'Characters',
  coins: 'Coins',
  cup: 'Cup',
  football: 'Football',
  papers: 'Papers',
  random: 'Random',
  safety: 'Safety',
  smoke: 'Smoke',
  stickers: 'Stickers',
  time: 'Time',
  various: 'Various'
} as const;

const sizeOptions = ['12', '16', '24', '32', '40', '56'] as const;

type CategoryKey = keyof typeof illustrationCategories;

const toIllustrationLabel = (name: string) =>
  name.split('/').pop()?.split('_').join(' ') ?? name;

const createCategoryStory = (category: CategoryKey): Story => ({
  render: () => ({
    components: { StIllustration },
    setup() {
      const items = illustrationCategories[category].map((name) => ({
        name,
        alt: `Ilustracao ${toIllustrationLabel(name)}`,
        label: toIllustrationLabel(name)
      }));

      return {
        items,
        category,
        categoryLabel: categoryLabels[category]
      };
    },
    template: `
      <div class="space-y-st-4">
        <div>
          <p class="text-st-body-small text-st-content-default">
            Categoria <strong>{{ categoryLabel }}</strong> com {{ items.length }} ilustrações referenciadas do catálogo atual.
          </p>
        </div>

        <div class="grid gap-st-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="item in items"
            :key="item.name"
            class="overflow-hidden rounded-st-1 border border-st-border-2 bg-st-surface-0"
          >
            <div class="flex min-h-[11rem] items-center justify-center bg-st-surface-2 p-st-4">
              <StIllustration
                :name="item.name"
                :alt="item.alt"
                height="40"
                className="mx-auto w-auto"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="space-y-st-1 p-st-3">
              <p class="text-st-body-small font-semibold text-st-content-default">
                {{ item.label }}
              </p>
              <code class="block break-all text-[11px] text-st-content-ghost">
                {{ item.name }}
              </code>
            </div>
          </div>
        </div>
      </div>
    `
  })
});

const meta = {
  title: 'Components/StIllustration',
  component: StIllustration,
  tags: ['autodocs'],
  args: {
    name: 'arrows/chip_3d',
    alt: 'Chip 3D',
    width: undefined,
    height: '40',
    className: ''
  },
  argTypes: {
    name: {
      control: 'text'
    },
    alt: {
      control: 'text'
    },
    width: {
      control: 'select',
      options: [undefined, ...sizeOptions]
    },
    height: {
      control: 'select',
      options: [undefined, ...sizeOptions]
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StIllustration },
    setup() {
      return { args };
    },
    template: `
      <div class="flex min-h-[14rem] items-center justify-center rounded-st-1 bg-st-surface-2 p-st-6">
        <StIllustration v-bind="args" loading="lazy" decoding="async" />
      </div>
    `
  })
} satisfies Meta<typeof StIllustration>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Arrows: Story = createCategoryStory('arrows');
export const Balls: Story = createCategoryStory('balls');
export const Brands: Story = createCategoryStory('brands');
export const Casino: Story = createCategoryStory('casino');
export const Characters: Story = createCategoryStory('characters');
export const Coins: Story = createCategoryStory('coins');
export const Cup: Story = createCategoryStory('cup');
export const Football: Story = createCategoryStory('football');
export const Papers: Story = createCategoryStory('papers');
export const Random: Story = createCategoryStory('random');
export const Safety: Story = createCategoryStory('safety');
export const Smoke: Story = createCategoryStory('smoke');
export const Stickers: Story = createCategoryStory('stickers');
export const Time: Story = createCategoryStory('time');
export const Various: Story = createCategoryStory('various');
