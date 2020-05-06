import React from 'react';

function Instructions() {
  return (
    <div>
      < br /> < br />
        <h1 style={{textAlign: 'center'}}>
            Instructions !!
        </h1>
        <p style={{fontSize: '18px', fontWeight: '500', textAlign:'left', paddingLeft: '10%'}}>
            1. Use keyboard (⌨) <strong>ARROW</strong> keys to control your snake <br />
            2. Avoid <strong>crashing</strong> in walls 📓<br />
            3. 🏄 Speed of snake will <strong>increase</strong> with your <strong>score</strong> <br />
            4. If <strong>Game Over</strong> use <strong>ENTER/RETURN</strong> key to restart 🔁<br />
            5. Use 💣💣<strong>ARROW Keys</strong> wisely as counter directional (↔) keypress might kill ☠ your snake 🐍. 
        </p>
    </div>
  );
}

export default Instructions;