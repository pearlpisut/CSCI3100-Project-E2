export default function Stone(props) {
    const stone_color = props.stone;
    var col;
    if (stone_color === "white") {
        col = "#D9D9D9";
    }
    else if (stone_color === "black") {
        col = "#282828";
    }
    console.log(col);
    return (
        <div className="stone-container">
            <div className="stone" style={{backgroundColor : col}}></div>
        </div>
    );
}