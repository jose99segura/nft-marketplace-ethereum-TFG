/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import { useListedNfts } from "@hooks/web3";
import NftItem from '../item';
import NftItemSecundario from '../itemSecundario';

const NftListSecundario: FunctionComponent = () => {

    const { nfts } = useListedNfts();
    return (

        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-4 lg:max-w-none">
            {
                nfts.data?.map( nft => {

                    // if (nft.transactions.length > 1) {
                        return (
                            <div key={nft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                {/* Mostramos el elemento nft dentro de la lista */}
                                <NftItemSecundario 
                                    item={nft}
                                    buyNft={nfts.buyNft}
                                />
                            </div>
                        );
                    // }
                })
            }
        </div>
    )
}

export default NftListSecundario;