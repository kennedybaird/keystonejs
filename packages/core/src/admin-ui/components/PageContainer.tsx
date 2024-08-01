/** @jsxRuntime classic */
/** @jsx jsx */

import { Fragment, type HTMLAttributes, type ReactNode, useState } from 'react'

import { ActionButton } from '@keystar/ui/button'
import { Icon } from '@keystar/ui/icon'
import { menuIcon } from '@keystar/ui/icon/icons/menuIcon'
import { xIcon } from '@keystar/ui/icon/icons/xIcon'
import { breakpointQueries, css, tokenSchema } from '@keystar/ui/style'
import { Box, HStack } from '@keystar/ui/layout'

import { jsx } from '@keystone-ui/core'
import { MenuIcon, XCircleIcon } from '@keystone-ui/icons'

import { Navigation } from './Navigation'
import { Logo } from './Logo'

type PageContainerProps = {
  children: ReactNode
  header: ReactNode
  title?: string
}

export const HEADER_HEIGHT = 64

const PageWrapper = (props: HTMLAttributes<HTMLElement>) => {
  // const { colors } = useTheme();
  return (
    <Fragment>
      {/* TODO: not sure where to put this */}
      <style>{`body { overflow: hidden; }`}</style>
      <div
        css={{
          // background: colors.background,
          display: 'grid',
          gridTemplateRows: `repeat(2,${HEADER_HEIGHT}px) auto`,
          height: '100vh',
          isolation: 'isolate',
          [breakpointQueries.above.mobile]: {
            gridTemplateColumns: `${tokenSchema.size.scale[3600]} minmax(0, 1fr)`,
            gridTemplateRows: `${HEADER_HEIGHT}px auto`,
          },
        }}
        {...props}
      />
    </Fragment>
  )
}

const Sidebar = ({
  isSidebarOpen,
  ...props
}: HTMLAttributes<HTMLElement> & {
  isSidebarOpen: boolean
}) => {
  return (
    <div
      className={css({
        gridColumn: '1/2',
        gridRow: '2/4',
        display: isSidebarOpen ? 'block' : 'none',
        height: '100vh',
        [breakpointQueries.above.mobile]: {
          gridColumn: '1/2',
          gridRow: '2/3',
          display: 'block',
          height: '100%',
        },
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      })}
    >
      <aside
        className={css({
          height: '100%',
          minWidth: 0, // resolves collapsing issues in children
        })}
        {...props}
      />
    </div>
  )
}

const Content = (props: HTMLAttributes<HTMLElement>) => {
  return (
    <Box
      elementType='main'
      minWidth={0}
      overflow="hidden auto"
      paddingX="xlarge"
      position="relative"
      UNSAFE_className={css({ WebkitOverflowScrolling: 'touch' })}
      {...props}
    />
  )
}

export const PageContainer = ({ children, header, title }: PageContainerProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  return (
    <PageWrapper>
      <HStack
        alignItems="center"
        borderBottom="neutral"
        justifyContent="space-between"
        paddingX="xlarge"
      >
        <Logo />
        <ActionButton
          aria-label="open main menu"
          aria-pressed={isSidebarOpen}
          onPress={() => {
            setSidebarOpen(bool => !bool)
          }}
          prominence="low"
          isHidden={{ above: 'mobile' }}
        >
          <Icon src={isSidebarOpen ? xIcon : menuIcon} />
        </ActionButton>
      </HStack>
      <HStack
        elementType='header'
        alignItems="center"
        borderBottom="neutral"
        justifyContent="space-between"
        paddingX="xlarge"
        minWidth={0}
        UNSAFE_style={{ visibility: isSidebarOpen ? 'hidden' : 'visible' }}
      >
        <title>{title ? `Keystone - ${title}` : 'Keystone'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {header}
      </HStack>
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <Navigation />
      </Sidebar>
      <Content>{children}</Content>
    </PageWrapper>
  )
}
