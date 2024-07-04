
"use client";
import { useMemo } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function useApollo(initialState) {
  const client = useMemo(() => initializeApollo(initialState), [initialState]);
  return client;
}

