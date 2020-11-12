import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "@apollo/client";
import client from "../services/ApolloClient";
import { Provider as ReduxProvider } from "react-redux";
import store from "../store/store";

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ReduxProvider>
  );
}

export default MyApp;
