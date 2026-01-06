import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'
import { Button } from '@/components/common'

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

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
`

const PlanCard = styled(motion.div)<{ featured?: boolean }>`
  background: ${({ featured }) =>
    featured
      ? `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.secondary}15)`
      : theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid
    ${({ featured }) => (featured ? theme.colors.primary + '60' : theme.colors.glassBorder)};
  border-radius: ${theme.borderRadius.xxl};
  padding: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${({ featured }) =>
    featured &&
    `
    transform: scale(1.05);
    box-shadow: ${theme.shadows.glowStrong};

    @media (max-width: ${theme.breakpoints.lg}) {
      transform: none;
      order: -1;
    }
  `}
`

const FeaturedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
  color: white;
`

const PlanHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`

const PlanName = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.text};
`

const PlanDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`

const PlanPrice = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.glassBorder};
`

const PriceAmount = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.spacing.xs};
`

const PriceValue = styled.span`
  font-size: ${theme.fontSize.xxxl};
  font-weight: ${theme.fontWeight.bold};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const PriceCurrency = styled.span`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
`

const PriceNote = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  margin-top: ${theme.spacing.xs};
`

const PlanFeatures = styled.ul`
  list-style: none;
  margin-bottom: ${theme.spacing.xl};
  flex: 1;
`

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`

const FeatureCheck = styled.span`
  color: ${theme.colors.success};
`

const CoverageDetails = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`

const CoverageRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xs} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.glassBorder};
  }
`

const CoverageLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`

const CoverageValue = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
`

const plans = [
  {
    name: 'Basic',
    description: 'Essential coverage for budget travelers',
    price: '0.01',
    priceNote: 'per flight',
    features: [
      'Coverage for delays over 3 hours',
      'Up to 0.1 MNT payout',
      'Single flight coverage',
      'Standard oracle verification',
      'Email notifications',
    ],
    coverage: {
      'Delay Threshold': '3+ hours',
      'Max Payout': '0.1 MNT',
      'Validity': 'Single flight',
    },
    featured: false,
  },
  {
    name: 'Standard',
    description: 'Most popular choice for frequent flyers',
    price: '0.025',
    priceNote: 'per flight',
    features: [
      'Coverage for delays over 2 hours',
      'Up to 0.3 MNT payout',
      'Multi-flight bundle discount',
      'Priority oracle verification',
      'Real-time push notifications',
      'Cancellation coverage included',
    ],
    coverage: {
      'Delay Threshold': '2+ hours',
      'Max Payout': '0.3 MNT',
      'Validity': '30 days',
    },
    featured: true,
  },
  {
    name: 'Premium',
    description: 'Maximum protection for business travelers',
    price: '0.05',
    priceNote: 'per flight',
    features: [
      'Coverage for delays over 1 hour',
      'Up to 0.5 MNT payout',
      'Unlimited flights for 30 days',
      'Instant oracle verification',
      'Priority customer support',
      'Cancellation + delay coverage',
      'Rebooking cost coverage',
    ],
    coverage: {
      'Delay Threshold': '1+ hour',
      'Max Payout': '0.5 MNT',
      'Validity': '30 days unlimited',
    },
    featured: false,
  },
]

export const CoveragePlans = () => {
  const { t } = useTranslation()
  
  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionBadge>{t('coveragePlans.badge')}</SectionBadge>
          <SectionTitle>
            {t('coveragePlans.title')} <span>{t('coveragePlans.titleHighlight')}</span>
          </SectionTitle>
          <SectionDescription>
            {t('coveragePlans.description')}
          </SectionDescription>
        </SectionHeader>

        <PlansGrid>
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.name}
              featured={plan.featured}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {plan.featured && <FeaturedBadge>{t('coveragePlans.mostPopular')}</FeaturedBadge>}

              <PlanHeader>
                <PlanName>{plan.name}</PlanName>
                <PlanDescription>{plan.description}</PlanDescription>
              </PlanHeader>

              <PlanPrice>
                <PriceAmount>
                  <PriceValue>{plan.price}</PriceValue>
                  <PriceCurrency>MNT</PriceCurrency>
                </PriceAmount>
                <PriceNote>{plan.priceNote}</PriceNote>
              </PlanPrice>

              <CoverageDetails>
                {Object.entries(plan.coverage).map(([label, value]) => (
                  <CoverageRow key={label}>
                    <CoverageLabel>{label}</CoverageLabel>
                    <CoverageValue>{value}</CoverageValue>
                  </CoverageRow>
                ))}
              </CoverageDetails>

              <PlanFeatures>
                {plan.features.map((feature) => (
                  <Feature key={feature}>
                    <FeatureCheck>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </FeatureCheck>
                    {feature}
                  </Feature>
                ))}
              </PlanFeatures>

              <Button
                variant={plan.featured ? 'primary' : 'outline'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get {plan.name}
              </Button>
            </PlanCard>
          ))}
        </PlansGrid>
      </Container>
    </Section>
  )
}
