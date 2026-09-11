export type StAvatarSize = 'small' | 'medium' | 'large';

export type StAvatarFit = 'cover' | 'contain';

export type StAvatarColor =
  | 'blue'
  | 'ocean'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'
  | 'purple';

export type StAvatarContent = 'image' | 'initials' | 'placeholder';

export interface AvatarClassProps {
  size?: StAvatarSize;
  fit?: StAvatarFit;
  color?: StAvatarColor;
  content?: StAvatarContent;
  className?: string;
}

export interface StAvatarProps {
  /** Nome do usuario: gera as iniciais e a cor quando nao existe imagem. */
  name?: string;
  /** URL da imagem do usuario. */
  src?: string;
  /** Texto alternativo da imagem; por padrao usa `name`. */
  alt?: string;
  /** Escala do avatar. */
  size?: StAvatarSize;
  /** `cover` preenche o circulo; `contain` deixa respiro para imagens vazadas. */
  fit?: StAvatarFit;
  /** Forca uma cor da paleta, ignorando a cor derivada do nome. */
  color?: StAvatarColor;
  /** Icone exibido quando nao ha imagem nem nome. */
  placeholderIcon?: string;
  /** Classes extras no container. */
  className?: string;
}
