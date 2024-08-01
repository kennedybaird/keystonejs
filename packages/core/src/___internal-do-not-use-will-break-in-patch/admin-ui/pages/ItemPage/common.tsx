/** @jsxRuntime classic */
/** @jsx jsx */

import { type HTMLAttributes, type ReactNode } from 'react'
import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs'
import { breakpointQueries } from '@keystar/ui/style'
import { Heading } from '@keystar/ui/typography'

import { jsx, useTheme } from '@keystone-ui/core'

import { Container } from '../../../../admin-ui/components/Container'
import { useRouter } from '../../../../admin-ui/router'
import { type ListMeta } from '../../../../types'

export function ItemPageHeader (props: { list: ListMeta, label: string }) {
  const router = useRouter()

  return (
    <Container
      css={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      <div
        css={{
          alignItems: 'center',
          display: 'flex',
          flex: 1,
          minWidth: 0,
        }}
      >
        {props.list.isSingleton ? (
          <Heading elementType="h1" size="small">{props.list.label}</Heading>
        ) : (
          <Breadcrumbs flex size="medium" minWidth="alias.singleLineWidth">
            <Item href={`/${props.list.path}`}>
              {props.list.label}
            </Item>
            <Item href={router.asPath}>
              {props.label}
            </Item>
          </Breadcrumbs>
        )}
      </div>
    </Container>
  )
}

export function ColumnLayout (props: HTMLAttributes<HTMLDivElement>) {
  const { spacing } = useTheme()

  return (
    // this container must be relative to catch absolute children
    // particularly the "expanded" document-field, which needs a height of 100%
    <Container css={{ position: 'relative', height: '100%' }}>
      <div
        css={{
          alignItems: 'start',
          display: 'grid',
          gap: spacing.none,
          gridTemplateColumns: `100vw`,
          [breakpointQueries.above.mobile]: {
            gridTemplateColumns: `2fr 1fr`,
            gap: spacing.xlarge,
          },
        }}
        {...props}
      />
    </Container>
  )
}

export function BaseToolbar (props: { children: ReactNode }) {
  const { colors, spacing } = useTheme()

  return (
    <div
      css={{
        background: colors.background,
        borderTop: `1px solid ${colors.border}`,
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: spacing.xlarge,
        paddingBottom: spacing.xlarge,
        paddingTop: spacing.xlarge,
        position: 'sticky',
        zIndex: 20,
      }}
    >
      {props.children}
    </div>
  )
}
