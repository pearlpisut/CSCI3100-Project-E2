import NavLink from "../components/NavLink";
import "../pages/css/NavbarHeader.scss";

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