import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { theme } from '@/styles/theme'

const FooterContainer = styled.footer`
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl} ${theme.spacing.xl};
  background: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.glassBorder};
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${theme.spacing.xxl};
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`

const FooterBrand = styled.div``

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
`

const LogoText = styled.span`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const BrandDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.lg};
  max-width: 300px;
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surfaceLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.fast};

  svg {
    width: 18px;
    height: 18px;
    fill: ${theme.colors.textSecondary};
    transition: fill ${theme.transitions.fast};
  }

  &:hover {
    background: ${theme.colors.primary};

    svg {
      fill: white;
    }
  }
`

const FooterColumn = styled.div``

const ColumnTitle = styled.h4`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ColumnLinks = styled.ul`
  list-style: none;
`

const ColumnLink = styled.li`
  margin-bottom: ${theme.spacing.sm};

  a {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`

const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.glassBorder};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    text-align: center;
  }
`

const Copyright = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`

const FooterLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};

  a {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`

const NetworkBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.surfaceLight};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: ${theme.colors.success};
    border-radius: 50%;
  }
`

export const Footer = () => {
  const { t } = useTranslation()
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterBrand>
            <Logo>
              <LogoIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </LogoIcon>
              <LogoText>EventSure</LogoText>
            </Logo>
            <BrandDescription>
              {t('footer.description')}
            </BrandDescription>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="Discord">
                <svg viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="GitHub">
                <svg viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="Telegram">
                <svg viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </SocialLink>
            </SocialLinks>
          </FooterBrand>

          <FooterColumn>
            <ColumnTitle>{t('footer.product')}</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <a href="#">{t('footer.links.howItWorks')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.coveragePlans')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.pricing')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.faq')}</a>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>{t('footer.resources')}</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <a href="#">{t('footer.links.documentation')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.smartContracts')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.auditReports')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.api')}</a>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>{t('footer.company')}</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <a href="#">{t('footer.links.aboutUs')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.blog')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.careers')}</a>
              </ColumnLink>
              <ColumnLink>
                <a href="#">{t('footer.links.contact')}</a>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            {t('footer.copyright')} <NetworkBadge>{t('footer.builtOn')}</NetworkBadge>
          </Copyright>
          <FooterLinks>
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
            <a href="#">{t('footer.cookies')}</a>
          </FooterLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  )
}
