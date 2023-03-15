
import type { NextPage } from 'next'
import { BaseLayout } from '@ui'
import { useAccount, useOwnedNfts } from '@hooks/web3';
import { Nft } from '@_types/nft';



const Congreso: NextPage = () => {

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
      {flag && nftfinal ? (
        <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-8">{(nftfinal as Nft).meta.name}</h1>
        <video
          src="/videos/video.mp4"
          autoPlay
          loop
          muted
          className="object-cover w-full h-full mx-auto"
        />
      </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <h1 className="text-4xl text-center">
            Necesitas tener el NFT "Congreso Programación NFTs" para acceder a este contenido
          </h1>
        </div>
      )}
    </BaseLayout>
  )
}

export default Congreso;