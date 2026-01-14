import { formatEther } from 'viem';
import type { EpisodeData } from '@/types/episode';
import { EpisodeState } from '@/types/episode';

export const getStateLabel = (state: number): string => {
  switch (state) {
    case EpisodeState.Created: return 'created';
    case EpisodeState.Open: return 'open';
    case EpisodeState.Locked: return 'locked';
    case EpisodeState.Resolved: return 'resolved';
    case EpisodeState.Settled: return 'settled';
    case EpisodeState.Closed: return 'closed';
    default: return 'unknown';
  }
};

export const getStateBadgeVariant = (state: number): 'secondary' | 'success' | 'warning' => {
  switch (state) {
    case EpisodeState.Open: return 'secondary';
    case EpisodeState.Settled: return 'success';
    case EpisodeState.Locked:
    case EpisodeState.Resolved: return 'warning';
    default: return 'secondary';
  }
};

export const formatDateTime = (timestamp: bigint, locale: string): string => {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  const localeStr = locale === 'ko' ? 'ko-KR' : 'en-US';
  return date.toLocaleString(localeStr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatDateRange = (start: bigint, end: bigint, locale: string): string => {
  if (!start || !end) return '';
  const startDate = new Date(Number(start) * 1000);
  const endDate = new Date(Number(end) * 1000);
  const localeStr = locale === 'ko' ? 'ko-KR' : 'en-US';
  
  const startStr = startDate.toLocaleString(localeStr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const endStr = endDate.toLocaleString(localeStr, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  return `${startStr} ~ ${endStr}`;
};

export const formatMNT = (value: bigint): string => {
  return `${formatEther(value)} MNT`;
};

export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getTriggerCondition = (_episode: EpisodeData, t: (key: string) => string): string => {
  return t("activeEvents.defaultTrigger");
};

export const getResolutionTime = (episode: EpisodeData, locale: string, t: (key: string) => string): string => {
  if (!episode.estimatedArrivalTime) return t("activeEvents.labels.afterArrival");
  const arrivalDate = new Date(Number(episode.estimatedArrivalTime) * 1000);
  const localeStr = locale === 'ko' ? 'ko-KR' : 'en-US';
  return arrivalDate.toLocaleString(localeStr, {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' ' + t("activeEvents.labels.afterArrival");
};
