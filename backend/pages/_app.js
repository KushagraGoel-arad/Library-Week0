import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo_client'; 
import Layout from '../components/Layout'; 

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
