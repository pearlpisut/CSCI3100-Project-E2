import NavLink from "../components/NavLink";

export default function MainMenu(props) {
    const role = props.userRole;
    console.log(role);
    if (role === "admin") {
        return (
            <div class="function-container">
                {/* <NavLink class="joingame" url="/joingame" text="JOIN A GAME"/>
                <NavLink class="options" url="/options" text="OPTIONS"/> */}
                <NavLink className="admin-panel" url="/manage-users" text="MANAGE USERS"/>
            </div>
        );
    }
    else {
        return (
            <div class="function-container">
                <NavLink className="joingame" url="/choose_game" text="JOIN A GAME"/>
                {/* <NavLink className="options" url="/options" text="OPTIONS"/> */}
            </div>
        );
    }
}