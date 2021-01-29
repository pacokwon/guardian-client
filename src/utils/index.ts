export const getAvatarUrlFromID = (id: string | number) =>
  `https://avatars.dicebear.com/4.5/api/human/${id}.svg`;

// takes a seed number (or string), then returns an alt image
export const getAltImage = (seed: number | string) =>
  `https://avatars.dicebear.com/4.5/api/identicon/${seed}.svg`;

// NOTE: might not be totally random, but good enough for our purposes
export const getRandomString = (): string =>
  Math.random()   // random float number
    .toString(36) // toString with radix 36 (0-9 + A-Za-z)
    .slice(2);    // slice the "0." at front
