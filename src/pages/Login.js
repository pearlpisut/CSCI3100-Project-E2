import Logo from "../components/Logo";
import LoginForm from "../components/LoginForm";
import "./css/LoginSignup.scss";

export default function Login({setIsAuth}) {
    return (
        <>
            <Logo />
            <LoginForm setIsAuth={setIsAuth}/> 
            <div>
                <span>Don't have an account? </span>
                <a class="url" href = "/signup">Sign Up</a>
            </div>
            <div>
                <span>Temporary link: </span>
                <a class="url" href = "/home">Home</a>
            </div>
        </>
    );
}