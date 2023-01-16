/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import { useListedNfts } from "@hooks/web3";
import NftItem from '../item';

const NftList: FunctionComponent = () => {

    const { nfts } = useListedNfts();
    return (

        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                nfts.data?.map( nft =>
                    <div key={nft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        {/* Mostramos el elemento nft dentro de la lista */}
                        <NftItem 
                            item={nft}
                            buyNft={nfts.buyNft}
                        />
                    </div>
                )  
            }
          </div>
    )
}

export default NftList;