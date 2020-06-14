import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "@apollo/client";
import client from "../services/ApolloClient";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
