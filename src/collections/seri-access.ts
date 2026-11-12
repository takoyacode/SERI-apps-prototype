import type { Access, FieldAccess, CollectionBeforeValidateHook } from 'payload'

export const staff: Access = ({ req }) => req.user?.collection === 'admins'
export const staffField: FieldAccess = ({ req }) => req.user?.collection === 'admins'
export const ownAccount: Access = ({ req }) =>
  req.user?.collection === 'users' ? { id: { equals: req.user.id } } : false
export const appUser: Access = ({ req }) => req.user?.collection === 'users'
export const ownRecords: Access = ({ req }) =>
  req.user?.collection === 'users' ? { owner: { equals: req.user.id } } : false
export const assignOwner: CollectionBeforeValidateHook = ({ data, req, operation }) => {
  if (req.user?.collection === 'users' && data && operation === 'create') {
    data.owner = req.user.id
  }
  return data
}
export function httpsURL(value: unknown) {
  if (!value) return true
  try {
    return new URL(String(value)).protocol === 'https:' || 'Gunakan tautan HTTPS.'
  } catch {
    return 'Tautan tidak valid.'
  }
}
