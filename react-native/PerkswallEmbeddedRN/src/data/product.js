export const PerksWallType = Object.freeze({
  REGULAR: 'regular PerksWall',
  MODAL: 'modal style Perkswall',
  INTERSTITIAL: 'interstitial style Perkswall',
  STANDALONE: 'standalone style Perkswall',
});

export const products = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    price: 999.99,
    image: require('../../assets/images/iphone.png'),
    description: 'Latest iPhone with dynamic island',
    type: PerksWallType.REGULAR,
  },
  {
    id: 2,
    name: 'MacBook Pro',
    price: 1299.99,
    image: require('../../assets/images/macbook.png'),
    description: 'Powerful laptop for professionals',
    type: PerksWallType.MODAL,
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249.99,
    image: require('../../assets/images/airpod.jpg'),
    description: 'Premium wireless earbuds',
    type: PerksWallType.INTERSTITIAL,
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 599.99,
    image: require('../../assets/images/ipad.png'),
    description: 'Versatile tablet for work and play',
    type: PerksWallType.STANDALONE,
  },
];
