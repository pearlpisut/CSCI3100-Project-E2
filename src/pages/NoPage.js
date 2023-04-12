import Logo from "../components/Logo";

export default function Login() {
    return (
        <>
            <Logo />
            <div>
                <p style={{ fontSize: 40 }}>404: Page not found</p>
            </div>
            <div>
                <span>Want to start playing? </span>
                <a class="url" href="/signup">Log In!</a>
            </div>
        </>
    );
}