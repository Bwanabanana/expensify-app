import React from 'react';
import { Provider } from 'react-redux';
import Amplify from 'aws-amplify';
import AppRouter from '../routers/AppRouter';
import { withAuthenticator } from '@aws-amplify/ui-react';
import configureStore from '../store/configureStore';
import { loadExpenses } from '../actions/expenses';
import LoadingPage from './LoadingPage.js';

const ampConfig = Amplify.configure({
    Auth: {
        region: 'eu-west-2',
        userPoolId: 'eu-west-2_59mzxsHwL',
        userPoolWebClientId: '2dmom3jhfm11466uvk7lmp91br',
        identityPoolId: 'eu-west-2:4dd6a353-79a8-4a98-8f93-74f3498bbbe1'
    },
    API: {
        endpoints: [
            {
                name: 'ExpensifyApi',
                region: 'eu-west-2',
                service: "apigateway",
                endpoint: 'https://apigateway.eu-west-2.amazonaws.com'
            }
        ]
    }
});

const myTheme = {
    container: {
        'alignItems': 'center',
        'background': `url('images/bg.jpg')`,
        'backgroundSize': 'cover',
        'display': 'flex',
        'height': '100vh',
        'justifyContent': 'center',
        'width': '100vw'
    }
};

const store = configureStore();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        store.dispatch(loadExpenses()).then(() => {
            this.setState({ loading: false });
        });
    }

    componentDidCatchError(error, info) {
        console.log('Stack', info.componentStack);
        console.log('Error', error);
    }

    render() {
        if (this.state.loading) {
            return (
                <LoadingPage />
            );
        } else {
            return (
                <Provider store={store}>
                    <AppRouter />
                </Provider>
            )
        }
    }
}

export default withAuthenticator(App, { includeGreetings: false }, undefined, undefined, myTheme);
