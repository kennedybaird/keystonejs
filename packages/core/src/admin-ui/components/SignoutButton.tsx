import { ActionButton, type ActionButtonProps } from '@keystar/ui/button'
import { useEffect } from 'react'

import { useMutation, gql } from '../apollo'

const END_SESSION = gql`
  mutation EndSession {
    endSession
  }
`

export function SignoutButton (props: Omit<ActionButtonProps, 'onPress'>) {
  const { children = 'Sign out', ...otherProps } = props
  const { signout } = useSignout()

  return (
    <ActionButton onPress={() => signout()} {...otherProps}>
      {children}
    </ActionButton>
  )
}

export function useSignout () {
  const [signout, result] = useMutation(END_SESSION)

  // TODO: handle errors
  useEffect(() => {
    if (result.data?.endSession) {
      window.location.reload()
    }
  }, [result.data])

  return {
    signout,
    isPending: result.loading,
  }
}
