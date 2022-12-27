/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import { Nft } from '../../../../types/nft';
import NftItem from '../item';

type NftListProps = {
    nfts: Nft[]
}

const NftList: FunctionComponent<NftListProps> = ({nfts}) => {

    return (

        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                nfts.map( nft =>
                    <div key={nft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        {/* Mostramos el elemento nft dentro de la lista */}
                        <NftItem 
                            item={nft}
                        />
                    </div>
                )  
            }
            
          </div>

    )
}

export default NftList;