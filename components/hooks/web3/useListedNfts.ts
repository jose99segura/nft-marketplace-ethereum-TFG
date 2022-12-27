
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type UseListedNftsResponse = {}

type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>
export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

// deps -> providers, ethereum, contract (web3State)
export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {

    const {data, ...swr} = useSWR(
        contract ? "web3/useListedNfts": null,
        async () =>{
            const nfts = [] as any;
            return nfts;
        }
    )

    return {
        ...swr,
        data: data || []
    };
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined, contract: undefined});