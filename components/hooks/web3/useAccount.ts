
import { CryptoHookFactory } from "@_types/hooks";
import { useEffect } from "react";
import useSWR from "swr";

type UseAccountResponse = {
    connect: () => void;
    isLoading: boolean;
    isInstalled: boolean;
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>
export type UseAccountHook = ReturnType<AccountHookFactory>

// deps -> providers, ethereum, contract (web3State)
export const hookFactory: AccountHookFactory = ({provider, ethereum, isLoading}) => () => {

    const {data, mutate, isValidating, ...swr} = useSWR(
        provider ? "web3/useAccount": null,
        async () =>{
            const accounts = await provider!.listAccounts();
            const account = accounts[0];

            if (!account) {
                throw "No se ha podido obtener cuenta. Por favor conecta tu cartera con MetaMask"
            }

            return account;
        }, {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    )

    useEffect(() => {
        ethereum?.on("accountsChanged", handleAccountsChanged);
        return () => {
            ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        }
    })

    const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
            console.error("Por favor, conecta tu cuenta de MetaMask");
            
        } else if(accounts[0] !== data){
            // Mutate sirve para propagar cambios una vez se cambia la cuenta de MetaMask y mostrarla 
            mutate(accounts[0]);
        }
    }

    const connect = async () => {
        try{
            ethereum?.request({method: "eth_requestAccounts"})
        }catch(e){
            console.error(e);
        }
    }

    return {
        ...swr,
        data,
        isValidating,
        isLoading: isLoading as boolean,
        isInstalled: ethereum?.isMetaMask || false,
        mutate,
        connect
    };
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined, contract: undefined});