export default function NavLink(props) {
  const class_name = props.className;
  const url = props.url;
  const text = props.text;
  return (
    <a className={class_name} href={url}>{text}</a>
  );
}