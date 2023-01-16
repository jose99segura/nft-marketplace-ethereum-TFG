
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import useSWR from "swr";

type UseListedNftsResponse = {
    buyNft: (token: number, value: number) => Promise<void>
  }

type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>
export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

// deps -> providers, ethereum, contract (web3State)
export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {

    const {data, ...swr} = useSWR(
        contract ? "web3/useListedNfts": null,
        async () =>{
            const nfts = [] as Nft[];
            const coreNfts = await contract!.getAllNftsOnSale();

            // For para recorrer lista de Nfts ofertados
            for (let i = 0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);

                //Llamada http a pinata, donde esta guardada la informacion de nuestro nft
                const metaRes = await fetch(tokenURI);
                const meta = await metaRes.json();

                nfts.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                })
            }
    
            return nfts;
        }
    )

    const _contract = contract;
    const buyNft = useCallback(async (tokenId: number, value: number) => {
        try {
          const result = await _contract!.buyNft(
            tokenId, {
              value: ethers.utils.parseEther(value.toString())
            }
          )

          await result?.wait();
          alert("Has comprado este Nft. Míralo en tu página de perfil.")
        } catch (e: any) {
          console.error(e.message);
        }
      }, [_contract])

    return {
        ...swr,
        buyNft,
        data: data || []
    };
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined, contract: undefined});