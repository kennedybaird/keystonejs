import { type ReactNode, Fragment, useMemo } from 'react'
import { useRouter } from 'next/router'

import { ActionButton } from '@keystar/ui/button'
import { Icon } from '@keystar/ui/icon'
import { bookTextIcon } from '@keystar/ui/icon/icons/bookTextIcon'
import { moreHorizontalIcon } from '@keystar/ui/icon/icons/moreHorizontalIcon'
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon'
import { fileJson2Icon } from '@keystar/ui/icon/icons/fileJson2Icon'
import { MenuTrigger, Menu, Item } from '@keystar/ui/menu'
import { Box, Divider, HStack, VStack } from '@keystar/ui/layout'
import { NavList, NavItem as KeystarNavItem, NavGroup as KeystarNavGroup } from '@keystar/ui/nav-list'
import { Notice } from '@keystar/ui/notice'
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip'
import { Text } from '@keystar/ui/typography'

import { type NavigationProps, type ListMeta, type AuthenticatedItem } from '../../types'
import { useKeystone } from '../context'
import { SignoutButton } from './SignoutButton'

type NavItemProps = {
  /**
   * The content of the item.
   */
  children: ReactNode
  /**
   * The URL to navigate to when the item is clicked. Omit the origin, as it
   * interferes with client-side routing. Use `/` for the dashboard.
   */
  href: string
  /**
   * Optionally override the selected state of the item. By default, this is
   * determined by the current route and the `href` provided.
    */
  isSelected?: boolean
}

type NavigationContainerProps = Partial<Pick<NavigationProps, 'authenticatedItem'>> & {
  children: ReactNode
}

type ListNavItemsProps = Pick<NavigationProps, 'lists'> & {
  /**
   * An array of list keys to include as navigation items. If not provided, all
   * lists will be included.
   */
  include?: string[]
}

/**
 * Group related navigation items together into categories, under a
 * common title.
 */
export const NavGroup = KeystarNavGroup

/**
 * Dividers can be used to separate navigation items. Prefer `NavGroup` for
 * grouping related items under a common title.
 */
export const NavDivider = Divider


/**
 * A navigation item represents a page in the admin UI. Prefer `ListNavItems`
 * for managing navigation between lists.
*/
export const NavItem = (props: NavItemProps) => {
  const { children, href, isSelected: isSelectedProp } = props
  const router = useRouter()

  let ariaCurrent: 'page' | boolean | undefined = isSelectedProp

  if (!ariaCurrent) {
    if (router.pathname === href) {
      ariaCurrent = 'page'
    } else if (router.pathname.split('/')[1] === href.split('/')[1]) {
      ariaCurrent = true
    }
  }

  return (
    <KeystarNavItem
      aria-current={ariaCurrent || undefined}
      href={href}
    >
      {children}
    </KeystarNavItem>
  )
}

/**
 * The main navigation component for Keystone Admin UI. Renders containing
 * markup around navigation items, as well as the different states of
 * the `authenticatedItem` element.
*/
export const NavigationContainer = ({ authenticatedItem, children }: NavigationContainerProps) => {
  return (
    <VStack gap="large" height="100%" paddingY="xlarge">
      <NavList aria-label="main" flex marginEnd="medium">{children}</NavList>
      <Footer authItem={authenticatedItem} />
    </VStack>
  )
}

/**
 * Render navigation items for the provided lists. Optionally filter the lists
 * to include only those with specific keys.
 */
export const ListNavItems = ({ lists = [], include = [] }: ListNavItemsProps) => {
  const filteredLists = useMemo(() => {
    if (include.length === 0) {
      return lists
    }
    return lists.filter(list => include.includes(list.key))
  }, [lists, include])

  return (
    <Fragment>
      {filteredLists.map((list: ListMeta) => (
        <NavItem key={list.key} href={`/${list.path}${list.isSingleton ? '/1' : ''}`}>
          {list.label}
        </NavItem>
      ))}
    </Fragment>
  )
}

/**
 * @private Exported for internal consumption only.
*/
export const Navigation = () => {
  const {
    adminMeta: { lists },
    adminConfig,
    authenticatedItem,
    visibleLists,
  } = useKeystone()

  if (visibleLists.state === 'loading') {
    return null
  }

  // This visible lists error is critical, and is likely to result in a server
  // restart. If it happens, show the error and don't render navigation.
  if (visibleLists.state === 'error') {
    return (
      <Box padding="xlarge">
        <Notice tone="critical">
          {visibleLists.error instanceof Error
            ? visibleLists.error.message
            : visibleLists.error[0].message}
        </Notice>
      </Box>
    )
  }
  const renderableLists = Object.keys(lists)
    .map(key => {
      if (!visibleLists.lists.has(key)) return null
      return lists[key]
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  if (adminConfig?.components?.Navigation) {
    return (
      <adminConfig.components.Navigation
        authenticatedItem={authenticatedItem}
        lists={renderableLists}
      />
    )
  }

  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Dashboard</NavItem>
      <Divider />
      <ListNavItems lists={renderableLists} />
    </NavigationContainer>
  )
}

// Internal components
// -------------------

function Footer ({ authItem }: { authItem: AuthenticatedItem | undefined }) {
  return (
    <HStack paddingX="large" gap="regular">
      <AuthItem item={authItem} />
      <DeveloperResources />
    </HStack>
  )
}

function AuthItem ({ item }: { item: AuthenticatedItem | undefined }) {
  if (!item || item.state !== 'authenticated') {
    return null
  }

  return (
    <TooltipTrigger>
      <SignoutButton flex />
      <Tooltip>
        <Text>Signed in as <strong>{item.label}</strong></Text>
      </Tooltip>
    </TooltipTrigger>
  )
}

function DeveloperResources () {
  const { apiPath } = useKeystone()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <MenuTrigger>
      <TooltipTrigger>
        <ActionButton aria-label="Developer resources">
          <Icon src={moreHorizontalIcon} />
        </ActionButton>
        <Tooltip>Developer resources</Tooltip>
      </TooltipTrigger>
      <Menu>
        <Item href={apiPath}>
          <Icon src={fileJson2Icon} />
          <Text>API explorer</Text>
        </Item>
        <Item target="_blank" href="https://github.com/keystonejs/keystone">
          <Icon src={githubIcon} />
          <Text>GitHub repository</Text>
        </Item>
        <Item target="_blank" href="https://keystonejs.com">
          <Icon src={bookTextIcon} />
          <Text>Documentation</Text>
        </Item>
      </Menu>
    </MenuTrigger>
  )
}
