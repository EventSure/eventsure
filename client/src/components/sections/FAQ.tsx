import { useState } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'

const Section = styled.section`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  position: relative;
`

const Container = styled.div`
  max-width: 800px;
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
  background: ${theme.colors.accent}20;
  border: 1px solid ${theme.colors.accent}40;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.accent};
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
`

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const FAQItem = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  transition: border-color ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary}40;
  }
`

const FAQQuestion = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  text-align: left;
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  background: transparent;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    stroke: ${theme.colors.primary};
    transition: transform ${theme.transitions.fast};
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }
`

const FAQAnswer = styled(motion.div)`
  padding: 0 ${theme.spacing.lg} ${theme.spacing.lg};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
  line-height: 1.7;

  a {
    color: ${theme.colors.primary};
    text-decoration: underline;

    &:hover {
      color: ${theme.colors.primaryLight};
    }
  }

  ul {
    margin-top: ${theme.spacing.sm};
    padding-left: ${theme.spacing.lg};

    li {
      margin-bottom: ${theme.spacing.xs};
    }
  }
`

export const FAQ = () => {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { question: t('faq.questions.q1.question'), answer: t('faq.questions.q1.answer') },
    { question: t('faq.questions.q2.question'), answer: t('faq.questions.q2.answer') },
    { question: t('faq.questions.q3.question'), answer: t('faq.questions.q3.answer') },
    { question: t('faq.questions.q4.question'), answer: t('faq.questions.q4.answer') },
    { question: t('faq.questions.q5.question'), answer: t('faq.questions.q5.answer') },
    { question: t('faq.questions.q6.question'), answer: t('faq.questions.q6.answer') },
    { question: t('faq.questions.q7.question'), answer: t('faq.questions.q7.answer') },
    { question: t('faq.questions.q8.question'), answer: t('faq.questions.q8.answer') },
  ]

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionBadge>{t('faq.badge')}</SectionBadge>
          <SectionTitle>
            {t('faq.title')} <span>{t('faq.titleHighlight')}</span>
          </SectionTitle>
          <SectionDescription>
            {t('faq.description')}
          </SectionDescription>
        </SectionHeader>

        <FAQList>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FAQQuestion
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </FAQQuestion>
              <AnimatePresence>
                {openIndex === index && (
                  <FAQAnswer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  )
}
