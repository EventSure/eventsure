import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'
import { Button } from '@/components/common'
import { useEpisodeData, useUserEpisodeData } from '@/hooks/useEpisodeData'
import { useJoinEpisode, useClaimPayout, useWithdrawSurplus } from '@/hooks/useEpisodeActions'
import { EpisodeState, type ContractAddress } from '@/types/contract'

interface EpisodeCardProps {
  address: ContractAddress
}

const stateLabels: Record<number, { key: string; color: string }> = {
  [EpisodeState.Created]: { key: 'episode.state.created', color: theme.colors.textSecondary },
  [EpisodeState.Open]: { key: 'episode.state.open', color: theme.colors.success },
  [EpisodeState.Locked]: { key: 'episode.state.locked', color: theme.colors.warning },
  [EpisodeState.Resolved]: { key: 'episode.state.resolved', color: theme.colors.info },
  [EpisodeState.Settled]: { key: 'episode.state.settled', color: theme.colors.primary },
  [EpisodeState.Closed]: { key: 'episode.state.closed', color: theme.colors.textSecondary },
}

export const EpisodeCard = ({ address }: EpisodeCardProps) => {
  const { t } = useTranslation()
  const { address: userAddress } = useAccount()
  const [joinAmount, setJoinAmount] = useState('')

  const episodeData = useEpisodeData(address)
  const userData = useUserEpisodeData(address, userAddress)
  
  const { join, isPending: isJoining, isSuccess: joinSuccess, error: joinError } = useJoinEpisode(address)
  const { claim, isPending: isClaiming, isSuccess: claimSuccess, error: claimError } = useClaimPayout(address)
  const { withdraw, isPending: isWithdrawing, isSuccess: withdrawSuccess, error: withdrawError } = useWithdrawSurplus(address)

  const handleJoin = () => {
    if (!joinAmount || Number(joinAmount) <= 0) return
    try {
      join(parseEther(joinAmount))
    } catch (err) {
      console.error('Failed to join episode:', err)
    }
  }

  const handleClaim = () => {
    claim()
  }

  const handleWithdraw = () => {
    withdraw()
  }

  const stateInfo = stateLabels[episodeData.state]
  const hasParticipated = userData.premium > 0n

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <CardHeader>
        <EpisodeAddress>
          {address.slice(0, 6)}...{address.slice(-4)}
        </EpisodeAddress>
        <StateBadge color={stateInfo.color}>
          {t(stateInfo.key)}
        </StateBadge>
      </CardHeader>

      <Metrics>
        <MetricRow>
          <MetricLabel>{t('episode.totalPremium')}</MetricLabel>
          <MetricValue>{formatEther(episodeData.totalPremium)} ETH</MetricValue>
        </MetricRow>

        {episodeData.state === EpisodeState.Settled && (
          <>
            {episodeData.eventOccurred ? (
              <MetricRow>
                <MetricLabel>{t('episode.totalPayout')}</MetricLabel>
                <MetricValue>{formatEther(episodeData.totalPayout)} ETH</MetricValue>
              </MetricRow>
            ) : (
              <MetricRow>
                <MetricLabel>{t('episode.surplus')}</MetricLabel>
                <MetricValue>{formatEther(episodeData.surplus)} ETH</MetricValue>
              </MetricRow>
            )}
          </>
        )}

        {hasParticipated && (
          <MetricRow>
            <MetricLabel>{t('episode.yourPremium')}</MetricLabel>
            <MetricValue highlight>{formatEther(userData.premium)} ETH</MetricValue>
          </MetricRow>
        )}
      </Metrics>

      {userAddress && (
        <Actions>
          {userData.canJoin && (
            <JoinSection>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder={t('episode.enterAmount')}
                value={joinAmount}
                onChange={(e) => setJoinAmount(e.target.value)}
                disabled={isJoining}
              />
              <Button
                onClick={handleJoin}
                disabled={isJoining || !joinAmount || Number(joinAmount) <= 0}
                variant="primary"
                size="md"
              >
                {isJoining ? t('episode.joining') : t('episode.join')}
              </Button>
            </JoinSection>
          )}

          {userData.canClaim && (
            <ActionButton
              onClick={handleClaim}
              disabled={isClaiming}
              variant="primary"
            >
              {isClaiming ? t('episode.claiming') : t('episode.claim')}
            </ActionButton>
          )}

          {userData.canWithdraw && (
            <ActionButton
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              variant="secondary"
            >
              {isWithdrawing ? t('episode.withdrawing') : t('episode.withdrawSurplus')}
            </ActionButton>
          )}

          {userData.hasClaimed && (
            <SuccessMessage>✅ {t('episode.alreadyClaimed')}</SuccessMessage>
          )}

          {userData.hasWithdrawn && (
            <SuccessMessage>✅ {t('episode.alreadyWithdrawn')}</SuccessMessage>
          )}
        </Actions>
      )}

      {(joinSuccess || claimSuccess || withdrawSuccess) && (
        <FeedbackMessage type="success">
          {joinSuccess && t('episode.joinSuccess')}
          {claimSuccess && t('episode.claimSuccess')}
          {withdrawSuccess && t('episode.withdrawSuccess')}
        </FeedbackMessage>
      )}

      {(joinError || claimError || withdrawError) && (
        <FeedbackMessage type="error">
          {t('episode.transactionFailed')}: {(joinError || claimError || withdrawError)?.message}
        </FeedbackMessage>
      )}

      {!userAddress && (
        <ConnectPrompt>{t('episode.connectWallet')}</ConnectPrompt>
      )}
    </Card>
  )
}

const Card = styled(motion.div)`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primary}40;
    box-shadow: ${theme.shadows.glow};
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`

const EpisodeAddress = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  font-family: monospace;
  color: ${theme.colors.text};
`

const StateBadge = styled.span<{ color: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${({ color }) => color}20;
  border: 1px solid ${({ color }) => color}40;
  border-radius: ${theme.borderRadius.full};
  color: ${({ color }) => color};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`

const Metrics = styled.div`
  margin-bottom: ${theme.spacing.lg};
`

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border}30;

  &:last-child {
    border-bottom: none;
  }
`

const MetricLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`

const MetricValue = styled.span<{ highlight?: boolean }>`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${({ highlight }) => highlight ? theme.colors.primary : theme.colors.text};
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const JoinSection = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`

const Input = styled.input`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.surfaceLight};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.md};
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`

const ActionButton = styled(Button)`
  width: 100%;
`

const FeedbackMessage = styled.div<{ type: 'success' | 'error' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  background: ${({ type }) => type === 'success' ? theme.colors.success : theme.colors.error}20;
  border: 1px solid ${({ type }) => type === 'success' ? theme.colors.success : theme.colors.error}40;
  color: ${({ type }) => type === 'success' ? theme.colors.success : theme.colors.error};
  margin-top: ${theme.spacing.sm};
`

const SuccessMessage = styled.div`
  color: ${theme.colors.success};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  text-align: center;
`

const ConnectPrompt = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.surfaceLight};
  border-radius: ${theme.borderRadius.md};
`
