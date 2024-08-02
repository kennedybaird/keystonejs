import { useRouter } from 'next/router'

import { Button } from '@keystar/ui/button'
import { VStack } from '@keystar/ui/layout'

import { LoadingDots } from '@keystone-ui/loading'

import { Fields } from '../../../../admin-ui/utils'
import { PageContainer } from '../../../../admin-ui/components/PageContainer'
import { useKeystone, useList } from '../../../../admin-ui'
import { GraphQLErrorNotice } from '../../../../admin-ui/components'
import { useCreateItem } from '../../../../admin-ui/utils/useCreateItem'
import { BaseToolbar, ColumnLayout, ItemPageHeader } from '../ItemPage/common'

type CreateItemPageProps = { listKey: string }

export const getCreateItemPage = (props: CreateItemPageProps) => () =>
  <CreateItemPage {...props} />

function CreateItemPage (props: CreateItemPageProps) {
  const router = useRouter()
  const list = useList(props.listKey)
  const createItem = useCreateItem(list)
  const { createViewFieldModes } = useKeystone()

  return (
    <PageContainer
      title={`Create ${list.singular}`}
      header={<ItemPageHeader list={list} label="Create" />}
    >
      {createViewFieldModes.state === 'loading' ? (
        <LoadingDots label="preparing form" />
      ) : (
        <ColumnLayout>
          <VStack gap="large" gridArea="main" marginTop="xlarge">
            {createViewFieldModes.state === 'error' && (
              <GraphQLErrorNotice
                networkError={
                  createViewFieldModes.error instanceof Error
                    ? createViewFieldModes.error
                    : undefined
                }
                errors={
                  createViewFieldModes.error instanceof Error
                    ? undefined
                    : createViewFieldModes.error
                }
              />
            )}

            {createItem.error && (
              <GraphQLErrorNotice
                networkError={createItem.error?.networkError}
                errors={createItem.error?.graphQLErrors}
              />
            )}

            <Fields {...createItem.props} />
          </VStack>

          <BaseToolbar>
            <Button
              // TODO: implement when `isPending` supported in "@keystar/ui" button
              // isLoading={createItem.state === 'loading'}
              prominence="high"
              onPress={async () => {
                const item = await createItem.create()
                if (item) {
                  router.push(`/${list.path}/${item.id}`)
                }
              }}
            >
              Create {list.singular}
            </Button>
          </BaseToolbar>
        </ColumnLayout>
      )}
    </PageContainer>
  )
}
