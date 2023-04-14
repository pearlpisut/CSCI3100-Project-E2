import GoBoard from "../components/GameBoard";
import NavbarBuilder from "../components/NavbarBuilder";

export default function ViewBoard({ boardArray }) {
    const links = [
        {class: "nav-link", url: "/home", text: "Return to main menu"},
    ];
    return (
        <>
            <NavbarBuilder header="View Board" links={links} />
            <GoBoard boardArray={boardArray}/>
        </>
    );
}