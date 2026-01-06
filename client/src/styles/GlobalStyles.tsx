import { Global, css } from '@emotion/react'
import { theme } from './theme'

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    min-height: 100vh;
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  #root {
    min-height: 100vh;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.surfaceLight};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.surfaceHover};
  }

  /* Selection */
  ::selection {
    background: ${theme.colors.primary};
    color: white;
  }
`

export const GlobalStyles = () => <Global styles={globalStyles} />
