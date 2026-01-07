import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { theme } from '@/styles/theme'

const Section = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  position: relative;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
`

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
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
`

const SectionSubtitle = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const GlassCard = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
`

const Badge = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  background: ${theme.colors.secondary}20;
  border: 1px solid ${theme.colors.secondary}40;
  color: ${theme.colors.secondary};
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
`

const CategoryLabel = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${theme.spacing.xs};
`

const CardTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin: 0;
`

const IconWrapper = styled.div<{ rotate?: number }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surfaceLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};

  svg {
    width: 24px;
    height: 24px;
    stroke: ${theme.colors.secondary};
    fill: none;
    stroke-width: 2;
    transform: ${({ rotate }) => (rotate ? `rotate(${rotate}deg)` : 'none')};
  }
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
`

const TriggerBox = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
`

const Label = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing.xs};
`

const TriggerText = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text};
`

const StatsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.glassBorder};
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`

const StatLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  margin-bottom: 2px;
`

const StatValue = styled.span<{ highlight?: boolean }>`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${({ highlight }) => (highlight ? theme.colors.secondary : theme.colors.text)};
`

const Button = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  background: transparent;
  border: 1px solid ${theme.colors.glassBorder};
  color: ${theme.colors.text};

  &:hover {
    background: ${theme.colors.glassBorder};
    border-color: ${theme.colors.secondary};
  }
`

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
)

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export const ActiveEvents = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleViewRules = (eventId: string) => {
    navigate(`/explorer?event=${eventId}`)
  }

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionBadge>{t('activeEvents.badge')}</SectionBadge>
          <SectionTitle>{t('activeEvents.title')}</SectionTitle>
          <SectionSubtitle>{t('activeEvents.subtitle')}</SectionSubtitle>
        </SectionHeader>

        <Grid>
          <GlassCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <CardHeader>
              <IconWrapper rotate={45}>
                <PlaneIcon />
              </IconWrapper>
              <Badge>{t('activeEvents.status.recruiting')}</Badge>
            </CardHeader>
            <CategoryLabel>{t('activeEvents.categories.flightDelay')}</CategoryLabel>
            <CardTitle>{t('activeEvents.events.ke902.title')}</CardTitle>
            <InfoRow style={{ marginTop: theme.spacing.md }}>
              <CalendarIcon />
              {t('activeEvents.events.ke902.time')}
            </InfoRow>
            <TriggerBox>
              <Label>{t('activeEvents.labels.trigger')}</Label>
              <TriggerText>{t('activeEvents.events.ke902.trigger')}</TriggerText>
            </TriggerBox>
            <StatsRow>
              <StatItem>
                <StatLabel>{t('activeEvents.labels.premium')}</StatLabel>
                <StatValue>25 USDC</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>{t('activeEvents.labels.maxPayout')}</StatLabel>
                <StatValue highlight>300 USDC</StatValue>
              </StatItem>
            </StatsRow>
            <Button onClick={() => handleViewRules('ke902')}>{t('activeEvents.labels.viewRules')}</Button>
          </GlassCard>

          <GlassCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <CardHeader>
              <IconWrapper>
                <CloudIcon />
              </IconWrapper>
              <Badge>{t('activeEvents.status.recruiting')}</Badge>
            </CardHeader>
            <CategoryLabel>{t('activeEvents.categories.weather')}</CategoryLabel>
            <CardTitle>{t('activeEvents.events.jejuTyphoon.title')}</CardTitle>
            <InfoRow style={{ marginTop: theme.spacing.md }}>
              <CalendarIcon />
              {t('activeEvents.events.jejuTyphoon.time')}
            </InfoRow>
            <TriggerBox>
              <Label>{t('activeEvents.labels.trigger')}</Label>
              <TriggerText>{t('activeEvents.events.jejuTyphoon.trigger')}</TriggerText>
            </TriggerBox>
            <StatsRow>
              <StatItem>
                <StatLabel>{t('activeEvents.labels.premium')}</StatLabel>
                <StatValue>50 USDC</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>{t('activeEvents.labels.maxPayout')}</StatLabel>
                <StatValue highlight>500 USDC</StatValue>
              </StatItem>
            </StatsRow>
            <Button onClick={() => handleViewRules('jejuTyphoon')}>{t('activeEvents.labels.viewRules')}</Button>
          </GlassCard>
        </Grid>
      </Container>
    </Section>
  )
}
