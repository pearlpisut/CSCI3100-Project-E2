import NavLink from "../components/NavLink";
import "../pages/css/NavbarHeader.scss";

// Creates custom Navbar component taking a "header", and a list of "button"s as an argument

export default function NavbarBuilder(props) {
    const header = props.header;
    const links = props.links
    console.log(links)
    return (
        <div className ="navbar">
            <h2 className ="header">{header}</h2>
            {links.map(link => {
                return <NavLink className ={link.class} url={link.url} text={link.text}/>;
            })}
        </div>
    );
}
