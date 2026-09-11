import type {
  StAvatarColor,
  StAvatarFit,
  StAvatarSize
} from '../avatar/StAvatar.interface';

export interface StAvatarGroupItem {
  /** Nome do usuario: gera as iniciais e a cor quando nao existe imagem. */
  name?: string;
  /** URL da imagem do usuario. */
  src?: string;
  /** Texto alternativo da imagem; por padrao usa `name`. */
  alt?: string;
  /** Forca uma cor da paleta neste avatar. */
  color?: StAvatarColor;
  /** Sobrescreve o `fit` do grupo neste avatar. */
  fit?: StAvatarFit;
}

export interface AvatarGroupClassProps {
  size?: StAvatarSize;
  className?: string;
}

export interface StAvatarGroupProps extends AvatarGroupClassProps {
  /** Usuarios exibidos, na ordem informada. */
  avatars: StAvatarGroupItem[];
  /** Quantidade maxima de avatares visiveis antes do contador. */
  max?: number;
  /** Escala aplicada a todos os avatares. */
  size?: StAvatarSize;
  /** `fit` padrao dos avatares do grupo. */
  fit?: StAvatarFit;
  /** Icone exibido nos avatares sem imagem e sem nome. */
  placeholderIcon?: string;
  /** Rotulo do grupo. */
  ariaLabel?: string;
  /** Rotulo do contador de excedentes. */
  overflowAriaLabel?: (count: number) => string;
  /** Classes extras em cada avatar. */
  avatarClassName?: string;
}
