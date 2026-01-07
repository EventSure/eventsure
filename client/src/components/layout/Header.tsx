import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { theme } from '@/styles/theme'

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${theme.colors.glassBorder};
`

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-decoration: none;
`

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
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

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ $isActive }) => $isActive ? theme.colors.secondary : theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.medium};
  transition: color ${theme.transitions.fast};
  cursor: pointer;
  text-decoration: none;
  position: relative;

  &:hover {
    color: ${({ $isActive }) => $isActive ? theme.colors.secondary : theme.colors.text};
  }

  ${({ $isActive }) => $isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.secondary};
      border-radius: ${theme.borderRadius.full};
    }
  `}
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`

const LanguageSwitcher = styled.button<{ isActive?: boolean }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: 1px solid ${theme.colors.glassBorder};
  background: ${({ isActive }) => isActive ? theme.colors.primary : 'transparent'};
  color: ${({ isActive }) => isActive ? 'white' : theme.colors.textSecondary};

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${({ isActive }) => isActive ? 'white' : theme.colors.text};
  }
`

const LanguageGroup = styled.div`
  display: flex;
  gap: 2px;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: 2px;
`

export const Header = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <HeaderContainer
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>
            <svg viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </LogoIcon>
          <LogoText>EventSure</LogoText>
        </Logo>

        <Nav>
          <NavLink to="/" $isActive={isActive('/')}>{t('header.home')}</NavLink>
          <NavLink to="/explorer" $isActive={isActive('/explorer')}>{t('header.explorer')}</NavLink>
          <NavLink to="/claims" $isActive={isActive('/claims')}>{t('header.claims')}</NavLink>
          <NavLink to="/about" $isActive={isActive('/about')}>{t('header.about')}</NavLink>
        </Nav>

        <Actions>
          <LanguageGroup>
            <LanguageSwitcher 
              isActive={i18n.language === 'en'} 
              onClick={() => changeLanguage('en')}
            >
              EN
            </LanguageSwitcher>
            <LanguageSwitcher 
              isActive={i18n.language === 'ko'} 
              onClick={() => changeLanguage('ko')}
            >
              KO
            </LanguageSwitcher>
          </LanguageGroup>
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
          />
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  )
}
