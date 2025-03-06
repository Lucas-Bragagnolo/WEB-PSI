import { createAuth0Client } from "../node_modules/@auth0/auth0-spa-js"

let auth0Client = null

const initAuth0 = async () => {
  auth0Client = await createAuth0Client({
    domain: "dev-i1l4uumhsawcotpp.us.auth0.com",
    clientId: "HszeowbIg4x4RgknXBGgXvAUJ8VvgDli",
    authorizationParams: {
      redirect_uri: window.location.origin + "/plataforma.html",
    },
  })

  await handleRedirectCallback()
  updateUI()
}

const logout = async () => {
  await auth0Client.logout({ logoutParams: { returnTo: window.location.origin } })
}

const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated()
  if (isAuthenticated) {
    const user = await auth0Client.getUser()
    document.getElementById("user").innerText = `Hola, ${user.name}`
    document.getElementById("login-btn").style.display = "none"
    document.getElementById("google-btn").style.display = "none"
    document.getElementById("logout-btn").style.display = "block"
  } else {
    document.getElementById("user").innerText = ""
    document.getElementById("login-btn").style.display = "block"
    document.getElementById("google-btn").style.display = "block"
    document.getElementById("logout-btn").style.display = "none"
  }
}

const handleRedirectCallback = async () => {
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0Client.handleRedirectCallback()
    window.history.replaceState({}, document.title, window.location.pathname)

    window.location.href = "plataforma.html"
  }
}

const login = async (provider = null) => {
  if (provider) {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        connection: provider,
        redirect_uri: window.location.origin + "/plataforma.html",
      },
    })
  } else {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin + "/plataforma.html",
      },
    })
  }
}

export { initAuth0, login, logout }

