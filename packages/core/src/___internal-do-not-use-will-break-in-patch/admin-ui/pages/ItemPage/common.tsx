import { useRouter } from 'next/router'
import { type HTMLAttributes, type ReactNode } from 'react'

import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs'
import { HStack } from '@keystar/ui/layout'
import { breakpointQueries, css, tokenSchema } from '@keystar/ui/style'
import { Heading } from '@keystar/ui/typography'

import { Container } from '../../../../admin-ui/components/Container'
import { type ListMeta } from '../../../../types'

export function ItemPageHeader (props: { list: ListMeta, label: string }) {
  const router = useRouter()

  return (
    <Container flex>
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
    </Container>
  )
}

export function ColumnLayout (props: HTMLAttributes<HTMLDivElement>) {
  return (
    // this container must be relative to catch absolute children
    // particularly the "expanded" document-field, which needs a height of 100%
    <Container position="relative" height="100%">
      <div
        className={css({
          display: 'grid',
          columnGap: tokenSchema.size.space.xlarge,
          gridTemplateAreas: '"main" "sidebar" "toolbar"',

          [breakpointQueries.above.tablet]: {
            gridTemplateColumns: `2fr minmax(${tokenSchema.size.alias.singleLineWidth}, 1fr)`,
            gridTemplateAreas: '"main sidebar" "toolbar ."',
          },
        })}
        {...props}
      />
    </Container>
  )
}

export function StickySidebar (props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={css({
        gridArea: 'sidebar',
        marginTop: tokenSchema.size.space.xlarge,

        [breakpointQueries.above.tablet]: {
          position: 'sticky',
          top: tokenSchema.size.space.xlarge,
        },
      })}
      {...props}
    />
  )
}

export function BaseToolbar (props: { children: ReactNode }) {
  return (
    <HStack
      alignItems="center"
      backgroundColor="surface"
      borderTop="neutral"
      gap="regular"
      gridArea="toolbar"
      height="element.xlarge"
      insetBottom={0}
      marginTop="xlarge"
      // paddingY={{
      //   mobile: 'medium',
      //   tablet: 'xlarge',
      // }}
      position={{
        tablet: 'sticky',
      }}
      zIndex={20}
    >
      {props.children}
    </HStack>
  )
}
