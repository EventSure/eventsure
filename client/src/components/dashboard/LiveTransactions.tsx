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
  background: ${theme.colors.success}20;
  border: 1px solid ${theme.colors.success}40;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.success};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: ${theme.spacing.md};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.success};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};

  span {
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const SectionDescription = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const TransactionFeed = styled.div`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
`

const FeedHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.glassBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FeedTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  svg {
    width: 20px;
    height: 20px;
    fill: ${theme.colors.primary};
  }
`

const TxCount = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
`

const MockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.warning}15;
  border: 1px solid ${theme.colors.warning}30;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.warning};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
`

const FeedList = styled.div`
  height: 400px;
  overflow: hidden;
  position: relative;
`

const TransactionItem = styled(motion.div)`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.glassBorder};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  &:last-child {
    border-bottom: none;
  }
`

const TxIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ type }) => {
    switch (type) {
      case 'join':
        return `background: ${theme.colors.primary}20; color: ${theme.colors.primary};`
      case 'triggered':
        return `background: ${theme.colors.warning}20; color: ${theme.colors.warning};`
      case 'payout':
        return `background: ${theme.colors.secondary}20; color: ${theme.colors.secondary};`
      default:
        return `background: ${theme.colors.surfaceLight}; color: ${theme.colors.textSecondary};`
    }
  }}

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`

const TxInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TxType = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: 2px;
`

const TxDetails = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

const TxHash = styled.span`
  font-family: monospace;
  color: ${theme.colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const TxAmount = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const Amount = styled.div<{ positive?: boolean }>`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${({ positive }) => (positive ? theme.colors.success : theme.colors.text)};
`

const TxTime = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`

const StatsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const StatBox = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
`

const StatBoxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`

const StatBoxTitle = styled.h4`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.medium};
`

const StatBoxBadge = styled.span<{ trend?: 'up' | 'down' }>`
  font-size: ${theme.fontSize.xs};
  padding: 2px ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  background: ${({ trend }) =>
    trend === 'up' ? theme.colors.success + '20' : theme.colors.error + '20'};
  color: ${({ trend }) =>
    trend === 'up' ? theme.colors.success : theme.colors.error};
`

const StatBoxValue = styled.div`
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.xs};
`

const StatBoxSubtext = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`

const NetworkStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.sm};
`

const NetworkDot = styled.div`
  width: 10px;
  height: 10px;
  background: ${theme.colors.success};
  border-radius: 50%;
  animation: pulse 2s infinite;
`

const NetworkInfo = styled.div`
  flex: 1;
`

const NetworkName = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`

const NetworkStats = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
`

// Mock transaction data
interface Transaction {
  id: string
  type: 'join' | 'triggered' | 'payout'
  hash: string
  address: string
  amount: string
  flight?: string
  timestamp: Date
}

const transactionTypes = [
  { type: 'join' as const, flights: ['KE123', 'OZ456', 'AA789', 'UA234', 'DL567'] },
  { type: 'triggered' as const, flights: ['BA321', 'LH654', 'AF987', 'JL432', 'SQ765'] },
  { type: 'payout' as const, flights: ['EK111', 'QR222', 'TK333', 'CX444', 'NH555'] },
]

const generateMockTransaction = (): Transaction => {
  const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
  const amount = (Math.random() * 0.5 + 0.01).toFixed(4)

  return {
    id: Math.random().toString(36).substring(7),
    type: txType.type,
    hash: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
    address: '0x' + Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6),
    amount: amount + ' MNT',
    flight: txType.flights.length > 0 ? txType.flights[Math.floor(Math.random() * txType.flights.length)] : undefined,
    timestamp: new Date(),
  }
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'join':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      )
    case 'triggered':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'payout':
      return (
        <svg viewBox="0 0 24 24">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    default:
      return null
  }
}

const getTransactionLabel = (type: string, t: (key: string) => string) => {
  return t(`liveTransactions.txTypes.${type}`)
}

const formatTime = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ago`
}

export const LiveTransactions = () => {
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txPerSecond, setTxPerSecond] = useState(12.5)
  const [totalVolume, setTotalVolume] = useState(1234567)
  const [activePolicies, setActivePolicies] = useState(15234)

  useEffect(() => {
    // Initialize with some transactions
    const initial = Array.from({ length: 8 }, generateMockTransaction)
    setTransactions(initial)

    // Add new transactions periodically
    const interval = setInterval(() => {
      setTransactions((prev) => {
        const newTx = generateMockTransaction()
        return [newTx, ...prev.slice(0, 7)]
      })

      // Update stats
      setTxPerSecond((prev) => Math.max(8, Math.min(20, prev + (Math.random() - 0.5) * 2)))
      setTotalVolume((prev) => prev + Math.floor(Math.random() * 1000))
      setActivePolicies((prev) => prev + Math.floor(Math.random() * 3))
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Update time display
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionBadge>{t('liveTransactions.badge')}</SectionBadge>
          <SectionTitle>
            {t('liveTransactions.title')} <span>{t('liveTransactions.titleHighlight')}</span>
          </SectionTitle>
          <SectionDescription>
            {t('liveTransactions.description')}
          </SectionDescription>
        </SectionHeader>

        <DashboardGrid>
          <TransactionFeed>
            <FeedHeader>
              <FeedTitle>
                <svg viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                {t('liveTransactions.feedTitle')}
                <MockBadge>{t('liveTransactions.mockBadge')}</MockBadge>
              </FeedTitle>
              <TxCount>{txPerSecond.toFixed(1)} tx/s</TxCount>
            </FeedHeader>
            <FeedList>
              <AnimatePresence mode="popLayout">
                {transactions.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <TxIcon type={tx.type}>{getTransactionIcon(tx.type)}</TxIcon>
                    <TxInfo>
                      <TxType>{getTransactionLabel(tx.type, t)}</TxType>
                      <TxDetails>
                        <TxHash>{tx.hash}</TxHash>
                        {tx.flight && <span>• Flight {tx.flight}</span>}
                      </TxDetails>
                    </TxInfo>
                    <TxAmount>
                      <Amount positive={tx.type === 'payout'}>{tx.amount}</Amount>
                      <TxTime>{formatTime(tx.timestamp)}</TxTime>
                    </TxAmount>
                  </TransactionItem>
                ))}
              </AnimatePresence>
            </FeedList>
          </TransactionFeed>

          <StatsPanel>
            <StatBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <StatBoxHeader>
                <StatBoxTitle>{t('liveTransactions.stats.volume')}</StatBoxTitle>
                <StatBoxBadge trend="up">+12.5%</StatBoxBadge>
              </StatBoxHeader>
              <StatBoxValue>${totalVolume.toLocaleString()}</StatBoxValue>
              <StatBoxSubtext>{t('liveTransactions.stats.acrossAll')}</StatBoxSubtext>
            </StatBox>

            <StatBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <StatBoxHeader>
                <StatBoxTitle>{t('liveTransactions.stats.activeEpisodes')}</StatBoxTitle>
                <StatBoxBadge trend="up">+8.3%</StatBoxBadge>
              </StatBoxHeader>
              <StatBoxValue>{activePolicies.toLocaleString()}</StatBoxValue>
              <StatBoxSubtext>{t('liveTransactions.stats.participants')}</StatBoxSubtext>
            </StatBox>

            <StatBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <StatBoxHeader>
                <StatBoxTitle>{t('liveTransactions.stats.networkStatus')}</StatBoxTitle>
              </StatBoxHeader>
              <NetworkStatus>
                <NetworkDot />
                <NetworkInfo>
                  <NetworkName>Mantle Network</NetworkName>
                  <NetworkStats>Block #12,345,678 • Gas: 0.02 gwei</NetworkStats>
                </NetworkInfo>
              </NetworkStatus>
            </StatBox>
          </StatsPanel>
        </DashboardGrid>
      </Container>
    </Section>
  )
}
