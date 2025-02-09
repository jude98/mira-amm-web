import {CurrencyBoxMode, SwapState} from "@/src/components/common/Swap/Swap";
import useSwapData from "./useAssetPair/useSwapData";
import useAsset from "./useAsset";
import {useMemo} from "react";
import {bn} from "fuels";
import useSwapRouter, {TradeType} from "./useSwapRouter";

const useSwapPreview = (swapState: SwapState, mode: CurrencyBoxMode) => {
  const {sellAssetId, buyAssetId} = useSwapData(swapState);

  const {asset: assetIn} = useAsset(sellAssetId);
  const {asset: assetOut} = useAsset(buyAssetId);

  const tradeType = mode === "buy" ? TradeType.EXACT_OUT : TradeType.EXACT_IN;

  const rawUserInputAmount = useMemo(() => {
    const amountString =
      tradeType === TradeType.EXACT_IN
        ? swapState.sell.amount
        : swapState.buy.amount;
    const amount = parseFloat(amountString);
    const amountValid = !isNaN(amount);
    if (!assetIn || !assetOut) return bn(0);
    const decimals =
      tradeType === TradeType.EXACT_IN ? assetIn.decimals : assetOut.decimals;

    try {
      return amountValid ? bn.parseUnits(amountString, decimals) : bn(0);
    } catch (error) {
      console.error("Error parsing units:", error);
      return bn(0);
    }
  }, [
    assetIn,
    assetOut,
    swapState.buy.amount,
    swapState.sell.amount,
    tradeType,
  ]);

  const {trade} = useSwapRouter(
    tradeType,
    rawUserInputAmount,
    assetIn,
    assetOut,
  );

  console.log(
    trade?.amountIn?.toString(),
    trade?.amountOut?.toString(),
    "preview",
  );
};

export default useSwapPreview;
