import React from 'react'

// import { useContract } from "@thirdweb-dev/react";
import {
    ThirdwebNftMedia,
    useAddress,
    useMetamask,
    useTokenBalance,
    useOwnedNFTs,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { ConnectWallet, useSDK } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Link from 'next/link'
//   import BackIcon from "../public/icons/BackIcon.png"
import Image from 'next/image'
import { useContract, useContractRead } from "@thirdweb-dev/react";


const Balanco: NextPage = () => {
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    
    
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { contract } = useContract("0xe2c5fcf777a2b860921116b275951a50e8135eeb");
    const { data, isLoading } = useContractRead(contract, "balanceOf", address)
    // const { contract, isLoading, error } = useContract("0xe2c5fcf777a2b860921116b275951a50e8135eeb");
    useEffect(() => {
        if (!contract || !address) return;

        async function getbalance_() {
            const cr = await contract?.call("balanceOf", address);
            console.log("Loaded claimable rewards", cr);
            setClaimableRewards(cr);
        }

        getbalance_();
    }, [address, contract]);



    console.log(data);
    return (
        <div>
            {claimableRewards}

        </div>
    )
}

export default Balanco;