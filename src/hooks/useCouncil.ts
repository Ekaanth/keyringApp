import {isAscii, isFunction, isHex, isU8a, u8aToHex, u8aToString} from '@polkadot/util';
import {useEffect, useState} from 'react';
import {formatBalance, getBlockTime} from '../service/chainServices';
import useRpcConnect from './useRpcConnect';

const METHOD_TREA = ['approveProposal', 'rejectProposal'];

export function useCouncil() {
  const {apiLoaded: api} = useRpcConnect();
  const [proposals, setProposals] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCouncil() {
      setLoading(true);
      const [motions, electionsInfo, bestNumber] = await Promise.all([
        api?.derive.council.proposals(),
        api?.derive.elections.info(),
        api?.derive.chain.bestNumber(),
      ]);

      const councilMembers = electionsInfo?.members;

      if (motions) {
        Promise.all(
          motions.map((motion) => {
            return getMotionDetails(motion, api, councilMembers, bestNumber);
          }),
        ).then((proposals) => {
          setLoading(false);
          setProposals(proposals);
        });
      }
    }

    fetchCouncil().catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }, [api]);

  return {proposals, loading};
}

async function getMotionDetails(motion, api, councilMembers, bestNumber) {
  const treasuryInfo = await getMotionProposalTreasuryInfo(motion.proposal, api);

  const proposal = {
    hash: motion.proposal.hash.toString(),
    ...getCallParams(motion.proposal),
    ...treasuryInfo,
    index: motion.votes?.index.toString(),
  };

  return {
    proposal,
    votes: motion.votes ? getVotes(motion.votes, api) : undefined,
    votingStatus: motion.votes ? getVotingStatus(motion.votes, councilMembers.length, bestNumber, api) : undefined,
  };
}

export async function getMotionProposalTreasuryInfo(proposal, api) {
  const {method, section} = proposal.registry.findMetaCall(proposal.callIndex) ?? {};
  const isTreasury = section === 'treasury' && METHOD_TREA.includes(method);
  if (isTreasury) {
    const proposalId = (proposal.args[0] as Compact<ProposalIndex>).unwrap();
    const treasuryProposal = (await api.query.treasury.proposals(proposalId)).unwrap();

    return {
      beneficiary: {address: treasuryProposal.beneficiary.toString()},
      proposer: {address: treasuryProposal.proposer.toString()},
      payout: formatBalance(api, treasuryProposal.value),
      bond: formatBalance(api, treasuryProposal.bond),
    };
  }

  return {};
}

export function getCallParams(call) {
  const {method, section} = call?.registry.findMetaCall(call.callIndex) ?? {};
  const meta = formatCallMeta(call.registry.findMetaCall(call.callIndex).meta);

  return {
    method,
    section,
    meta,
    args: call.meta.args.map((a, index) => {
      let subCalls: any[] = [];

      let value: unknown = call.args?.[index];

      if (value) {
        if (Array.isArray(value) && a.type.toString() === 'Vec<Call>') {
          subCalls = value.map(getCallParams);
          value = 'SubCalls';
        } else if (a.type.toString() === 'Bytes') {
          value =
            isU8a(value) && isAscii(value)
              ? u8aToString(value)
              : isHex(value)
              ? value
              : u8aToHex(value as Uint8Array, 256);
        }
      }

      return {
        name: a.name.toString(),
        type: a.type.toString(),
        value: String(value),
        subCalls,
      };
    }),
  };
}

export function formatCallMeta(meta): string {
  if (!meta || !meta.docs.length) {
    return '';
  }

  const strings = meta.docs.map((doc) => doc.toString().trim());
  const firstEmpty = strings.findIndex((doc) => !doc.length);
  const combined = (firstEmpty === -1 ? strings : strings.slice(0, firstEmpty))
    .join(' ')
    .replace(/#(<weight>| <weight>).*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return parts.join(' ');
}

function splitParts(value: string): string[] {
  return ['[', ']'].reduce((result: string[], sep) => splitSingle(result, sep), [value]);
}

function splitSingle(value: string[], sep: string): string[] {
  return value.reduce((result: string[], _value: string): string[] => {
    return _value.split(sep).reduce((_result: string[], __value: string) => _result.concat(__value), result);
  }, []);
}

function getVotes(votes, api) {
  return {
    hash: votes.hash.toString(),
    threshold: votes.threshold.toNumber(),
    ayes: votes.ayes.map((accountId) => ({address: accountId.toString()})),
    nays: votes.nays.map((accountId) => ({address: accountId.toString()})),
    end: votes.end.toString(),
    endTime: getBlockTime(api, votes.end).timeStringParts,
  };
}

function getVotingStatus(votes, memberCount: number, bestNumber, api) {
  if (!votes.end) {
    return {
      hasFailed: false,
      hasPassed: false,
      isCloseable: false,
      isVoteable: true,
      remainingBlocks: undefined,
      remainingBlocksTime: undefined,
      status: 'Voteable',
    };
  }

  const section = 'council';
  const isEnd = bestNumber.gte(votes.end);
  const hasPassed = votes.threshold.lten(votes.ayes.length);
  const hasFailed = votes.threshold.gtn(Math.abs(memberCount - votes.nays.length));
  const isCloseable = isFunction(api.tx[section].close)
    ? api.tx[section].close.meta.args.length === 4 // current-generation
      ? isEnd || hasPassed || hasFailed
      : isEnd
    : false;
  const isVoteable = !isEnd;
  const remainingBlocks = votes.end.sub(bestNumber);
  const remainingBlocksTime = getBlockTime(api, remainingBlocks).timeStringParts;

  const status = isCloseable
    ? 'Closable'
    : isVoteable
    ? 'Voteable'
    : hasFailed
    ? 'Closed'
    : hasPassed
    ? 'Passed'
    : 'Open';

  return {
    hasFailed,
    hasPassed,
    isCloseable,
    isVoteable,
    remainingBlocks: remainingBlocks.toString(),
    remainingBlocksTime,
    status,
  };
}
