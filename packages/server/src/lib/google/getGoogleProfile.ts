import { google } from 'googleapis'

export default async function getGoogleProfile(accessToken: string) {
  const { data } = await google.people('v1').people.get({
    access_token: accessToken,
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
  })

  const profile = {
    socialId: data.resourceName?.replace('people/', '') ?? '',
    email: data.emailAddresses?.[0].value ?? '',
    photo: data.photos?.[0].url ?? null,
    displayName: data.names?.[0].displayName?.split(' (')[0] ?? '',
  }

  return profile
}
