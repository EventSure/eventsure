import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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

const Badge = styled.span<{ variant?: 'secondary' | 'success' | 'warning' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  background: ${({ variant }) => {
    if (variant === 'success') return `${theme.colors.success}20`
    if (variant === 'warning') return `${theme.colors.warning}20`
    return `${theme.colors.secondary}20`
  }};
  border: 1px solid ${({ variant }) => {
    if (variant === 'success') return `${theme.colors.success}40`
    if (variant === 'warning') return `${theme.colors.warning}40`
    return `${theme.colors.secondary}40`
  }};
  color: ${({ variant }) => {
    if (variant === 'success') return theme.colors.success
    if (variant === 'warning') return theme.colors.warning
    return theme.colors.secondary
  }};
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

const IconWrapper = styled.div<{ color?: string; rotate?: number }>`
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
    stroke: ${({ color }) => color || theme.colors.secondary};
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

const Button = styled.button<{ variant?: 'outline' | 'gradient' }>`
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

  ${({ variant }) =>
    variant === 'gradient'
      ? `
    background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.secondaryDark});
    border: none;
    color: ${theme.colors.background};
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px ${theme.colors.secondary}40;
    }
  `
      : `
    background: transparent;
    border: 1px solid ${theme.colors.glassBorder};
    color: ${theme.colors.text};
    &:hover {
      background: ${theme.colors.glassBorder};
      border-color: ${theme.colors.secondary};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.xl};
  padding: 0;

  &:hover {
    color: ${theme.colors.secondary};
  }
`

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`

const RuleItem = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`

const RuleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    stroke: ${theme.colors.secondary};
  }
`

const RuleContent = styled.div`
  flex: 1;
`

const RuleTitle = styled.h4`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.sm} 0;
`

const RuleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

const RuleDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.fontSize.sm};
`

const RuleDetailLabel = styled.span`
  color: ${theme.colors.textMuted};
`

const RuleDetailValue = styled.span<{ highlight?: boolean }>`
  color: ${({ highlight }) => (highlight ? theme.colors.secondary : theme.colors.text)};
  font-weight: ${theme.fontWeight.medium};
`

const CheckboxContainer = styled.label`
  display: flex;
  gap: ${theme.spacing.md};
  cursor: pointer;
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  line-height: 1.5;

  input {
    margin-top: 3px;
  }
`

const ModalCard = styled(GlassCard)`
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
`

const Divider = styled.div`
  height: 1px;
  background: ${theme.colors.glassBorder};
  margin: ${theme.spacing.lg} 0;
`

const InfoListItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSize.md};
`

const CountdownBox = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
  text-align: center;
`

const CountdownTimer = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-top: ${theme.spacing.xs};
`

const WarningBox = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  background: ${theme.colors.warning}10;
  border: 1px solid ${theme.colors.warning}20;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  text-align: left;
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};

  svg {
    width: 20px;
    height: 20px;
    stroke: ${theme.colors.warning};
    flex-shrink: 0;
  }
`

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  text-transform: uppercase;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.error};
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.5; }
    100% { transform: scale(0.95); opacity: 1; }
  }
`

const ProgressContainer = styled.div`
  margin: ${theme.spacing.lg} 0;
`

const ProgressBar = styled.div`
  height: 8px;
  background: ${theme.colors.surfaceLight};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
`

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${theme.colors.warning};
  transition: width 1s ease-in-out;
`

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`

const DashboardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
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

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const BroadcastIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
    <circle cx="2" cy="20" r="2" />
  </svg>
)

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

type ViewState = 'LIST' | 'RULES' | 'JOIN' | 'DASHBOARD'

export const ActiveEvents = () => {
  const { t } = useTranslation()
  const [view, setView] = useState<ViewState>('LIST')
  const [isAgreed, setIsAgreed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(12062)

  useEffect(() => {
    if (view === 'JOIN' || view === 'DASHBOARD') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [view])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const renderContent = () => {
    switch (view) {
      case 'LIST':
        return (
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
                <Badge variant="secondary">{t('activeEvents.status.recruiting')}</Badge>
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
              <Button onClick={() => setView('RULES')}>{t('activeEvents.labels.viewRules')}</Button>
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
                <Badge variant="secondary">{t('activeEvents.status.recruiting')}</Badge>
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
              <Button onClick={() => setView('RULES')}>{t('activeEvents.labels.viewRules')}</Button>
            </GlassCard>
          </Grid>
        )

      case 'RULES':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <BackLink onClick={() => setView('LIST')}>{t('activeEvents.labels.backToEvents')}</BackLink>
            <GlassCard>
              <DashboardHeader>
                <IconWrapper rotate={45}>
                  <PlaneIcon />
                </IconWrapper>
                <div>
                  <CardTitle>{t('activeEvents.events.ke902.title')}</CardTitle>
                  <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
                    {t('activeEvents.events.ke902.subtitle')}
                  </div>
                </div>
              </DashboardHeader>

              <div style={{ marginTop: theme.spacing.xl }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.lg }}>
                  <CardTitle style={{ fontSize: theme.fontSize.lg }}>Episode Rules</CardTitle>
                  <Badge>Read-only</Badge>
                </div>

                <RulesGrid>
                  <RuleItem>
                    <RuleIcon><DocIcon /></RuleIcon>
                    <RuleContent>
                      <RuleTitle>1. {t('activeEvents.labels.event')}</RuleTitle>
                      <RuleDetails>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.event')}:</RuleDetailLabel>
                          <RuleDetailValue>{t('activeEvents.events.ke902.title')}</RuleDetailValue>
                        </RuleDetailRow>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.eventWindow')}:</RuleDetailLabel>
                          <RuleDetailValue>{t('activeEvents.events.ke902.time')}</RuleDetailValue>
                        </RuleDetailRow>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.triggerCondition')}:</RuleDetailLabel>
                          <RuleDetailValue>{t('activeEvents.events.ke902.trigger')}</RuleDetailValue>
                        </RuleDetailRow>
                      </RuleDetails>
                    </RuleContent>
                  </RuleItem>

                  <RuleItem>
                    <RuleIcon><BroadcastIcon /></RuleIcon>
                    <RuleContent>
                      <RuleTitle>2. Oracle</RuleTitle>
                      <RuleDetails>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.dataSource')}:</RuleDetailLabel>
                          <RuleDetailValue>{t('activeEvents.events.ke902.oracle')}</RuleDetailValue>
                        </RuleDetailRow>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.resolutionTime')}:</RuleDetailLabel>
                          <RuleDetailValue>{t('activeEvents.events.ke902.resolution')}</RuleDetailValue>
                        </RuleDetailRow>
                      </RuleDetails>
                    </RuleContent>
                  </RuleItem>

                  <RuleItem>
                    <RuleIcon><DollarIcon /></RuleIcon>
                    <RuleContent>
                      <RuleTitle>3. Financial Terms</RuleTitle>
                      <RuleDetails>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.premium')}:</RuleDetailLabel>
                          <RuleDetailValue>25 USDC</RuleDetailValue>
                        </RuleDetailRow>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.maxPayout')}:</RuleDetailLabel>
                          <RuleDetailValue highlight>300 USDC</RuleDetailValue>
                        </RuleDetailRow>
                        <RuleDetailRow>
                          <RuleDetailLabel>{t('activeEvents.labels.additionalContributions')}:</RuleDetailLabel>
                          <RuleDetailValue highlight>{t('activeEvents.labels.none')}</RuleDetailValue>
                        </RuleDetailRow>
                      </RuleDetails>
                    </RuleContent>
                  </RuleItem>

                  <RuleItem>
                    <RuleIcon><UsersIcon /></RuleIcon>
                    <RuleContent>
                      <RuleTitle>4. {t('activeEvents.labels.poolLogic')}</RuleTitle>
                      <TriggerBox style={{ marginBottom: 0 }}>
                        <TriggerText style={{ fontSize: theme.fontSize.sm }}>
                          {t('activeEvents.labels.poolLogicDesc')}
                        </TriggerText>
                      </TriggerBox>
                    </RuleContent>
                  </RuleItem>
                </RulesGrid>

                <CheckboxContainer>
                  <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} />
                  <span>{t('activeEvents.labels.checkboxLabel')}</span>
                </CheckboxContainer>

                <Button variant="gradient" disabled={!isAgreed} onClick={() => setView('JOIN')}>
                  {t('activeEvents.labels.joinPool')}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )

      case 'JOIN':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <BackLink onClick={() => setView('RULES')}>{t('activeEvents.labels.backToRules')}</BackLink>
            <ModalCard>
              <IconWrapper style={{ margin: '0 auto 24px', width: 64, height: 64 }} rotate={45}>
                <PlaneIcon />
              </IconWrapper>
              <CardTitle style={{ marginBottom: theme.spacing.xs }}>{t('activeEvents.labels.joinPool')}</CardTitle>
              <div style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }}>
                {t('activeEvents.events.ke902.title')}
              </div>

              <div style={{ textAlign: 'left' }}>
                <InfoListItem>
                  <span style={{ color: theme.colors.textSecondary }}>{t('activeEvents.labels.premium')}</span>
                  <span>25 USDC</span>
                </InfoListItem>
                <InfoListItem>
                  <span style={{ color: theme.colors.textSecondary }}>{t('activeEvents.labels.maxLoss')}</span>
                  <span style={{ color: theme.colors.secondary }}>25 USDC</span>
                </InfoListItem>
                <InfoListItem>
                  <span style={{ color: theme.colors.textSecondary }}>{t('activeEvents.labels.maxPayout')}</span>
                  <span style={{ color: theme.colors.secondary }}>300 USDC</span>
                </InfoListItem>
              </div>

              <CountdownBox>
                <Label>{t('activeEvents.labels.poolClosesIn')}</Label>
                <CountdownTimer>{formatTime(timeLeft)}</CountdownTimer>
              </CountdownBox>

              <WarningBox>
                <WarningIcon />
                <span>{t('activeEvents.labels.warning')}</span>
              </WarningBox>

              <Button variant="gradient" onClick={() => setView('DASHBOARD')}>
                {t('activeEvents.labels.confirmAndJoin')}
              </Button>
            </ModalCard>
          </motion.div>
        )

      case 'DASHBOARD':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackLink onClick={() => setView('LIST')}>{t('activeEvents.labels.backToEvents')}</BackLink>
            <GlassCard>
              <DashboardHeader>
                <IconWrapper rotate={45}>
                  <PlaneIcon />
                </IconWrapper>
                <div style={{ flex: 1 }}>
                  <Label style={{ marginBottom: 2 }}>{t('activeEvents.labels.yourEpisode')}</Label>
                  <CardTitle>{t('activeEvents.events.ke902.title')}</CardTitle>
                  <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
                    {t('activeEvents.events.ke902.subtitle')}
                  </div>
                </div>
                <Badge variant="success">{t('activeEvents.status.inForce')}</Badge>
              </DashboardHeader>

              <CountdownBox style={{ margin: `0 0 ${theme.spacing.xl} 0` }}>
                <Label>{t('activeEvents.labels.eventEndsIn')}</Label>
                <CountdownTimer>{formatTime(timeLeft + 18743)}</CountdownTimer>
              </CountdownBox>

              <Label>{t('activeEvents.labels.triggerCondition')}</Label>
              <TriggerBox>
                <TriggerText>{t('activeEvents.events.ke902.trigger')}</TriggerText>
              </TriggerBox>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                <Label style={{ marginBottom: 0 }}>{t('activeEvents.labels.currentData')}</Label>
                <LiveBadge>{t('activeEvents.labels.live')}</LiveBadge>
              </div>

              <TriggerBox style={{ background: theme.colors.surfaceLight }}>
                <DashboardStats>
                  <StatItem>
                    <StatLabel>{t('activeEvents.labels.flightStatus')}</StatLabel>
                    <StatValue>En route</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>{t('activeEvents.labels.currentDelay')}</StatLabel>
                    <StatValue style={{ color: theme.colors.warning }}>1h 30m</StatValue>
                  </StatItem>
                </DashboardStats>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
                  <StatLabel>{t('activeEvents.labels.progressToTrigger')}</StatLabel>
                  <StatValue style={{ fontSize: theme.fontSize.xs }}>50%</StatValue>
                </div>
                <ProgressContainer>
                  <ProgressBar>
                    <ProgressFill percent={50} />
                  </ProgressBar>
                  <ProgressLabels>
                    <span>0h</span>
                    <span>3h (trigger)</span>
                  </ProgressLabels>
                </ProgressContainer>
              </TriggerBox>

              <div style={{ 
                background: theme.colors.surface, 
                padding: theme.spacing.md, 
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fontSize.xs,
                color: theme.colors.textMuted,
                lineHeight: 1.5,
                marginBottom: theme.spacing.xl
              }}>
                {t('activeEvents.labels.referenceOnly')}
              </div>

              <ActionRow>
                <Button variant="outline" onClick={() => setView('RULES')}>{t('activeEvents.labels.viewRules')}</Button>
                <Button variant="outline">{t('activeEvents.labels.viewResolution')}</Button>
              </ActionRow>
            </GlassCard>
          </motion.div>
        )
    }
  }

  return (
    <Section>
      <Container>
        <AnimatePresence mode="wait">
          {view === 'LIST' && (
            <SectionHeader
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SectionBadge>{t('activeEvents.badge')}</SectionBadge>
              <SectionTitle>{t('activeEvents.title')}</SectionTitle>
              <SectionSubtitle>{t('activeEvents.subtitle')}</SectionSubtitle>
            </SectionHeader>
          )}
        </AnimatePresence>

        {renderContent()}
      </Container>
    </Section>
  )
}
