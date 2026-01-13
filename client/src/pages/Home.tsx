import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { WorldMap } from "@/components/WorldMap";
import { Header, Footer } from "@/components/layout";
import { LiveTransactions } from "@/components/dashboard";
import {
  HowItWorks,
  FAQ,
  ActivePools,
} from "@/components/sections";
import { Button, GlassCard, StatCard } from "@/components/common";

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  min-height: 100vh;
  padding-top: 80px;
`;

const HeroSection = styled.section`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const HeroContent = styled(motion.div)`
  max-width: 900px;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.primary}20;
  border: 1px solid ${theme.colors.primary}40;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: ${theme.spacing.lg};
`;

const Title = styled(motion.h1)`
  font-size: clamp(40px, 8vw, ${theme.fontSize.display});
  font-weight: ${theme.fontWeight.extrabold};
  line-height: 1.1;
  margin-bottom: ${theme.spacing.lg};

  span {
    background: linear-gradient(
      135deg,
      ${theme.colors.primary} 0%,
      ${theme.colors.secondary} 50%,
      ${theme.colors.accent} 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.xxl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const StatsSection = styled(motion.section)`
  padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};
  max-width: 1000px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatValue = styled.div`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary},
    ${theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(GlassCard)`
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary}30,
    ${theme.colors.secondary}30
  );
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    fill: ${theme.colors.primary};
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text};
`;

const FeatureDescription = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

const ConnectedBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.success}20;
  border: 1px solid ${theme.colors.success}40;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.success};
  font-size: ${theme.fontSize.sm};
  margin-top: ${theme.spacing.lg};

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: ${theme.colors.success};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const Home = () => {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();

  return (
    <PageContainer>
      <WorldMap />
      <Header />

      <Content>
        <HeroSection>
          <HeroContent
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Badge variants={itemVariants}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {t("hero.badge")}
            </Badge>

            <Title variants={itemVariants}>
              {t("hero.title1")} <span>{t("hero.title2")}</span>
              <br />
              {t("hero.title3")}
            </Title>

            <Subtitle variants={itemVariants}>{t("hero.subtitle")}</Subtitle>

            <ButtonGroup variants={itemVariants}>
              <Button
                size="lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("hero.getCoverage")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("hero.learnMore")}
              </Button>
            </ButtonGroup>

            {isConnected && address && (
              <ConnectedBadge
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </ConnectedBadge>
            )}
          </HeroContent>
        </HeroSection>

        <StatsSection
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <StatsGrid>
            <StatCard whileHover={{ scale: 1.02 }}>
              <StatValue>$2.5M</StatValue>
              <StatLabel>{t("stats.tvl")}</StatLabel>
            </StatCard>
            <StatCard whileHover={{ scale: 1.02 }}>
              <StatValue>15K+</StatValue>
              <StatLabel>{t("stats.policies")}</StatLabel>
            </StatCard>
            <StatCard whileHover={{ scale: 1.02 }}>
              <StatValue>98%</StatValue>
              <StatLabel>{t("stats.claimRate")}</StatLabel>
            </StatCard>
            <StatCard whileHover={{ scale: 1.02 }}>
              <StatValue>5 min</StatValue>
              <StatLabel>{t("stats.payoutTime")}</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>

        <HowItWorks />

        <FeaturesSection>
          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FeatureIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>{t("features.security.title")}</FeatureTitle>
              <FeatureDescription>
                {t("features.security.description")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeatureIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>{t("features.claims.title")}</FeatureTitle>
              <FeatureDescription>
                {t("features.claims.description")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FeatureIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>{t("features.mutual.title")}</FeatureTitle>
              <FeatureDescription>
                {t("features.mutual.description")}
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        <ActivePools />
        <LiveTransactions />
        <FAQ />
      </Content>

      <Footer />
    </PageContainer>
  );
};
