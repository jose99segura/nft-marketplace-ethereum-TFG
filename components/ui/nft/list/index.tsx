/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import { useListedNfts } from "@hooks/web3";
import NftItem from '../item';

interface NftListProps {
    evento: string;
}

const NftList: FunctionComponent<NftListProps> = (props) => {

    const { nfts } = useListedNfts();
    
    const { evento } = props;
    
    return (
        
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                nfts.data?.map( nft => {

                    if (nft.meta.attributes[1].value == evento && nft.transactions.length <= 1) {

                        // console.log('====================================');
                        // console.log(nft);
                        // console.log('====================================');

                        return (
                            <div key={nft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                {/* Mostramos el elemento nft dentro de la listas */}
                                <NftItem 
                                item={nft}
                                buyNft={nfts.buyNft}
                            />
                            </div>
                        );
                    }
                    
                })  
            }
        </div>
    )
}

export default NftList;