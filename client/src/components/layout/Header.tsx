import { useState } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { theme } from "@/styles/theme";

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
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.secondary} 100%
  );
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    fill: white;
  }
`;

const LogoText = styled.span`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "$isActive",
})<{ $isActive?: boolean }>`
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.secondary : theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.medium};
  transition: color ${theme.transitions.fast};
  cursor: pointer;
  text-decoration: none;
  position: relative;

  &:hover {
    color: ${({ $isActive }) =>
      $isActive ? theme.colors.secondary : theme.colors.text};
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.secondary};
    }
  `}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  padding: ${theme.spacing.sm};
  cursor: pointer;
  color: ${theme.colors.text};

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 73px;
  left: 0;
  right: 0;
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.glassBorder};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  z-index: 99;
`;

const MobileNavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "$isActive",
})<{ $isActive?: boolean }>`
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.secondary : theme.colors.text};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.lg};
  text-decoration: none;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${({ $isActive }) =>
    $isActive ? `${theme.colors.secondary}10` : "transparent"};

  &:hover {
    background: ${theme.colors.surface};
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.glassBorder};
`;

const MyPageButton = styled(Link)`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: 1px solid ${theme.colors.glassBorder};
  background: transparent;
  color: ${theme.colors.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.glassBorder};
    border-color: ${theme.colors.secondary};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
  }
`;

const ConnectWalletButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: 1px solid ${theme.colors.primary};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.primaryDark} 100%
  );
  color: ${theme.colors.text};

  &:hover {
    box-shadow: ${theme.shadows.glowStrong};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WalletButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <ConnectWalletButton onClick={() => open()}>
      {isConnected && address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </ConnectWalletButton>
  );
};

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <HeaderContainer
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <HeaderContent>
          <Logo to="/" onClick={closeMobileMenu}>
            <LogoIcon>
              <svg viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </LogoIcon>
            <LogoText>EventSure</LogoText>
          </Logo>

          <Nav>
            <NavLink to="/" $isActive={isActive("/")}>
              {t("header.home")}
            </NavLink>
            <NavLink to="/explorer" $isActive={isActive("/explorer")}>
              {t("header.explorer")}
            </NavLink>
            <NavLink to="/history" $isActive={isActive("/history")}>
              {t("header.history")}
            </NavLink>
            <NavLink to="/about" $isActive={isActive("/about")}>
              {t("header.about")}
            </NavLink>
          </Nav>

          <Actions>
            <MyPageButton to="/myepisodes">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {t("header.myEpisodes")}
            </MyPageButton>
            <WalletButton />
          </Actions>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <svg viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MobileNavLink to="/" $isActive={isActive("/")} onClick={closeMobileMenu}>
              {t("header.home")}
            </MobileNavLink>
            <MobileNavLink to="/explorer" $isActive={isActive("/explorer")} onClick={closeMobileMenu}>
              {t("header.explorer")}
            </MobileNavLink>
            <MobileNavLink to="/history" $isActive={isActive("/history")} onClick={closeMobileMenu}>
              {t("header.history")}
            </MobileNavLink>
            <MobileNavLink to="/myepisodes" $isActive={isActive("/myepisodes")} onClick={closeMobileMenu}>
              {t("header.myEpisodes")}
            </MobileNavLink>
            <MobileNavLink to="/about" $isActive={isActive("/about")} onClick={closeMobileMenu}>
              {t("header.about")}
            </MobileNavLink>
            <MobileActions>
              <WalletButton />
            </MobileActions>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};
