import { loadLogos } from './logo/load-logos';
import { prepareLogos } from './logo/prepare-logos';
import { matrix } from './matrix/matrix';

// perform any async operations here before the app starts
export const bootstrap = async () => {
  await prepareLogos();

  const logos = await loadLogos();

  return {
    matrix,
    logos,
  };
};
