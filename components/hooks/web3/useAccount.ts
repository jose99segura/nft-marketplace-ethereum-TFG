
import { CryptoHookFactory } from "@_types/hooks";
import { providers } from "ethers";
import useSWR from "swr";

// deps -> providers, ethereum, contract (web3State)
export const hookFactory: CryptoHookFactory<string, string> = (deps) => (params) => {

    const swrRes = useSWR("web3/useAccount", () => {
        console.log(deps);
        console.log(params);
            
        //Making a request to get data
        return "Test User"
    })

    return swrRes;
}

export const useAccount = hookFactory({ethereum: undefined, provider: undefined, contract: undefined});