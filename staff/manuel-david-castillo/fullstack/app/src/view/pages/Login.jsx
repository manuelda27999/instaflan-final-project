import { authenticateUser } from "../../logic/authenticateUser"
import { context } from "../../logic/helpers/context"

export function Login(props) {
    const handleRegisterClick = event => {
        event.preventDefault()

        props.onRegisterClick()
    }

    const handleLoginSubmit = event => {
        event.preventDefault()

        const email = event.target.email.value
        const password = event.target.password.value

        try {
            authenticateUser(email, password)
                .then((result) => {
                    context.token = result

                    props.onLogin()
                })
                .catch((error) => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    return <main className="login">
        <form onSubmit={handleLoginSubmit} className="login-form" >
            <h2>Login</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    className="input"
                    placeholder="email"
                    type="email"
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    className="input"
                    placeholder="password"
                    type="password"
                />
            </div>
            <button className="button">Enter</button>
        </form>
        <a className="link-register" href="#" onClick={handleRegisterClick}>Go to register</a>
    </main>
}