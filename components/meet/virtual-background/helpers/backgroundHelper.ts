// import { isArray } from 'lodash';

export type BackgroundConfig = {
  type: 'none' | 'blur' | 'image';
  url?: string;
};

const defaultBackgroundConfig: BackgroundConfig = {
  type: 'none',
};

let backgroundImageUrls = [
  'kenny-eliason-Wp7t4cWN-68-unsplash',
  'jonny-caspari-KuudDjBHIlA-unsplash',
  'roman-bozhko-PypjzKTUqLo-unsplash',
  'vinicius-amnx-amano-17NCG_wOkMY-unsplash',
  'dmytro-tolokonov-Jq3WI9IQgEs-unsplash',
  'andrew-ridley-jR4Zf-riEjI-unsplash',
  'annie-spratt-OWq8w3BYMFY-unsplash',
  'evelyn-bertrand-GrIf347OtnY-unsplash',
  'steve-richey-6xqAK6oAeHA-unsplash',
  'erol-ahmed-IHL-Jbawvvo-unsplash',
].map((imageName) => `/images/meet/backgrounds/${imageName}.jpg`);

// if (
//   typeof (window as any).PNM_VIRTUAL_BG_IMGS !== 'undefined' &&
//   isArray((window as any).PNM_VIRTUAL_BG_IMGS) &&
//   (window as any).PNM_VIRTUAL_BG_IMGS.length > 0
// ) {
//   const bgImgUrls: Array<string> = (window as any).PNM_VIRTUAL_BG_IMGS;
//   const imgUrls: Array<string> = [];

//   (async () => {
//     for (let i = 0; i < bgImgUrls.length; i++) {
//       const url = bgImgUrls[i];
//       try {
//         const req = await fetch(url, { method: 'HEAD' });
//         if (req.ok) {
//           imgUrls.push(url);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     if (imgUrls.length) {
//       backgroundImageUrls = imgUrls;
//     }
//   })();
// }

export { backgroundImageUrls, defaultBackgroundConfig };
