import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { theme } from "@/styles/theme";
import { Header, Footer } from "@/components/layout";
import { useEpisodes } from "@/hooks/useEpisodes";

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  background: ${theme.colors.backgroundGradient};
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: ${theme.spacing.xxxl};
`;

const Section = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const EpisodeAddress = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  button {
    background: none;
    border: none;
    padding: 2px;
    color: ${theme.colors.textMuted};
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.secondary};
    }
  }
`;

const TimelineContainer = styled.div`
  padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  position: relative;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 45px;
  top: ${theme.spacing.xxl};
  bottom: ${theme.spacing.xxl};
  width: 2px;
  background: linear-gradient(to bottom, 
    ${theme.colors.glassBorder} 0%, 
    ${theme.colors.secondary}40 20%, 
    ${theme.colors.secondary}40 80%, 
    ${theme.colors.glassBorder} 100%
  );

  @media (max-width: ${theme.breakpoints.sm}) {
    left: 29px;
  }
`;

const TimelineEvent = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  z-index: 1;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EventMarker = styled.div<{ eventType: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${theme.colors.surface};
  border: 2px solid ${({ eventType }) => {
    switch (eventType) {
      case 'Created': return theme.colors.textMuted;
      case 'Open': return theme.colors.success;
      case 'Join': return theme.colors.primary;
      case 'Locked': return theme.colors.warning;
      case 'Resolved': return theme.colors.accent;
      default: return theme.colors.secondary;
    }
  }};
  box-shadow: 0 0 10px ${({ eventType }) => {
    switch (eventType) {
      case 'Created': return `${theme.colors.textMuted}40`;
      case 'Open': return `${theme.colors.success}40`;
      case 'Join': return `${theme.colors.primary}40`;
      case 'Locked': return `${theme.colors.warning}40`;
      case 'Resolved': return `${theme.colors.accent}40`;
      default: return `${theme.colors.secondary}40`;
    }
  }};

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ eventType }) => {
      switch (eventType) {
        case 'Created': return theme.colors.textMuted;
        case 'Open': return theme.colors.success;
        case 'Join': return theme.colors.primary;
        case 'Locked': return theme.colors.warning;
        case 'Resolved': return theme.colors.accent;
        default: return theme.colors.secondary;
      }
    }};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 24px;
    height: 24px;
    &::after {
      width: 8px;
      height: 8px;
    }
  }
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 4px;
  }
`;

const EventName = styled.div`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
`;

const EventTime = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const TxLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.secondary};
  text-decoration: none;
  margin-top: 8px;
  transition: opacity ${theme.transitions.fast};

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxxl};
  gap: ${theme.spacing.lg};
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.glassBorder};
  border-top-color: ${theme.colors.secondary};
  border-radius: 50%;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  background: ${theme.colors.glass};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.glassBorder};
`;

const EmptyTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const EmptyText = styled.p`
  color: ${theme.colors.textSecondary};
`;

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

interface EpisodeEvent {
  transactionHash: string;
  event: string;
  timeStamp: string;
  episodeAddress: string;
  flightName: string;
}

const useAllEpisodeEvents = (episodes: any[]) => {
  return useQuery({
    queryKey: ['allEpisodeEvents', episodes.map(ep => ep.address).join(',')],
    queryFn: async () => {
      const allEvents: EpisodeEvent[] = [];
      
      await Promise.all(
        episodes.map(async (episode) => {
          try {
            const response = await fetch(`https://eventsure-production.up.railway.app/api/episodes/${episode.address}/events`);
            if (!response.ok) return;
            const data = await response.json();
            
            const eventsWithEpisode = data.events.map((event: any) => ({
              ...event,
              episodeAddress: episode.address,
              flightName: episode.flightName,
            }));
            
            allEvents.push(...eventsWithEpisode);
          } catch (error) {
            console.error(`Failed to fetch events for ${episode.address}:`, error);
          }
        })
      );
      
      // Sort by timestamp descending (newest first)
      return allEvents.sort((a, b) => {
        return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
      });
    },
    enabled: episodes.length > 0,
  });
};

const UnifiedTimelineEvent = ({ event, index }: { event: EpisodeEvent, index: number }) => {
  const { t } = useTranslation();
  const truncatedAddress = `${event.episodeAddress.slice(0, 6)}...${event.episodeAddress.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(event.episodeAddress);
  };

  return (
    <TimelineEvent
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <EventMarker eventType={event.event} />
      <EventContent>
        <EventHeader>
          <EventName>{t(`eventHistory.events.${event.event.toLowerCase()}`, { defaultValue: event.event })}</EventName>
          <EventTime>{event.timeStamp}</EventTime>
        </EventHeader>
        <EpisodeAddress style={{ marginTop: '4px' }}>
          <span style={{ color: theme.colors.text, marginRight: '8px' }}>{event.flightName}</span>
          {truncatedAddress}
          <button onClick={handleCopy} title="Copy Address">
            <CopyIcon />
          </button>
        </EpisodeAddress>
        <TxLink 
          href={`https://sepolia.mantlescan.xyz/tx/${event.transactionHash}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {event.transactionHash.slice(0, 10)}...{event.transactionHash.slice(-8)}
          <ExternalIcon />
        </TxLink>
      </EventContent>
    </TimelineEvent>
  );
};

export const EventHistory = () => {
  const { t } = useTranslation();
  const { episodes, isLoading: episodesLoading } = useEpisodes();
  const { data: allEvents, isLoading: eventsLoading } = useAllEpisodeEvents(episodes);

  const isLoading = episodesLoading || eventsLoading;

  return (
    <PageContainer>
      <Header />
      <Content>
        <Section>
          <Container>
            <PageHeader>
              <PageTitle>{t("eventHistory.title", { defaultValue: "Event History" })}</PageTitle>
              <PageSubtitle>
                {t("eventHistory.subtitle", { defaultValue: "Explore the lifecycle of insurance episodes on Mantle Network." })}
              </PageSubtitle>
            </PageHeader>

            {isLoading ? (
              <LoadingContainer>
                <Spinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div style={{ color: theme.colors.textSecondary }}>
                  {t("activeEvents.loading", { defaultValue: "Loading episodes..." })}
                </div>
              </LoadingContainer>
            ) : !allEvents || allEvents.length === 0 ? (
              <EmptyState>
                <EmptyTitle>{t("eventHistory.noEpisodes", { defaultValue: "No episodes yet" })}</EmptyTitle>
                <EmptyText>{t("eventHistory.noEpisodesDesc", { defaultValue: "When insurance episodes are created, they will appear here." })}</EmptyText>
              </EmptyState>
            ) : (
              <div style={{ 
                background: theme.colors.glass, 
                backdropFilter: 'blur(12px)', 
                border: `1px solid ${theme.colors.glassBorder}`, 
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xxl 
              }}>
                <TimelineContainer>
                  <TimelineLine />
                  {allEvents.map((event, index) => (
                    <UnifiedTimelineEvent 
                      key={`${event.episodeAddress}-${event.transactionHash}`}
                      event={event}
                      index={index}
                    />
                  ))}
                </TimelineContainer>
              </div>
            )}
          </Container>
        </Section>
      </Content>
      <Footer />
    </PageContainer>
  );
};

export default EventHistory;
