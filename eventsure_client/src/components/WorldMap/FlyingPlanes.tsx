import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

const PlanesContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`

const PlaneWrapper = styled(motion.div)`
  position: absolute;
  filter: drop-shadow(0 0 8px ${theme.colors.flight});
`

const PlaneIcon = styled.svg<{ size?: number }>`
  width: ${({ size }) => size || 24}px;
  height: ${({ size }) => size || 24}px;
  fill: ${theme.colors.flight};
`

const Trail = styled(motion.div)<{ length?: number }>`
  position: absolute;
  height: 2px;
  width: ${({ length }) => length || 60}px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${theme.colors.flightTrail} 50%,
    ${theme.colors.flight} 100%
  );
  transform-origin: right center;
  right: 100%;
  top: 50%;
  margin-top: -1px;
`

interface FlightPath {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  delay: number
  size: number
  trailLength: number
}

const flightPaths: FlightPath[] = [
  // North America to Europe
  { id: 1, startX: 15, startY: 30, endX: 45, endY: 25, duration: 20, delay: 0, size: 20, trailLength: 50 },
  // Europe to Asia
  { id: 2, startX: 50, startY: 28, endX: 85, endY: 35, duration: 22, delay: 3, size: 18, trailLength: 45 },
  // Asia to Australia
  { id: 3, startX: 80, startY: 40, endX: 88, endY: 75, duration: 18, delay: 6, size: 16, trailLength: 40 },
  // South America to Africa
  { id: 4, startX: 28, startY: 70, endX: 52, endY: 55, duration: 19, delay: 2, size: 18, trailLength: 45 },
  // Europe to North America (return)
  { id: 5, startX: 48, startY: 32, endX: 18, endY: 38, duration: 21, delay: 8, size: 20, trailLength: 50 },
  // Middle East to Southeast Asia
  { id: 6, startX: 55, startY: 40, endX: 78, endY: 50, duration: 17, delay: 5, size: 16, trailLength: 40 },
  // North America to Asia (Pacific)
  { id: 7, startX: 12, startY: 35, endX: 75, endY: 32, duration: 25, delay: 10, size: 22, trailLength: 60 },
  // Africa to Europe
  { id: 8, startX: 50, startY: 60, endX: 48, endY: 30, duration: 16, delay: 4, size: 16, trailLength: 40 },
]

const Plane = ({ size }: { size: number }) => (
  <PlaneIcon size={size} viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </PlaneIcon>
)

export const FlyingPlanes = () => {
  return (
    <PlanesContainer>
      {flightPaths.map((path) => {
        const angle = Math.atan2(path.endY - path.startY, path.endX - path.startX) * (180 / Math.PI)

        return (
          <PlaneWrapper
            key={path.id}
            initial={{
              x: `${path.startX}vw`,
              y: `${path.startY}vh`,
              rotate: angle + 90,
              opacity: 0,
            }}
            animate={{
              x: [`${path.startX}vw`, `${path.endX}vw`],
              y: [`${path.startY}vh`, `${path.endY}vh`],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Infinity,
              repeatDelay: 0,
              ease: 'linear',
              opacity: {
                duration: path.duration,
                times: [0, 0.05, 0.95, 1],
                repeat: Infinity,
                repeatDelay: 0,
              },
            }}
          >
            <Trail
              length={path.trailLength}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <Plane size={path.size} />
          </PlaneWrapper>
        )
      })}
    </PlanesContainer>
  )
}
