import { Routes, Route, useNavigate } from "@solidjs/router"

import PackPicker from "./pages/Picker"
import Credits from "./pages/Credits"

import styles from './App.module.css';

export default function App() {
  const navigate = useNavigate();
  return (
        <div class={styles.App}>
            <header class={styles.header}>
                <a onclick={() => navigate("/")}>
                    <img src="/logo.png" height="100px" />
                </a>
            </header>
            <Routes>
                <Route path="/" component={PackPicker} />
                <Route path="/credits" component={Credits} />
            </Routes>
        </div>
    )
}