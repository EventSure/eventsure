import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'
import { useAllEpisodes } from '@/hooks/useFactoryData'
import { EpisodeCard } from './EpisodeCard'
import type { ContractAddress } from '@/types/contract'

export const EpisodeList = () => {
  const { t } = useTranslation()
  const { data: episodes, isLoading, error } = useAllEpisodes()

  if (isLoading) {
    return (
      <Container>
        <LoadingGrid>
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </LoadingGrid>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>{t('episode.errorLoading')}</ErrorTitle>
          <ErrorMessage>{error.message}</ErrorMessage>
        </ErrorState>
      </Container>
    )
  }

  if (!episodes || episodes.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>{t('episode.noEpisodes')}</EmptyTitle>
          <EmptyMessage>{t('episode.noEpisodesDesc')}</EmptyMessage>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>{t('episode.allEpisodes')}</Title>
        <Count>{episodes.length} {t('episode.episodesAvailable')}</Count>
      </Header>

      <Grid>
        {episodes.map((address) => (
          <EpisodeCard key={address} address={address as ContractAddress} />
        ))}
      </Grid>
    </Container>
  )
}

const Container = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`

const Title = styled.h2`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
`

const Count = styled.span`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const LoadingGrid = styled(Grid)`
  opacity: 0.6;
`

const SkeletonCard = styled(motion.div)`
  height: 300px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
`

const EmptyTitle = styled.h3`
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`

const EmptyMessage = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
`

const ErrorState = styled(EmptyState)``

const ErrorIcon = styled(EmptyIcon)`
  color: ${theme.colors.error};
`

const ErrorTitle = styled(EmptyTitle)``

const ErrorMessage = styled(EmptyMessage)`
  color: ${theme.colors.error};
`
