
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

const NETWORKS: {[k: string]: string} = {
    1: "Ethereum Main Network",
    1337: "Ganache Test Network"
}

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type UseNetworkResponse = {
    isLoading: boolean;
    isSupported: boolean;
    targetNetwork: string;
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>
export type UseNetworkHook = ReturnType<NetworkHookFactory>

// deps -> providers, ethereum, contract (web3State)
export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () => {

    const {data, isValidating, ...swr} = useSWR(
        provider ? "web3/useNetwork": null,
        async () =>{
            // Numero de red, por ejemplo el chainId 1, es el de ethereum
            const chainId = (await provider!.getNetwork()).chainId;

            if (!chainId) {
                throw "No se ha podido obtener la red blockchain, Por favor refresca el navegador o conéctate a otra red"
            }

            return NETWORKS[chainId];
        }, {
            revalidateOnFocus: false,
            // shouldRetryOnError: false
        }
    )

    return {
        ...swr,
        data,
        isValidating,
        targetNetwork,
        isSupported: data === targetNetwork,
        isLoading: isLoading as boolean,
    };
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined, contract: undefined});