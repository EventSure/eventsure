import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

export const Card = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primary}40;
    box-shadow: ${theme.shadows.glow};
  }
`

export const GlassCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${theme.colors.glass} 0%,
    rgba(15, 23, 42, 0.6) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xxl};
  padding: ${theme.spacing.xxl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${theme.colors.primary}50,
      transparent
    );
  }
`

export const StatCard = styled(motion.div)`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  text-align: center;
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    border-color: ${theme.colors.primary}60;
    box-shadow: ${theme.shadows.glow};
  }
`
