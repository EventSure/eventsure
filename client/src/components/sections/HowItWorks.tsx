import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'

const Section = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
  background: ${theme.colors.background};
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
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
  color: ${theme.colors.text};

  span {
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSize.xxl};
  }
`

const SectionDescription = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`

const FlowsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${theme.spacing.xxl};
  margin-top: ${theme.spacing.xxxl};
  position: relative;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`

const FlowColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const ColumnHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`

const ColumnTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`

const ColumnSubtitle = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const DividerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 120px;

  @media (max-width: ${theme.breakpoints.lg}) {
    min-width: unset;
    padding: ${theme.spacing.xl} 0;
  }
`

const VerticalLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, 
    transparent, 
    ${theme.colors.primary} 15%, 
    ${theme.colors.primary} 85%, 
    transparent
  );
  box-shadow: 0 0 15px ${theme.colors.primary};
  opacity: 0.5;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`

const DividerMessage = styled.div`
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.bold};
  box-shadow: ${theme.shadows.glowStrong};
  z-index: 10;
  width: 200px;
  line-height: 1.4;

  @media (max-width: ${theme.breakpoints.lg}) {
    position: relative;
    top: 0;
    transform: none;
    width: 100%;
    max-width: 400px;
  }
`

const StepCard = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  position: relative;
  transition: ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primary}40;
    transform: translateY(-5px);
  }
`

const StepBadge = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.md};
  box-shadow: ${theme.shadows.glow};
`

const CardTitle = styled.h4`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text};
`

const CardDescription = styled.p`
  font-size: ${theme.fontSize.md};
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.md} 0;
`

const ListItem = styled.li`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xs};

  &::before {
    content: '•';
    color: ${theme.colors.primary};
    font-weight: bold;
  }
`

const CardFooter = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.glassBorder};
`

const CardSubtext = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
  margin-top: ${theme.spacing.xs};
  font-style: italic;
`

interface StepData {
  title: string
  description: string
  list?: string[]
  footer?: string
  subtext?: string
}

const Step = ({ num, data, index }: { num: number; data: StepData; index: number }) => (
  <StepCard
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <StepBadge>{num}</StepBadge>
    <CardTitle>{data.title}</CardTitle>
    <CardDescription>{data.description}</CardDescription>
    
    {data.list && Array.isArray(data.list) && (
      <List>
        {data.list.map((item, i) => (
          <ListItem key={i}>{item}</ListItem>
        ))}
      </List>
    )}

    {data.footer && <CardFooter>{data.footer}</CardFooter>}
    {data.subtext && <CardSubtext>{data.subtext}</CardSubtext>}
  </StepCard>
)

export const HowItWorks = () => {
  const { t } = useTranslation()

  const systemSteps = [1, 2, 3, 4].map(num => 
    t(`howItWorks.systemFlow.step${num}`, { returnObjects: true }) as StepData
  )
  
  const userSteps = [1, 2, 3, 4].map(num => 
    t(`howItWorks.userFlow.step${num}`, { returnObjects: true }) as StepData
  )

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

        <FlowsContainer>
          <FlowColumn>
            <ColumnHeader>
              <ColumnTitle>{t('howItWorks.tabs.system')}</ColumnTitle>
              <ColumnSubtitle>{t('howItWorks.tabSubtitles.system')}</ColumnSubtitle>
            </ColumnHeader>
            {systemSteps.map((step, idx) => (
              <Step key={`system-${idx}`} num={idx + 1} data={step} index={idx} />
            ))}
          </FlowColumn>

          <DividerWrapper>
            <VerticalLine />
            <DividerMessage>
              {t('howItWorks.divider.line1')}
              <br />
              {t('howItWorks.divider.line2')}
            </DividerMessage>
          </DividerWrapper>

          <FlowColumn>
            <ColumnHeader>
              <ColumnTitle>{t('howItWorks.tabs.user')}</ColumnTitle>
              <ColumnSubtitle>{t('howItWorks.tabSubtitles.user')}</ColumnSubtitle>
            </ColumnHeader>
            {userSteps.map((step, idx) => (
              <Step key={`user-${idx}`} num={idx + 1} data={step} index={idx} />
            ))}
          </FlowColumn>
        </FlowsContainer>
      </Container>
    </Section>
  )
}
