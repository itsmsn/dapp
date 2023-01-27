import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Image from 'next/image'
import HappyTigerFour from "../public/icons/HappyTigerFour.png"
import HappyOctopusFour from "../public/icons/HappyOctopusFour.png"

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>ECOCREATURES - Mint Or Stake Your NFT</h1>
      <div className={styles.nftBoxGrid}>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/mint`)}
        >
          {/* Mint a new NFT */}
            <Image src={HappyTigerFour} alt="drop" width={175} height={175} />
            <h2 className={styles.selectBoxTitle}>Mint an NFT</h2>
            <p className={styles.selectBoxDescription}>
              Claim Your Eco Creatures Here
            </p>
        </div>

        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/stake`)}
        >
          {/* Staking an NFT */}
          <Image src={HappyOctopusFour} alt="drop" width={175} height={175} />
          <h2 className={styles.selectBoxTitle}>Stake Your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            Stake Your Eco Creatures Here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
