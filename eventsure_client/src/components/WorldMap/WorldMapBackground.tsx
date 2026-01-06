import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import worldMapPng from '@/assets/world-map-grid-w-Japan-removebg-preview.png'

const MapContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
`

const MapImage = styled.div`
  position: absolute;
  inset: -5%;
  width: 110%;
  height: 110%;
  background-image: url(${worldMapPng});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.25;
  filter: brightness(1.2) contrast(0.9);
`

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 30%,
    ${theme.colors.background}90 60%,
    ${theme.colors.background} 80%
  );
  pointer-events: none;
`

const TopGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    to bottom,
    ${theme.colors.background} 0%,
    transparent 100%
  );
  pointer-events: none;
`

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    to top,
    ${theme.colors.background} 0%,
    transparent 100%
  );
  pointer-events: none;
`

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${theme.colors.primary}05 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.primary}05 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.8;
`

const GlowEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(
    ellipse at center,
    ${theme.colors.primary}15 0%,
    ${theme.colors.secondary}08 30%,
    transparent 70%
  );
  pointer-events: none;
`

export const WorldMapBackground = () => {
  return (
    <MapContainer>
      <MapImage />
      <GridLines />
      <GlowEffect />
      <GradientOverlay />
      <TopGradient />
      <BottomGradient />
    </MapContainer>
  )
}
