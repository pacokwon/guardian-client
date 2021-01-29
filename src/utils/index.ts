export const getAvatarUrlFromID = (id: string | number) =>
  `https://avatars.dicebear.com/4.5/api/human/${id}.svg`;

// takes a seed number (or string), then returns an alt image
export const getAltImage = (seed: number | string) =>
  `https://avatars.dicebear.com/4.5/api/identicon/${seed}.svg`;
