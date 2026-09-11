import type { Meta, StoryObj } from '@storybook/vue3';

import StAvatarGroup from './StAvatarGroup.vue';

const svgImage = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const photo = (background: string, foreground: string) =>
  svgImage(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
      <rect width="160" height="160" fill="${background}"/>
      <circle cx="80" cy="62" r="30" fill="${foreground}"/>
      <path d="M20 160c0-33 27-60 60-60s60 27 60 60z" fill="${foreground}"/>
    </svg>`
  );

/** A gangue Van der Linde, na ordem em que aparece nos exemplos. */
const gang = [
  { name: 'Arthur Morgan' },
  { name: 'Dutch van der Linde' },
  { name: 'John Marston' },
  { name: 'Sadie Adler' },
  { name: 'Micah Bell' },
  { name: 'Charles Smith' },
  { name: 'Hosea Matthews' },
  { name: 'Bill Williamson' },
  { name: 'Javier Escuella' },
  { name: 'Lenny Summers' },
  { name: 'Abigail Roberts' },
  { name: 'Karen Jones' },
  { name: 'Tilly Jackson' },
  { name: 'Mary-Beth Gaskill' },
  { name: "Molly O'Shea" },
  { name: 'Susan Grimshaw' },
  { name: 'Sean MacGuire' },
  { name: 'Kieran Duffy' }
];

const team = gang.slice(0, 7);

const meta = {
  title: 'Components/StAvatarGroup',
  component: StAvatarGroup,
  tags: ['autodocs'],
  args: {
    avatars: team.slice(0, 6),
    max: 5,
    size: 'medium',
    fit: 'cover',
    className: ''
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large']
    },
    fit: {
      control: 'radio',
      options: ['cover', 'contain']
    },
    max: {
      control: { type: 'number', min: 1, max: 10, step: 1 }
    },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StAvatarGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <StAvatarGroup v-bind="args" />
        <span class="text-st-body-small text-st-content-default">
          Acima de <code>max</code> avatares o grupo fecha com o contador.
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StAvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { StAvatarGroup },
    setup() {
      return { team };
    },
    template: `
      <div class="flex flex-col gap-st-3 p-st-3">
        <StAvatarGroup :avatars="team" size="small" />
        <StAvatarGroup :avatars="team" size="medium" />
        <StAvatarGroup :avatars="team" size="large" />
      </div>
    `
  })
};

export const Overflow: Story = {
  name: 'Contador dinamico',
  render: () => ({
    components: { StAvatarGroup },
    setup() {
      return { team, many: gang };
    },
    template: `
      <div class="flex flex-col gap-st-3 p-st-3">
        <div class="flex items-center gap-st-2">
          <StAvatarGroup :avatars="team.slice(0, 5)" />
          <span class="text-st-body-small text-st-content-default">
            5 usuarios: sem contador
          </span>
        </div>
        <div class="flex items-center gap-st-2">
          <StAvatarGroup :avatars="team.slice(0, 6)" />
          <span class="text-st-body-small text-st-content-default">
            6 usuarios: 5 avatares + 1
          </span>
        </div>
        <div class="flex items-center gap-st-2">
          <StAvatarGroup :avatars="many" />
          <span class="text-st-body-small text-st-content-default">
            18 usuarios: 5 avatares + 13
          </span>
        </div>
      </div>
    `
  })
};

export const SingleAvatar: Story = {
  render: () => ({
    components: { StAvatarGroup },
    setup() {
      return { team };
    },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <StAvatarGroup :avatars="team.slice(0, 1)" />
        <span class="text-st-body-small text-st-content-default">
          Com um unico usuario o grupo ainda renderiza o avatar.
        </span>
      </div>
    `
  })
};

export const WithImages: Story = {
  render: () => ({
    components: { StAvatarGroup },
    setup() {
      return {
        mixed: [
          { name: 'Arthur Morgan', src: photo('#2563eb', '#dbeafe') },
          { name: 'Dutch van der Linde', src: photo('#16a34a', '#dcfce7') },
          { name: 'John Marston' },
          { name: 'Sadie Adler', src: photo('#be185d', '#fce7f3') },
          { name: 'Micah Bell' },
          { name: 'Charles Smith' },
          { name: 'Hosea Matthews' }
        ]
      };
    },
    template: `
      <div class="flex flex-col gap-st-3 p-st-3">
        <StAvatarGroup :avatars="mixed" size="large" />
        <span class="text-st-body-small text-st-content-default">
          Imagem e iniciais convivem no mesmo grupo.
        </span>
      </div>
    `
  })
};
