import { Provider } from "react-redux";
import { store } from "./app/providers/store";
import AppRouter from "./app/routers/AppRouter";

export default function App() {
    return <Provider store={store}>
        <AppRouter />
    </Provider>
}