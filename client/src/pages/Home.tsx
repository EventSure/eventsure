import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { theme } from "@/styles/theme";
import { WorldMap } from "@/components/WorldMap";
import { Header, Footer } from "@/components/layout";
import { LiveTransactions } from "@/components/dashboard";
import { HowItWorks, FAQ, ActivePools } from "@/components/sections";
import { Button, GlassCard } from "@/components/common";

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

  .brand {
    background: linear-gradient(
      135deg,
      ${theme.colors.primary} 0%,
      ${theme.colors.secondary} 50%,
      ${theme.colors.accent} 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.xl};
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
`;

const Highlights = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xxl};
  flex-wrap: wrap;
`;

const HighlightItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.semibold};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.primary}40;
    background: ${theme.colors.primary}05;
    transform: translateY(-2px) !important;
  }

  svg {
    color: ${theme.colors.primary};
    width: 16px;
    height: 16px;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const WhatIsSection = styled(motion.section)`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  display: flex;
  justify-content: center;
  background: radial-gradient(
    circle at 50% 0%,
    ${theme.colors.primary}05 0%,
    transparent 70%
  );
`;

const WhatIsContent = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const WhatIsTitle = styled.h2`
  font-size: clamp(32px, 5vw, ${theme.fontSize.xxxl});
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.xxl};
  text-align: center;
  color: ${theme.colors.text};
`;

const WhatIsDescription = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxxl};
  padding: ${theme.spacing.xxl};
  background: ${theme.colors.background}30;
  border-radius: ${theme.borderRadius.xxl};
  border: 1px solid ${theme.colors.border};
  backdrop-filter: blur(10px);
  position: relative;

  p {
    font-size: ${theme.fontSize.lg};
    color: ${theme.colors.textSecondary};
    line-height: 1.8;
    text-align: left;
    max-width: 100%;
    margin: 0;
    position: relative;
  }

  p:first-of-type {
    font-size: ${theme.fontSize.xl};
    color: ${theme.colors.text};
    font-weight: ${theme.fontWeight.semibold};
    line-height: 1.6;
    margin-bottom: ${theme.spacing.md};
    text-align: center;
    padding-bottom: ${theme.spacing.xl};
    border-bottom: 1px solid ${theme.colors.border};
  }

  strong {
    color: ${theme.colors.primary};
    font-weight: ${theme.fontWeight.bold};
  }
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
  const navigate = useNavigate();

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
              <span className="brand">{t("hero.title1")}</span>{" "}
              {t("hero.title2")}
              <br />
              {t("hero.title3")}
            </Title>

            <Subtitle variants={itemVariants}>{t("hero.subtitle")}</Subtitle>

            <Highlights
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {(t("hero.highlights", { returnObjects: true }) as string[]).map(
                (highlight, index) => (
                  <HighlightItem key={index} variants={itemVariants}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {highlight}
                  </HighlightItem>
                )
              )}
            </Highlights>

            <ButtonGroup variants={itemVariants}>
              <Button
                size="lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/explorer")}
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

        <WhatIsSection
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <WhatIsContent>
            <WhatIsTitle>{t("whatIs.title")}</WhatIsTitle>
            <WhatIsDescription
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.p variants={itemVariants}>
                {t("whatIs.description1")}
              </motion.p>
              <motion.p variants={itemVariants}>
                {t("whatIs.description2")}
              </motion.p>
              <motion.p variants={itemVariants}>
                {t("whatIs.description3")}
              </motion.p>
              <motion.p variants={itemVariants}>
                {t("whatIs.description4")}
              </motion.p>
              <motion.p variants={itemVariants}>
                {t("whatIs.description5")}
              </motion.p>
            </WhatIsDescription>
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
          </WhatIsContent>
        </WhatIsSection>

        {/* <StatsSection
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
        </StatsSection> */}

        <HowItWorks />

        <ActivePools />
        <LiveTransactions />
        <FAQ />
      </Content>

      <Footer />
    </PageContainer>
  );
};
