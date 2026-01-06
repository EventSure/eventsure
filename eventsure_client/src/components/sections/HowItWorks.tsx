import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'

const Section = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxxl};
`

const SectionBadge = styled.div`
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
  margin-bottom: ${theme.spacing.md};
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

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxl};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${theme.colors.primary}40,
      ${theme.colors.secondary}40,
      transparent
    );
    transform: translateX(-50%);

    @media (max-width: ${theme.breakpoints.lg}) {
      left: 24px;
    }
  }
`

const StepRow = styled(motion.div)<{ reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${theme.spacing.xl};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: auto 1fr;
    gap: ${theme.spacing.lg};
  }
`

const StepContent = styled.div<{ align?: 'left' | 'right' }>`
  text-align: ${({ align }) => align || 'left'};

  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: left;
    order: 2;
  }
`

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: white;
  position: relative;
  z-index: 2;
  box-shadow: ${theme.shadows.glowStrong};
`

const StepCard = styled.div`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  max-width: 400px;

  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 100%;
  }
`

const StepIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};

  svg {
    width: 28px;
    height: 28px;
    stroke: ${theme.colors.primary};
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

const StepTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text};
`

const StepDescription = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`

const Spacer = styled.div`
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`

export const HowItWorks = () => {
  const { t } = useTranslation()
  
  const steps = [
    {
      number: 1,
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      title: t('howItWorks.steps.connect.title'),
      description: t('howItWorks.steps.connect.description'),
    },
    {
      number: 2,
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      ),
      title: t('howItWorks.steps.flight.title'),
      description: t('howItWorks.steps.flight.description'),
    },
    {
      number: 3,
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: t('howItWorks.steps.purchase.title'),
      description: t('howItWorks.steps.purchase.description'),
    },
    {
      number: 4,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: t('howItWorks.steps.monitor.title'),
      description: t('howItWorks.steps.monitor.description'),
    },
    {
      number: 5,
      icon: (
        <svg viewBox="0 0 24 24">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: t('howItWorks.steps.payout.title'),
      description: t('howItWorks.steps.payout.description'),
    },
  ]

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionBadge>{t('howItWorks.badge')}</SectionBadge>
          <SectionTitle>
            {t('howItWorks.title')} <span>{t('howItWorks.titleHighlight')}</span>
          </SectionTitle>
          <SectionDescription>
            {t('howItWorks.description')}
          </SectionDescription>
        </SectionHeader>

        <StepsContainer>
          {steps.map((step, index) => (
            <StepRow
              key={step.number}
              reverse={index % 2 === 1}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {index % 2 === 0 ? (
                <>
                  <StepContent align="right">
                    <StepCard>
                      <StepIcon>{step.icon}</StepIcon>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </StepCard>
                  </StepContent>
                  <StepNumber>{step.number}</StepNumber>
                  <Spacer />
                </>
              ) : (
                <>
                  <Spacer />
                  <StepNumber>{step.number}</StepNumber>
                  <StepContent align="left">
                    <StepCard>
                      <StepIcon>{step.icon}</StepIcon>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </StepCard>
                  </StepContent>
                </>
              )}
            </StepRow>
          ))}
        </StepsContainer>
      </Container>
    </Section>
  )
}
