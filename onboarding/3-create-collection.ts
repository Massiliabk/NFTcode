import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateCollectionParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionParams = {
    name: 'memoire l3',
    description: 'an nft for medecine',
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    icon_url: 'https://gateway.pinata.cloud/ipfs/QmWAK39AzsiLANxh2FDcnECNGaJvreHmRxm3Kj998Bt389?_gl=1*zo9iuo*rs_ga*YjA5NjYwNzYtYmYwYi00ZTg0LTk1MjItODJmMTdjM2FiN2Uz*rs_ga_5RMPXG14TE*MTY4NDIzNjQ5NC40LjEuMTY4NDIzNzM5OC4yMy4wLjA.',
    metadata_api_url: 'https://gateway.pinata.cloud/ipfs/QmaLuX9GQsspvqCRvYFKesy3JH17S2F9noizcWs8y4GEfN/?_gl=1*1bm1ejg*rs_ga*YjA5NjYwNzYtYmYwYi00ZTg0LTk1MjItODJmMTdjM2FiN2Uz*rs_ga_5RMPXG14TE*MTY4NDIzNjQ5NC40LjEuMTY4NDIzNzM5OC4yMy4wLjA.',
    collection_image_url: 'https://gateway.pinata.cloud/ipfs/QmaLuX9GQsspvqCRvYFKesy3JH17S2F9noizcWs8y4GEfN/coquillageP.jpg',
    project_id: parseInt(projectId, 10),
  };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
