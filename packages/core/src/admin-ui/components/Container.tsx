import { type PropsWithChildren } from 'react'

import { type BoxProps, Box } from '@keystar/ui/layout'

export const Container = (props: PropsWithChildren<BoxProps>) => (
  <Box
    minWidth={0} // fix flex overflow issues
    maxWidth="container.medium"
    {...props}
  />
)
