import {
  ThirdwebNftMedia,
  useAddress,
  useMetamask,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { ConnectWallet, useSDK } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Link from 'next/link'
import BackIcon from "../public/icons/BackIcon.png"
import Image from 'next/image'
import Balanco from './balance';

const nftDropContractAddress = "0xA9f7A8aE98ad459f239084c18FFB52B112e9003B";
// const tokenContractAddress = "0xe2c5fcf777a2b860921116b275951a50e8135eeb";
const stakingContractAddress = "0x27F5f98bC82D39D333F8448F4C61E7C386002e6c";






const Stake: NextPage = () => {
  // Wallet Connection Hooks
  // const privateKey = "a9989eac22d991004ab35dee67aa78e68070accf4fcdea46a6aefa69adff8f8e";
  // const signer = ethers.Wallet.createRandom();
  // const sdk = ThirdwebSDK.fromSigner(signer, "mainnet");
  // const sdk = useSDK();
  // const sdk = ThirdwebSDK.fromPrivateKey("SecretPrivateKey", "mainnet");
  // const sdk = new ThirdwebSDK("polygon");
  const connectWithMetamask = useMetamask();
  const address = useAddress();

  // Contract Hooks
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );

  // const { contract: tokenContract } = useContract(
  //   tokenContractAddress,
  //   "token"
  // );

  const { contract, isLoading } = useContract(stakingContractAddress);

  // Load Unstaked NFTs
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);

  // Load Balance of Token
  // const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  ///////////////////////////////////////////////////////////////////////////
  // Custom contract functions
  ///////////////////////////////////////////////////////////////////////////
  const [stakedNfts, setStakedNfts] = useState<any[]>([]);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  // const [currentbal, setcurrentbal] = useState<string>();
  useEffect(() => {
    if (!contract) return;


    // async function getbalance() {
    //   let balan = "0";
    //   // let balan = await sdk.wallet.balance();
    //   setcurrentbal(balan);
    // }





    async function loadStakedNfts() {
      const stakedTokens = await contract?.call("getStakedTokens", address);

      // For each staked token, fetch it from the sdk
      const stakedNfts = await Promise.all(
        stakedTokens?.map(
          async (stakedToken: { staker: string; tokenId: BigNumber }) => {
            const nft = await nftDropContract?.get(stakedToken.tokenId);
            return nft;
          }
        )
      );

      setStakedNfts(stakedNfts);
      console.log("setStakedNfts", stakedNfts);
    }

    if (address) {
      loadStakedNfts();
    }
  }, [address, contract, nftDropContract]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const cr = await contract?.call("availableRewards", address);
      console.log("Loaded claimable rewards", cr);
      setClaimableRewards(cr);
    }

    loadClaimableRewards();
  }, [address, contract]);


  useEffect(() => {
    var autoas = document.getElementById("autom");
    if (autoas) {
      autoas.click();
      console.log("function is calling")
    }
    else {
      console.log("function is not calling")
    }
  }, []);

  ///////////////////////////////////////////////////////////////////////////
  // Write Functions
  ///////////////////////////////////////////////////////////////////////////
  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    // If not approved, request approval
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    const stake = await contract?.call("stake", id);
  }

  async function withdraw(id: BigNumber) {
    const withdraw = await contract?.call("withdraw", id);
  }

  async function claimRewards() {
    const claim = await contract?.call("claimRewards");
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Link href="/">
        <div className="d-flex">
          {/* <img src={`/icons/BackIcon.png`} alt="" /> */}
          <Image src={BackIcon} className="asad" width={50} height={50} />

          {/* <i className="fa fa-arrow-left" aria-hidden="true"></i> */}
          {/* <i className="fa fa-arrow-left"></i> */}

          <h3>Go To Dashboard</h3>
        </div>
      </Link>
      <div className={styles.container}>
        <h1 className={styles.h1}>Stake Your NFTs</h1>

        <hr className={`${styles.divider} ${styles.spacerTop}`} />

        {!address ? (
          <button className={styles.mainButton} id="autom" onClick={connectWithMetamask}>
            Connect Wallet
          </button>
        ) : (
          <>
            <h2>Your Tokens</h2>

            <div className={styles.tokenGrid}>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
                <p className={styles.tokenValue}>
                  <b>
                    {!claimableRewards
                      ? "Loading..."
                      : ethers.utils.formatUnits(claimableRewards, 18)}
                  </b>{" "}
                  {/* {tokenBalance?.symbol} */}
                </p>
              </div>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Contract Address</h3>
                <p className={styles.tokenValue}>
                  <b>
                    0xd78807630Aea9316b741F9EFEb5c157Ec7d28F69
                    <Balanco />

                  </b>
                  {/* <b>{currentbal}</b> */}
                  {/* <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol} */}

                </p>
              </div>
            </div>

            <button
              className={`${styles.mainButton} ${styles.spacerTop}`}
              onClick={() => claimRewards()}
            >
              Claim Rewards
            </button>

            <hr className={`${styles.divider} ${styles.spacerTop}`} />

            <h2>Your Staked NFTs</h2>
            <div className={styles.nftBoxGrid}>


              {stakedNfts?.map((nft) => (

                <div className="console log" key="12">
                  {
                    nft ?

                      <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                        <ThirdwebNftMedia
                          metadata={nft.metadata}
                          className={styles.nftMedia}
                        />
                        <h3>{nft.metadata.name}</h3>
                        <button
                          className={`${styles.mainButton} ${styles.spacerBottom}`}
                          onClick={() => withdraw(nft.metadata.id)}
                        >
                          Withdraw
                        </button>
                      </div> :
                      <div key="1">
                        {console.log("hello world")}
                      </div>


                  }
                </div>

              ))}
            </div>

            <hr className={`${styles.divider} ${styles.spacerTop}`} />

            <h2>Your Unstaked NFTs</h2>

            <div className={styles.nftBoxGrid}>
              {ownedNfts?.map((nft) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                  />
                  <h3>{nft.metadata.name}</h3>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => stakeNft(nft.metadata.id)}
                  >
                    Stake
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Stake;
