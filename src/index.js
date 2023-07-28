import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { ApolloClient, ApolloProvider, InMemoryCache, gql } from "@apollo/client" // Apollo integration
Amplify.configure(config);

const client = new ApolloClient({
  uri: "https://awtbiphmbjefzla4jz4h37r67y.appsync-api.ca-central-1.amazonaws.com/graphql", 
  cache: new InMemoryCache(), 
})

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
