import { ApiPromise } from "@polkadot/api";
import { Hash } from "@polkadot/types/interfaces";
import { hexToString } from "@polkadot/util";
import { useEffect, useState } from "react";
import useRpcConnect from "./useRpcConnect";

export default function useTips() {
  const api = useRpcConnect();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTips() {
      setLoading(true);
      const hashes = await api?.query.tips.tips
        .keys()
        .then((keys) => keys.map((key) => key.args[0].toHex()));

      if (hashes?.length) {
        const optionTips = await api?.query.tips.tips.multi(hashes);
        const openTips = optionTips
          ?.map((opt, index) => [hashes[index] as string, opt.unwrapOr(null)])
          .filter((val) => hashes.includes(val[0]) && !!val[1])
          .sort((a, b) =>
            a[1].closes.isNone
              ? b[1].closes.isNone
                ? 0
                : -1
              : b[1].closes.isSome
              ? b[1].closes.unwrap().cmp(a[1].closes.unwrap())
              : 1
          );
        const tips =
          (await openTips?.map(async (openTip) => ({
            id: openTip[0],
            who: { address: openTip[1].who.toString() },
            finder: { address: openTip[1].finder.toString() },
            reason: await getTipReason(api, openTip[1].reason),
            closes: openTip[1].closes.unwrapOr(null)?.toString(),
            deposit: openTip[1].deposit.toString(),
            tippersCount: openTip[1].tips.length,
            tippers: extractTippers(openTip[1], api),
          }))) || [];

        Promise.all(tips).then((tips) => {
          setLoading(false);
          setTips(tips);
        });
      }
    }

    fetchTips().catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }, [api]);

  return { tips, loading };
}

const transformReason = {
  transform: (optBytes) =>
    optBytes.isSome ? hexToString(optBytes.unwrap().toHex()) : null,
};

async function getTipReason(api: ApiPromise, reasonHash: Hash) {
  const reasonText = await api.query.tips.reasons(reasonHash);
  const transformed = transformReason.transform(reasonText);

  return transformed || reasonHash.toHex();
}

function extractTippers(tip, api) {
  return tip.tips.map(([tipper, balance]) => ({
    address: tipper.toString(),
    balance: balance.toString(),
  }));
}
