import React from 'react'

import { Provider } from 'react-redux';
import { store } from './redux/store';
import RootReduxProvider from './RootReduxProvider';

const App = () => {
  return (
<Provider store={store}>
    <RootReduxProvider/>
</Provider>
  )
}

export default App