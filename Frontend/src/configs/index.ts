const apiId = 'p6c52bc4n5'
const stage = 'dev'
export const apiHost = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: "dev-ovoo9b2e.auth0.com", // Auth0 domain
  client_id: "nSpyZFzYqtnp5FqbVfa2uG2pHXxQlDoN", // Auth0 client id
  callbackUrl: "http://localhost:3000/callback",
  redirect_uri: "http://localhost:3000/"
};
