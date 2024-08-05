// import logo from '../logo.svg';
import logo from '../assets/t.png';
import './App.css';


import Header from './Header.jsx';
import AppContent from './AppContent';

function App() {
    return (
        <div className="App">
            <Header pageTitle="Frontend authenticated with JWT" logoSrc={logo} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <AppContent />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;