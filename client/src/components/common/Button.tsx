import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.lg};
  font-weight: ${theme.fontWeight.semibold};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;

  /* Size variants */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.fontSize.sm};
        `
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.fontSize.lg};
        `
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.fontSize.md};
        `
    }
  }}

  /* Style variants */
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.text};
          &:hover {
            background: ${theme.colors.secondaryLight};
            box-shadow: ${theme.shadows.glow};
          }
        `
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 1.5px solid ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary}15;
            box-shadow: ${theme.shadows.glow};
          }
        `
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.textSecondary};
          &:hover {
            color: ${theme.colors.text};
            background: ${theme.colors.surfaceLight};
          }
        `
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
          color: ${theme.colors.text};
          &:hover {
            box-shadow: ${theme.shadows.glowStrong};
            transform: translateY(-1px);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`
