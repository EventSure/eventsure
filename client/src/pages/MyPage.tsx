import { useMemo } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { theme } from "@/styles/theme";
import { Header, Footer } from "@/components/layout";
import { useMyEpisodes } from "@/hooks/useMyEpisodes";
import { EpisodeState } from "@/types/episode";
import * as episodeUtils from "@/utils/episode";

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
  max-width: 1200px;
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
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Badge = styled.span<{
  variant?: "secondary" | "success" | "warning" | "error";
}>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  background: ${({ variant }) => {
    if (variant === "success") return `${theme.colors.success}20`;
    if (variant === "warning") return `${theme.colors.warning}20`;
    if (variant === "error") return `${theme.colors.error}20`;
    return `${theme.colors.secondary}20`;
  }};
  border: 1px solid
    ${({ variant }) => {
      if (variant === "success") return `${theme.colors.success}40`;
      if (variant === "warning") return `${theme.colors.warning}40`;
      if (variant === "error") return `${theme.colors.error}40`;
      return `${theme.colors.secondary}40`;
    }};
  color: ${({ variant }) => {
    if (variant === "success") return theme.colors.success;
    if (variant === "warning") return theme.colors.warning;
    if (variant === "error") return theme.colors.error;
    return theme.colors.secondary;
  }};
`;

const EpisodeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxxl};
`;

const EpisodeCard = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
    border-color: ${theme.colors.secondary}40;
  }
`;

const EpisodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
`;

const EpisodeInfo = styled.div`
  flex: 1;
`;

const EpisodeTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const EpisodeDate = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
`;

const TriggerInfo = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

const EpisodeStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.glassBorder};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  margin-bottom: 2px;
`;

const StatValue = styled.span<{ highlight?: boolean }>`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${({ highlight }) =>
    highlight ? theme.colors.secondary : theme.colors.text};
`;

const MonitoringSection = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.lg};
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing.md};

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: ${theme.colors.error};
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.5;
    }
    100% {
      transform: scale(0.95);
      opacity: 1;
    }
  }
`;

const MonitoringStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  color: ${theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg};

  svg {
    width: 40px;
    height: 40px;
    stroke: ${theme.colors.textMuted};
  }
`;

const EmptyTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
`;

const ExploreButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary},
    ${theme.colors.secondaryDark}
  );
  border: none;
  color: ${theme.colors.background};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${theme.colors.secondary}40;
  }
`;

const ViewRulesButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  background: transparent;
  border: 1px solid ${theme.colors.glassBorder};
  color: ${theme.colors.text};
  margin-top: ${theme.spacing.lg};

  &:hover {
    border-color: ${theme.colors.secondary};
    background: ${theme.colors.glassBorder};
  }
`;

const ConnectPrompt = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
`;

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

export const MyEpisodes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const { episodes, isLoading } = useMyEpisodes();

  const activeEpisodes = useMemo(() => {
    return episodes.filter(
      (ep) =>
        ep.state === EpisodeState.Open ||
        ep.state === EpisodeState.Locked ||
        ep.state === EpisodeState.Resolved
    );
  }, [episodes]);

  const pastEpisodes = useMemo(() => {
    return episodes.filter(
      (ep) =>
        ep.state === EpisodeState.Settled || ep.state === EpisodeState.Closed
    );
  }, [episodes]);

  const handleEpisodeClick = (episodeAddress: string) => {
    navigate(`/explorer?event=${episodeAddress}`);
  };

  if (!isConnected) {
    return (
      <PageContainer>
        <Header />
        <Content>
          <Section>
            <Container>
              <ConnectPrompt>
                <EmptyIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </EmptyIcon>
                <EmptyTitle>{t("myEpisodes.connectWallet")}</EmptyTitle>
                <EmptyText>{t("myEpisodes.connectWalletDesc")}</EmptyText>
              </ConnectPrompt>
            </Container>
          </Section>
        </Content>
        <Footer />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <Header />
        <Content>
          <Section>
            <Container>
              <EmptyState>
                <EmptyTitle>{t("myEpisodes.loading")}</EmptyTitle>
              </EmptyState>
            </Container>
          </Section>
        </Content>
        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <Content>
        <Section>
          <Container>
            <PageHeader>
              <PageTitle>{t("myEpisodes.title")}</PageTitle>
              <PageSubtitle>
                {t("myEpisodes.subtitle", {
                  address: `${address?.slice(0, 6)}...${address?.slice(-4)}`,
                })}
              </PageSubtitle>
            </PageHeader>

            <SectionTitle>
              {t("myEpisodes.activeEpisodes")}
              <Badge variant="success">{activeEpisodes.length}</Badge>
            </SectionTitle>

            {activeEpisodes.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <PlaneIcon />
                </EmptyIcon>
                <EmptyTitle>{t("myEpisodes.noActiveEpisodes")}</EmptyTitle>
                <EmptyText>{t("myEpisodes.noActiveEpisodesDesc")}</EmptyText>
                <ExploreButton onClick={() => navigate("/explorer")}>
                  {t("myEpisodes.exploreEpisodes")}
                </ExploreButton>
              </EmptyState>
            ) : (
              <EpisodeList>
                {activeEpisodes.map((episode, index) => (
                  <EpisodeCard
                    key={episode.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleEpisodeClick(episode.address)}
                  >
                    <EpisodeHeader>
                      <EpisodeInfo>
                        <EpisodeTitle>{episode.flightName}</EpisodeTitle>
                        <EpisodeDate>
                          {episodeUtils.formatDateTime(
                            episode.departureTime,
                            i18n.language
                          )}
                        </EpisodeDate>
                        <TriggerInfo>
                          {episodeUtils.getTriggerCondition(episode, t)}
                        </TriggerInfo>
                      </EpisodeInfo>
                      <Badge
                        variant={episodeUtils.getStateBadgeVariant(
                          episode.state
                        )}
                      >
                        {t(
                          `activeEvents.status.${episodeUtils.getStateLabel(
                            episode.state
                          )}`
                        )}
                      </Badge>
                    </EpisodeHeader>

                    <EpisodeStats>
                      <StatItem>
                        <StatLabel>
                          {t("activeEvents.labels.premium")}
                        </StatLabel>
                        <StatValue>
                          {episodeUtils.formatMNT(episode.premiumAmount)}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>
                          {t("activeEvents.labels.maxPayout")}
                        </StatLabel>
                        <StatValue highlight>
                          {episodeUtils.formatMNT(episode.payoutAmount)}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>
                          {t("activeEvents.labels.poolSize")}
                        </StatLabel>
                        <StatValue>
                          {episodeUtils.formatMNT(episode.totalPremium)}
                        </StatValue>
                      </StatItem>
                    </EpisodeStats>

                    {(episode.state === EpisodeState.Open ||
                      episode.state === EpisodeState.Locked) && (
                      <MonitoringSection>
                        <LiveBadge>{t("activeEvents.labels.live")}</LiveBadge>
                        <MonitoringStats>
                          <StatItem>
                            <StatLabel>
                              {t("activeEvents.labels.flightStatus")}
                            </StatLabel>
                            <StatValue>
                              {t("activeEvents.labels.enRoute")}
                            </StatValue>
                          </StatItem>
                          <StatItem>
                            <StatLabel>
                              {t("activeEvents.labels.currentDelay")}
                            </StatLabel>
                            <StatValue style={{ color: theme.colors.warning }}>
                              1h 30m
                            </StatValue>
                          </StatItem>
                        </MonitoringStats>
                      </MonitoringSection>
                    )}

                    <ViewRulesButton
                      onClick={() =>
                        navigate(`/explorer?event=${episode.address}`)
                      }
                    >
                      {t("myEpisodes.labels.viewRules")}
                    </ViewRulesButton>
                  </EpisodeCard>
                ))}
              </EpisodeList>
            )}

            <SectionTitle>
              {t("myEpisodes.pastEpisodes")}
              <Badge>{pastEpisodes.length}</Badge>
            </SectionTitle>

            {pastEpisodes.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </EmptyIcon>
                <EmptyTitle>{t("myEpisodes.noPastEpisodes")}</EmptyTitle>
                <EmptyText>{t("myEpisodes.noPastEpisodesDesc")}</EmptyText>
              </EmptyState>
            ) : (
              <EpisodeList>
                {pastEpisodes.map((episode, index) => (
                  <EpisodeCard
                    key={episode.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleEpisodeClick(episode.address)}
                  >
                    <EpisodeHeader>
                      <EpisodeInfo>
                        <EpisodeTitle>{episode.flightName}</EpisodeTitle>
                        <EpisodeDate>
                          {episodeUtils.formatDateTime(
                            episode.departureTime,
                            i18n.language
                          )}
                        </EpisodeDate>
                        <TriggerInfo>
                          {episodeUtils.getTriggerCondition(episode, t)}
                        </TriggerInfo>
                      </EpisodeInfo>
                      <Badge
                        variant={episodeUtils.getStateBadgeVariant(
                          episode.state
                        )}
                      >
                        {t(
                          `activeEvents.status.${episodeUtils.getStateLabel(
                            episode.state
                          )}`
                        )}
                      </Badge>
                    </EpisodeHeader>

                    <EpisodeStats>
                      <StatItem>
                        <StatLabel>
                          {t("activeEvents.labels.premium")}
                        </StatLabel>
                        <StatValue>
                          {episodeUtils.formatMNT(episode.premiumAmount)}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>
                          {t("activeEvents.labels.maxPayout")}
                        </StatLabel>
                        <StatValue highlight>
                          {episodeUtils.formatMNT(episode.payoutAmount)}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>
                          {t("activeEvents.labels.poolSize")}
                        </StatLabel>
                        <StatValue>
                          {episodeUtils.formatMNT(episode.totalPremium)}
                        </StatValue>
                      </StatItem>
                    </EpisodeStats>
                  </EpisodeCard>
                ))}
              </EpisodeList>
            )}
          </Container>
        </Section>
      </Content>
      <Footer />
    </PageContainer>
  );
};
