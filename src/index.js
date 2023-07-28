import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth, Amplify } from 'aws-amplify';
import config from './aws-exports';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client" // Apollo integration
import { setContext } from "@apollo/client/link/context";
Amplify.configure(config);

const httpLink = createHttpLink({
  uri: "https://awtbiphmbjefzla4jz4h37r67y.appsync-api.ca-central-1.amazonaws.com/graphql",
  // uri: "https://localhost:3000/graphql", 
});

const authLink = setContext(async (_, { headers }) => {
  // Get the Cognito user access token after successful authentication
  const session = await Auth.currentSession();
  const accessToken = session.getAccessToken().getJwtToken();

  // Set the Authorization header with the access token
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };
});

// Apollo client  
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
