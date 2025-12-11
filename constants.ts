import { ScenarioOption } from './types';

export const PREDEFINED_SCENARIOS: ScenarioOption[] = [
  {
    id: 'pencil-case',
    label: '笔袋 (书房/课桌)',
    prompt: 'on a canvas pencil case sitting on a wooden study desk. The background includes blurred books, a laptop, or stationary. Warm study lamp lighting. The pencil case is deep blue or gray. The patch is ironed on near the zipper, following the fabric surface.',
    icon: '✏️'
  },
  {
    id: 'tote-bag',
    label: '帆布袋 (咖啡馆/公园)',
    prompt: 'on a beige or black canvas tote bag. The bag is placed on a cafe chair or a park bench. Background shows a blurred lifestyle scene (e.g., coffee shop interior or trees). Show realistic fabric folds, natural sunlight, and shadows casting on the bag.',
    icon: '👜'
  },
  {
    id: 't-shirt',
    label: 'T恤 (卧室/生活)',
    prompt: 'on a cotton T-shirt laid naturally on a messy bed or hung on a wooden hanger. Background suggests a tidy bedroom or wardrobe with soft, diffused indoor lighting. The patch follows the gentle ripples and drape of the shirt fabric.',
    icon: '👕'
  },
  {
    id: 'denim-jeans',
    label: '牛仔裤 (实穿细节)',
    prompt: 'on a pair of blue denim jeans. Close-up view of the pocket or thigh area, but with context showing the jeans laid on a rustic wooden surface or worn. Show rich denim texture, copper rivets, and realistic fabric drape. The patch looks embedded in the heavy fabric.',
    icon: '👖'
  },
  {
    id: 'cap',
    label: '棒球帽 (展示台)',
    prompt: 'on the front panel of a baseball cap placed on a wooden shelf or retail display stand. Background is a blurred room or shop environment. The patch curves perfectly with the stiff front structure of the hat. High-quality product photography lighting.',
    icon: '🧢'
  },
  {
    id: 'beanie',
    label: '针织帽 (舒适氛围)',
    prompt: 'on the folded brim of a knit beanie. The beanie is resting on a scarf or a wooden table near a window with winter sunlight. Background implies a cozy vibe. Show the wool texture pressing slightly into the back of the patch.',
    icon: '🧶'
  }
];

export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];