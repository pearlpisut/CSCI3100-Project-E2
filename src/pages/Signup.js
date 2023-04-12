import Logo from '../components/Logo'
import SignupForm from "../components/SignupForm";

export default function Signup() {
    return (
        <>
            <Logo />
            <SignupForm />
            <div>
                <span>Already have an account? </span>
                <a class="url" href="/login">Log In</a>
            </div>
        </>
    );
}