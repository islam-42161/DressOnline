import React from "react";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import RootReduxProvider from "./RootReduxProvider";
import RootStackNavigator from "./RootStackNavigator";

const App = () => {
  return (
    <Provider store={store}>
      <RootStackNavigator />
      {/* <RootReduxProvider /> */}
    </Provider>
  );
};

export default App;
