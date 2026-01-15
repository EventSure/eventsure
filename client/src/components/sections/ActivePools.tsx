import { useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";

const Section = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  position: relative;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xxl} ${theme.spacing.md};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.secondary}20;
  border: 1px solid ${theme.colors.secondary}40;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: ${theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSize.xxl};
  }
`;

const SectionDescription = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${theme.spacing.sm};
`;

const SectionSubtext = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textMuted};
  margin: 0 auto;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xxl};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xl};
  }
`;

const FilterChip = styled.button<{ isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: 1px solid
    ${({ isActive }) =>
      isActive ? theme.colors.secondary : theme.colors.glassBorder};
  background: ${({ isActive }) =>
    isActive ? theme.colors.secondary : "transparent"};
  color: ${({ isActive }) =>
    isActive ? theme.colors.background : theme.colors.text};

  &:hover {
    border-color: ${theme.colors.secondary};
    background: ${({ isActive }) =>
      isActive ? theme.colors.secondary : `${theme.colors.secondary}20`};
  }
`;

const PoolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const PoolCard = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

const PoolHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PoolHeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
`;

const PoolIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surfaceLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    stroke: ${theme.colors.secondary};
    fill: none;
    stroke-width: 2;
  }
`;

const PoolMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const PoolCategory = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const PoolTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSize.md};
  }
`;

const StatusBadge = styled.span<{ status: "open" | "locked" | "resolved" }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};

  ${({ status }) => {
    switch (status) {
      case "open":
        return `
          background: ${theme.colors.secondary}20;
          border: 1px solid ${theme.colors.secondary}40;
          color: ${theme.colors.secondary};
        `;
      case "locked":
        return `
          background: ${theme.colors.primary}20;
          border: 1px solid ${theme.colors.primary}40;
          color: ${theme.colors.primary};
        `;
      case "resolved":
        return `
          background: ${theme.colors.warning}20;
          border: 1px solid ${theme.colors.warning}40;
          color: ${theme.colors.warning};
        `;
    }
  }}
`;

const PoolDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: ${theme.spacing.lg};
`;

const CoverageBox = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const CoverageLabel = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  margin-bottom: ${theme.spacing.xs};
`;

const CoverageText = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
`;

const StatValue = styled.div<{ highlight?: boolean }>`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${({ highlight }) =>
    highlight ? theme.colors.secondary : theme.colors.text};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSize.lg};
  }
`;

const PoolSizeContainer = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const PoolSizeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const PoolSizeLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`;

const PoolSizeValue = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeight.medium};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: linear-gradient(
    90deg,
    ${theme.colors.primary},
    ${theme.colors.secondary}
  );
  border-radius: ${theme.borderRadius.full};
  transition: width ${theme.transitions.normal};
`;

const ComingSoonButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-top: auto;
`;

type PoolStatus = "open" | "locked" | "resolved";
type FilterKey = "all" | "open" | "locked" | "resolved";

interface PoolData {
  id: string;
  categoryKey: "flightDelay" | "weather" | "tripCancel";
  status: PoolStatus;
  titleKey: string;
  descriptionKey: string;
  conditionKey: string;
  premium: number;
  maxPayout: number;
  members: number;
  endDate: string;
  poolSize: number;
  poolTarget: number;
  icon: "plane" | "cloud" | "suitcase";
}

const poolsData: PoolData[] = [
  {
    id: "1",
    categoryKey: "flightDelay",
    status: "open",
    titleKey: "activePools.pools.incheonTokyo.title",
    descriptionKey: "activePools.pools.incheonTokyo.description",
    conditionKey: "activePools.pools.incheonTokyo.condition",
    premium: 15000,
    maxPayout: 300000,
    members: 127,
    endDate: "2025.01.15",
    poolSize: 1905000,
    poolTarget: 3000000,
    icon: "plane",
  },
  {
    id: "2",
    categoryKey: "weather",
    status: "open",
    titleKey: "activePools.pools.jejuTyphoon.title",
    descriptionKey: "activePools.pools.jejuTyphoon.description",
    conditionKey: "activePools.pools.jejuTyphoon.condition",
    premium: 25000,
    maxPayout: 500000,
    members: 89,
    endDate: "2025.08.31",
    poolSize: 2225000,
    poolTarget: 5000000,
    icon: "cloud",
  },
  {
    id: "3",
    categoryKey: "flightDelay",
    status: "locked",
    titleKey: "activePools.pools.gimpoJeju.title",
    descriptionKey: "activePools.pools.gimpoJeju.description",
    conditionKey: "activePools.pools.gimpoJeju.condition",
    premium: 10000,
    maxPayout: 200000,
    members: 256,
    endDate: "2025.01.31",
    poolSize: 2560000,
    poolTarget: 3000000,
    icon: "plane",
  },
  {
    id: "4",
    categoryKey: "tripCancel",
    status: "resolved",
    titleKey: "activePools.pools.tokyoCherry.title",
    descriptionKey: "activePools.pools.tokyoCherry.description",
    conditionKey: "activePools.pools.tokyoCherry.condition",
    premium: 20000,
    maxPayout: 400000,
    members: 312,
    endDate: "2024.04.15",
    poolSize: 6240000,
    poolTarget: 6240000,
    icon: "suitcase",
  },
];

const filterMap: Record<FilterKey, PoolStatus | null> = {
  all: null,
  open: "open",
  locked: "locked",
  resolved: "resolved",
};

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const SuitcaseIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// const ArrowIcon = () => (
//   <svg viewBox="0 0 24 24">
//     <line x1="5" y1="12" x2="19" y2="12" />
//     <polyline points="12 5 19 12 12 19" />
//   </svg>
// )

const getPoolIcon = (icon: PoolData["icon"]) => {
  switch (icon) {
    case "plane":
      return <PlaneIcon />;
    case "cloud":
      return <CloudIcon />;
    case "suitcase":
      return <SuitcaseIcon />;
  }
};

const formatCurrency = (value: number, currency: string) => {
  return value.toLocaleString("ko-KR") + currency;
};

export const ActivePools = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredPools = poolsData.filter((pool) => {
    const statusFilter = filterMap[activeFilter];
    if (statusFilter === null) return true;
    return pool.status === statusFilter;
  });

  const filters: FilterKey[] = ["all", "open", "locked", "resolved"];

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionBadge>{t("activePools.badge")}</SectionBadge>
          <SectionTitle>{t("activePools.title")}</SectionTitle>
          <SectionDescription>
            {t("activePools.description")}
          </SectionDescription>
          <SectionSubtext>{t("activePools.subtext")}</SectionSubtext>
        </SectionHeader>

        <FilterContainer>
          {filters.map((filter) => (
            <FilterChip
              key={filter}
              isActive={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {t(`activePools.filters.${filter}`)}
            </FilterChip>
          ))}
        </FilterContainer>

        <PoolsGrid>
          {filteredPools.map((pool, index) => (
            <PoolCard
              key={pool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PoolHeader>
                <PoolHeaderLeft>
                  <PoolIcon>{getPoolIcon(pool.icon)}</PoolIcon>
                  <PoolMeta>
                    <PoolCategory>
                      {t(`activePools.categories.${pool.categoryKey}`)}
                    </PoolCategory>
                    <PoolTitle>{t(pool.titleKey)}</PoolTitle>
                  </PoolMeta>
                </PoolHeaderLeft>
                <StatusBadge status={pool.status}>
                  {t(`activePools.status.${pool.status}`)}
                </StatusBadge>
              </PoolHeader>

              <PoolDescription>{t(pool.descriptionKey)}</PoolDescription>

              <CoverageBox>
                <CoverageLabel>
                  {t("activePools.labels.coverageCondition")}
                </CoverageLabel>
                <CoverageText>{t(pool.conditionKey)}</CoverageText>
              </CoverageBox>

              <StatsRow>
                <StatItem>
                  <StatLabel>
                    <svg viewBox="0 0 24 24">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    {t("activePools.labels.premium")}
                  </StatLabel>
                  <StatValue>
                    {formatCurrency(pool.premium, t("common.currency"))}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>{t("activePools.labels.maxPayout")}</StatLabel>
                  <StatValue highlight>
                    {formatCurrency(pool.maxPayout, t("common.currency"))}
                  </StatValue>
                </StatItem>
              </StatsRow>

              <StatsRow>
                <StatItem>
                  <StatLabel>
                    <PeopleIcon />
                    {t("activePools.labels.members")}
                  </StatLabel>
                  <StatValue>
                    {pool.members}
                    {t("common.memberUnit")}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>
                    <ClockIcon />
                    {t("activePools.labels.endDate")}
                  </StatLabel>
                  <StatValue>{pool.endDate}</StatValue>
                </StatItem>
              </StatsRow>

              <PoolSizeContainer>
                <PoolSizeHeader>
                  <PoolSizeLabel>
                    {t("activePools.labels.poolSize")}
                  </PoolSizeLabel>
                  <PoolSizeValue>
                    {formatCurrency(pool.poolSize, t("common.currency"))}
                  </PoolSizeValue>
                </PoolSizeHeader>
                <ProgressBar>
                  <ProgressFill
                    percent={(pool.poolSize / pool.poolTarget) * 100}
                  />
                </ProgressBar>
              </PoolSizeContainer>

              <ComingSoonButton disabled>
                {t("activePools.labels.comingSoon")}
              </ComingSoonButton>
            </PoolCard>
          ))}
        </PoolsGrid>
      </Container>
    </Section>
  );
};
