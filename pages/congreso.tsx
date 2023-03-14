
import type { NextPage } from 'next'
import { BaseLayout } from '@ui'
import { useAccount, useOwnedNfts } from '@hooks/web3';
import { Nft } from '@_types/nft';



const Congreso: NextPage = () => {

    const { account } = useAccount();
    const { nfts }  = useOwnedNfts();
    let flag = false;
    let nftfinal: Nft | null = null;
    

    nfts.data?.forEach(nft => {
      if (nft.meta.attributes[0].value == "Congreso Programación NFTs") {
        flag = true;
        nftfinal = nft;
      }
    });


  return (
    <BaseLayout>
      <div>
        {flag ? (
          `El usuario ${account.data}, posee el NFT ${nftfinal.meta.attributes[0].value}`
        ) : (
          `El usuario ${account.data} no posee el NFT "Congreso Programación NFTs"`
        )}
      </div>
    </BaseLayout>
  )
}

export default Congreso;