import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApartXLogo from "@/assets/Group 48095578.png";
import RocketLogo from "@/assets/Group 48095590.svg";
import BitcoinBasketLogo from "@/assets/Mask group.svg";
import TetherLogo from "@/assets/Group 48095593.svg";
import TetherGrowthPotentialLogo from "@/assets/81d9fbe1-0746-4ab6-b67b-24cf2077b17f 1.svg";
import TetherBanner from "@/assets/pngtree-tether-coin-banner-on-neon-background-sign-online-banner-vector-png-image_37841524 1.svg";
import PdfWalletLogo from "@/assets/pdfwallet.svg";
import GreenTetherLogo from "@/assets/greenTether.svg";
import TermsConditionLogo from "@/assets/Frame.png";
import InvestmentPlanLogo from "@/assets/Apart-X (1080 x 1920 px) 1.svg";
import InvestmentPlanLogo3 from "@/assets/Group 48095612.svg";
import InvestmentPlanLogo2 from "@/assets/pngtree-refer-a-friend-flat-design-illustration-with-megaphone-on-screen-mobile-png-image_7567395 1.svg";
import TermsConditionTetherLogo from "@/assets/68017ee10477899fcd5a1c56_64e57b5d08173cd01930c17a_Buy20USDT20Japan 1.png";
import GoldTether from "@/assets/Tether-cryptocurrency-stablecoins-TerraUSD 1.svg";
import ReferralPlanChart from "@/assets/Apart-X (1080 x 1920 px) (1) 1.svg";
import LastImage from "@/assets/Apart-X (1080 x 1920 px) (3) 1.svg";
import TetherCard from "@/assets/tether-usdt-new3941 1.svg";

const PDFViewer = () => {
  const navigate = useNavigate();

  const longTextItems = [
    "Account Registration: Absolutely free of cost.",
    "Minimum Payout: $10 USDT (BEP-20).",
    "Minimum Funding: $50 USDT (BEP-20).",
    "Accepted Deposit Token: USDT (BEP-20) only.",
    "Payout Currency: USDT (BEP-20) only.",
    "Maximum Profit Limit: Earnings are capped at 400%, including daily ROI and referral commissions, totaling a 400% reinvestment threshold.",
    "Withdrawals: Processed within 24-72 hours.",
    "Withdrawal Access: Available round-the-clock, 365 days a year.",
    "Earnings Hold: No income generated on weekends (Saturday and Sunday).",
  ];

  const thankYouPoints = [
    " Fixed Capital Investment: This involves the purchase of tangible, physical assets that are used in the production of goods or services. Examples include land, buildings, factories, machinery, equipment, and vehicles. These assets are not consumed in the production process but are used repeatedly over time, contributing to the operational capacity and efficiency of a business. Fixed capital investments are crucial for business expansion, modernization, and increased productivity.",
    "Financial Capital Investment: This type refers to the investment in financial instruments such as stocks, bonds, mutual funds, and other securities. Individuals or organizations engage in financial capital investment with the aim of earning income through dividends, interest, or capital gains. For businesses, such investments may also include acquiring shares in other companies for strategic or financial purposes.",
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-[#2D2B2B]">
      {/* Header */}
      <div className="bg-[#171717] py-4 px-4 flex items-center gap-4">
        <ArrowLeft
          className="text-white cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-white text-lg font-medium">About Apart-X</h1>
      </div>

      {/* PDF Viewer */}
      <div className=" space-y-8 text-white bg-black">
        <section className="p-6">
          <header className="flex justify-center mb-10">
            <img
              src={ApartXLogo}
              className="h-[66.73px] w-[71.44px]"
              alt="Apartx logo"
            />
            <div className="text-[21px] text-[#D51A1A] leading-[22px]">
              Rise <br />
              Build <br />
              Dream
            </div>
          </header>
          <h1 className="text-6xl flex mb-3 justify-center font-bold text-white">
            <span className="text-red-600">Who </span> WeAre
          </h1>
          <div className="flex gap-2 items-center-safe">
            <img src={RocketLogo} className="h-[31px] w-[31px]" alt="" />
            <h3 className="text-[30px] font-extrabold leading-[42px]">
              APARTX-X
            </h3>
          </div>
          <p className="mt-4 text-[20px] leading-[26px]">
            The AI-Fueled Sentinel of Web3 Integrity. Built where Python
            precision meets Rails resilience, Apart-X is not just a Web3
            auditor—it's a self-aware watchdog for the decentralized frontier.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            ⚡ Lightning-fast APIs connect you to multi-chain validator nodes.
            <br />
            🔒 Block validation? Secured.
            <br /> 🕒 Confirmations? Instant.
            <br /> 💹 Performance? Relentless.
          </p>
          <p className="mt-4 text-[20px] leading-[26px] text-wrap">
            Behind the scenes, AI-enhanced algorithms audit, adapt, and
            evolve—crafting a self-sustaining, profit-first ecosystem that
            scales effortlessly across decentralized networks. Front to back.
            Chain to chain. Apart-X is where intelligence meets infrastructure.
            Welcome to auditing at the speed of Web3.
          </p>
          <div className="justify-end flex">
            <img
              src={BitcoinBasketLogo}
              className=" h-[208px] w-[222px]"
              alt=""
            />
          </div>
        </section>

        <section className="w-full p-6">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-[#FF0000]">How</span> Does Apart-X{" "}
            <span className="text-[#FF0000]">Works</span>
          </h2>
          <p className="mt-4 text-[20px] leading-[26px] text-wrap">
            <span className="text-[#ff0000] font-semibold">Apart-X</span> is an
            AI-enabled Web3 auditing platform that continuously monitors and
            optimizes live mining operations, staking protocols, and
            transactional workflows across multiple blockchain infrastructures,
            ensuring enhanced efficiency, security, and reliability within
            decentralized environments.
          </p>
          <img
            src={TetherLogo}
            alt="Tether logo"
            className="mx-auto w-[153px] h-[150px] mt-2"
          />
          <div className="grid grid-cols-2 text-center gap-6 mt-4 text-[20px] leading-[26px]">
            <Card className="p-2 border-none text-white bg-[#F60CD7]">
              AI-Enhanced Verification Engine
            </Card>
            <Card className="p-2 border-none bg-[#67E4F7]">
              Auto-Managed Staking & Mining
            </Card>
            <Card className="p-2 border-none bg-[#A9DB53]">
              Earnings Maximization Algorithm
            </Card>
            <Card className="p-2 border-none text-white bg-[#475F9F]">
              User-Centric Control Panel
            </Card>
            <Card className="p-2 border-none text-white bg-[#F60CD7]">
              Continuously examines real-time blockchain data to detect the most
              lucrative staking and mining possibilities.
            </Card>
            <Card className="p-2 border-none bg-[#67E4F7]">
              Effortlessly assigns assets to top validators and mining groups,
              optimizing returns with minimal manual involvement.
            </Card>
            <Card className="p-2 border-none bg-[#A9DB53]">
              Continuously adjusts and reallocates revenue across various
              blockchains in real time to ensure optimal gains.
            </Card>
            <Card className="p-2 border-none text-white bg-[#475F9F]">
              Provides live data insights, performance metrics, and clear income
              monitoring within a simple, easy-to-navigate interface.
            </Card>
            <img className="col-span-2 w-full" src={TetherBanner} alt="" />
          </div>
        </section>

        {/* Growth Potential */}
        <section className="p-6">
          <h2 className="text-4xl font-bold text-white">
            <span className="text-[#FF0000]">GROWTH</span>
            <br />
            POTENTIAL
          </h2>

          <p className="mt-4 text-[20px] leading-[26px]">
            The Web3 & AI Auditing Sector is Accelerating!
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            💰 $100B+ in Total Value Locked (TVL) highlights the escalating need
            for decentralized, intelligent staking infrastructures.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            💸 $20B+ in Annual Validator and Staking Incentives reveals
            significant yield-generating opportunities across diverse blockchain
            environments.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            👥 5M+ Engaged Stakers signal a fast-expanding community seeking
            advanced, AI-enhanced monitoring solutions.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            <span className="font-bold text-[#ff0000]">Apart-X</span> addresses
            this surge with a next-generation, AI-powered, cross-chain auditing
            platform—enhancing staking efficiency, return optimization, and
            network scalability.
          </p>
          <img src={TetherGrowthPotentialLogo} alt="" className="w-full mt-4" />
        </section>
        {/* How Make Money */}
        <section className="p-6">
          <h2 className="text-4xl font-bold text-white text-end">
            HOW <span className="text-[#FF0000]">MAKE</span>
            <br />
            MONEY
          </h2>
          <p className="mt-4 text-[20px] leading-[26px]">
            <span className="font-bold text-[#ff0000]">Apart-X</span> is an
            autonomous, AI-powered Web3 platform designed to transform
            blockchain auditing and staking into scalable, high-revenue
            operations.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            Through advanced transaction flow automation and intelligent,
            algorithm-driven strategies, Apart-X maximizes yield generation
            while ensuring operational efficiency and seamless
            scalability—positioning itself as a robust solution in the rapidly
            expanding decentralized finance landscape.
          </p>
          <div className="justify-end flex">
            <img
              src={PdfWalletLogo}
              alt="Tether logo"
              className=" w-[155px] h-[163px] "
            />
          </div>
        </section>

        {/* How Apart-X Generate Profits */}
        <section className="p-6">
          <h2 className="text-4xl font-bold text-white mt-2">
            How <span className="text-[#FF0000]">Apart-X</span>
            <br />
            Generates Profits:
          </h2>

          <p className="mt-4 text-[20px]  text-[#ff0000] font-bold leading-[26px]">
            Powerful Staking. Zero Complexity.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            Validating blockchain transactions typically requires high
            computational power and costly, specialized hardware—barriers that
            exclude most users from participating.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            <span className="font-bold text-[#ff0000]">Apart-X</span> changes
            the game. This cutting-edge, AI-driven Web3 auditing platform
            enables anyone to earn staking rewards—without owning advanced
            infrastructure or needing deep technical expertise. Through
            intelligent automation, Apart-X strategically allocates assets to
            top-performing validators across multiple blockchains, amplifying
            returns while eliminating friction in the staking process.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            The platform generates revenue by applying a modest performance fee
            on the rewards earned, creating a scalable and recurring income
            model that grows with network activity.
          </p>
          <p className="mt-4 text-[20px] leading-[26px]">
            <span className="font-bold text-[#ff0000]">Apart-X</span> addresses
            this surge with a next-generation, AI-powered, cross-chain auditing
            platform—enhancing staking efficiency, return optimization, and
            network scalability.
          </p>
          <img
            src={GreenTetherLogo}
            alt=""
            className="w-[153px] h-[150px]  mx-auto mt-4"
          />
        </section>

        {/* How Apart-X  Generates Profits: */}
        <section className="p-6">
          <h2 className="text-4xl font-bold text-white mt-2">
            Revenue Model -
            <br />
            How <span className="text-[#FF0000]">Apart-X</span>
            <br /> Captures Value:
          </h2>

          <div className="grid grid-cols-2 font-medium text-center gap-6 mt-4 text-[20px] leading-[26px]">
            <Card className="p-2 border-none text-white bg-[#F60CD7]">
              FIRST
            </Card>
            <Card className="p-2 border-none text-black bg-[#66E3F6]">
              SECOND
            </Card>
            <Card className="p-2 border-none text-white bg-[#F60CD7]">
              Auditor Fees
            </Card>
            <Card className="p-2 border-none text-black bg-[#66E3F6]">
              Enterprise Licensing
            </Card>
            <Card className="p-2 border-none text-white bg-[#F60CD7]">
              A 2–5% performance fee is levied on returns generated through
              AI-powered crypto staking.
            </Card>
            <Card className="p-2 border-none text-black bg-[#66E3F6]">
              Custom integrations and dedicated infrastructure for institutions,
              protocols, and staking pools seeking enhanced auditing and
              optimization
            </Card>
            <Card className="p-2 border-none text-black bg-[#A9DB53]">
              THIRD
            </Card>
            <Card className="p-2 border-none text-white bg-[#475F9F]">
              FOURTH
            </Card>
            <Card className="p-2 border-none text-black bg-[#A9DB53]">
              Partnership
            </Card>
            <Card className="p-2 border-none text-white bg-[#475F9F]">
              Profit Sharing
            </Card>
            <Card className="p-2 border-none text-black bg-[#A9DB53]">
              Revenue-sharing arrangements with high-performing validators who
              gain delegated assets through the platform.
            </Card>
            <Card className="p-2 border-none text-white bg-[#475F9F]">
              The platform allows users to hold on to 80% of staking profits,
              with a 20% performance-based service fee paid to Apart-X.
            </Card>

            <img src={GoldTether} alt="" className="col-span-2 w-full mt-4" />
          </div>
        </section>
        <section className="p-6">
          <h2 className="text-4xl flex justify-between font-bold text-[#21C234] mt-2">
            <div>
              Terms <span className="text-white">&</span>
              <br />
              <span className="text-[#FF0000]">Condition.</span>
            </div>
            <img
              src={TermsConditionLogo}
              className="h-[84px] w-[84px]"
              alt=""
            />
          </h2>

          <ul className="list-disc list-outside text-[20px] leading-[26px] space-y-3  pl-6">
            {longTextItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <img src={TermsConditionTetherLogo} className="w-full mt-6" alt="" />
        </section>
        <section className="p-6">
          <h2 className="text-4xl flex justify-between font-bold text-white mt-2">
            <div>
              Top investment
              <br />
              plan - <span className="text-[#FF0000]">Apart-X</span>
            </div>
          </h2>
          <img src={InvestmentPlanLogo} className="w-full mt-6" alt="" />
          <img
            src={InvestmentPlanLogo2}
            className="w-[260px] h-[183px] mx-auto "
            alt=""
          />
          <img src={InvestmentPlanLogo3} className="mt-6 w-full " alt="" />
        </section>

        <section>
          <h2 className="text-4xl flex px-6 justify-between font-bold text-white mt-2">
            <div>
              HOW <span className="text-[#FF0000]">REFERRAL</span> <br />
              Plan - <span className="text-[#FF0000]">WORKS</span>
            </div>
          </h2>
          <img src={ReferralPlanChart} className="mt-6  w-full " alt="" />
        </section>
        <section>
          <div className="p-6">
            <h2 className="text-4xl flex mb-6 justify-between font-bold text-white mt-2">
              Thank You For Entrusting Your work to Our Company
            </h2>

            <ul className="list-disc list-outside text-[20px] leading-[26px] space-y-3  pl-6">
              {thankYouPoints.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className=" my-6 relative">
            <img src={LastImage} className=" w-full " alt="" />

            <img
              src={TetherCard}
              className="top-0 left-10 absolute w-[84px] h-[63px] "
              alt=""
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PDFViewer;
