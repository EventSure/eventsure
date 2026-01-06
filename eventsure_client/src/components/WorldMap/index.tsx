import styled from '@emotion/styled'
import { WorldMapBackground } from './WorldMapBackground'
import { FlyingPlanes } from './FlyingPlanes'

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
`

export const WorldMap = () => {
  return (
    <Container>
      <WorldMapBackground />
      <FlyingPlanes />
    </Container>
  )
}

export { WorldMapBackground } from './WorldMapBackground'
export { FlyingPlanes } from './FlyingPlanes'
