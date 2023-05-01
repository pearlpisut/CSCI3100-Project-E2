import React from "react";

function Square({chooseSquare, val, class_name}) {
  return (
     <div className={"square " + class_name} onClick={chooseSquare} style={{border: 0}}>
        {val}
     </div>
  );
}

export default Square